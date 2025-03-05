# app.py
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import os
from dotenv import load_dotenv
import json
from supabase import create_client

# Load environment variables
load_dotenv()

app = Flask(__name__, 
    static_folder="static",
    template_folder="templates"
)
app.secret_key = os.getenv('SECRET_KEY', 'development-key')

# Initialize Supabase client
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
supabase = create_client(supabase_url, supabase_key)

# Routes
@app.route('/')
def index():
    """Render the main application page"""
    return render_template('index.html')

# API routes for books
@app.route('/api/books', methods=['GET'])
def get_books():
    """Get all books or filter by category/age/etc."""
    try:
        # Get query parameters
        category = request.args.get('category')
        age_group = request.args.get('age_group')
        level = request.args.get('level')
        
        # Start query
        query = supabase.table('books').select('*')
        
        # Apply filters if provided
        if category:
            query = query.eq('category', category)
        if age_group:
            query = query.eq('age_group', age_group)
        if level:
            query = query.eq('level', level)
            
        # Execute query
        response = query.execute()
        
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get a specific book by ID"""
    try:
        response = supabase.table('books').select('*').eq('id', book_id).execute()
        
        if len(response.data) == 0:
            return jsonify({"error": "Book not found"}), 404
            
        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/books/<int:book_id>/pages', methods=['GET'])
def get_book_pages(book_id):
    """Get all pages for a specific book"""
    try:
        response = supabase.table('book_pages').select('*').eq('book_id', book_id).order('page_number').execute()
        
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        user_type = data.get('user_type')  # parent, child, author
        
        # Register user with Supabase
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        # Store additional user info
        if response.user:
            supabase.table('user_profiles').insert({
                'user_id': response.user.id,
                'user_type': user_type,
                'name': data.get('name'),
                'email': email
            }).execute()
            
        return jsonify({"message": "Registration successful"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Login with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        # Get user profile
        user_profile = supabase.table('user_profiles').select('*').eq('user_id', response.user.id).execute()
        
        # Store in session
        session['user_id'] = response.user.id
        session['user_type'] = user_profile.data[0]['user_type'] if user_profile.data else 'unknown'
        
        return jsonify({
            "access_token": response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "user_type": session['user_type']
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    try:
        # Clear session
        session.clear()
        return jsonify({"message": "Logout successful"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# New route for creating books
@app.route('/api/books', methods=['POST'])
def create_book():
    try:
        title = request.form.get('title')
        description = request.form.get('description')
        cover_image = request.files.get('coverImage')
        pages = []

        # Process pages
        index = 0
        while True:
            page_text = request.form.get(f'pages[{index}][text]')
            if not page_text:
                break
            page_image = request.files.get(f'pages[{index}][image]')
            pages.append({
                'text': page_text,
                'image': page_image.filename if page_image else None
            })
            index += 1

        # Save book to database (example using Supabase)
        response = supabase.table('books').insert({
            'title': title,
            'description': description,
            'cover_image': cover_image.filename if cover_image else None,
            'pages': pages,
            'author_id': session.get('user_id')
        }).execute()

        return jsonify({"message": "Book created successfully", "book_id": response.data[0]['id']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# User data routes
@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        # Get user profile
        profile = supabase.table('user_profiles').select('*').eq('user_id', user_id).execute()
        
        if not profile.data:
            return jsonify({"error": "Profile not found"}), 404
            
        return jsonify(profile.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        # Update profile
        data = request.json
        response = supabase.table('user_profiles').update(data).eq('user_id', user_id).execute()
        
        return jsonify({"message": "Profile updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Reading progress routes
@app.route('/api/progress/<int:child_id>', methods=['GET'])
def get_progress(child_id):
    try:
        user_id = session.get('user_id')
        user_type = session.get('user_type')
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        # If parent, verify child belongs to parent
        if user_type == 'parent':
            child_check = supabase.table('parent_child_relations').select('*').eq('parent_id', user_id).eq('child_id', child_id).execute()
            
            if not child_check.data:
                return jsonify({"error": "Child not found or not authorized"}), 403
        
        # Get reading progress
        progress = supabase.table('reading_progress').select('*').eq('user_id', child_id).execute()
        
        return jsonify(progress.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/progress', methods=['POST'])
def update_progress():
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        # Record reading progress
        data = request.json
        data['user_id'] = user_id
        
        response = supabase.table('reading_progress').insert(data).execute()
        
        return jsonify({"message": "Progress updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Book creation routes (for authors)
@app.route('/api/books', methods=['POST'])
def create_book():
    try:
        user_id = session.get('user_id')
        user_type = session.get('user_type')
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        if user_type != 'own':
            return jsonify({"error": "Not authorized to create books"}), 403
            
        # Create book
        data = request.json
        data['author_id'] = user_id
        
        response = supabase.table('books').insert(data).execute()
        
        return jsonify({"message": "Book created successfully", "book_id": response.data[0]['id']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/books/<int:book_id>/pages', methods=['POST'])
def add_book_page(book_id):
    try:
        user_id = session.get('user_id')
        user_type = session.get('user_type')
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        if user_type != 'own':
            return jsonify({"error": "Not authorized to modify books"}), 403
            
        # Verify book belongs to author
        book_check = supabase.table('books').select('*').eq('id', book_id).eq('author_id', user_id).execute()
        
        if not book_check.data:
            return jsonify({"error": "Book not found or not authorized"}), 403
            
        # Add page
        data = request.json
        data['book_id'] = book_id
        
        response = supabase.table('book_pages').insert(data).execute()
        
        return jsonify({"message": "Page added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Parent-specific routes
@app.route('/api/children', methods=['GET'])
def get_children():
    try:
        user_id = session.get('user_id')
        user_type = session.get('user_type')
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        if user_type != 'parent':
            return jsonify({"error": "Not authorized"}), 403
            
        # Get children
        relations = supabase.table('parent_child_relations').select('child_id').eq('parent_id', user_id).execute()
        
        if not relations.data:
            return jsonify([])
            
        child_ids = [relation['child_id'] for relation in relations.data]
        
        # Get child profiles
        children = supabase.table('user_profiles').select('*').in_('user_id', child_ids).execute()
        
        return jsonify(children.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/children', methods=['POST'])
def add_child():
    try:
        user_id = session.get('user_id')
        user_type = session.get('user_type')
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        if user_type != 'parent':
            return jsonify({"error": "Not authorized"}), 403
            
        # Create child account
        data = request.json
        
        # Register child with Supabase (generate random password)
        import secrets
        import string
        
        # Generate random password
        alphabet = string.ascii_letters + string.digits
        password = ''.join(secrets.choice(alphabet) for i in range(12))
        
        # Register child
        response = supabase.auth.sign_up({
            "email": data.get('email'),
            "password": password
        })
        
        # Store child profile
        child_profile = supabase.table('user_profiles').insert({
            'user_id': response.user.id,
            'user_type': 'child',
            'name': data.get('name'),
            'email': data.get('email'),
            'age': data.get('age')
        }).execute()
        
        # Create parent-child relationship
        relation = supabase.table('parent_child_relations').insert({
            'parent_id': user_id,
            'child_id': response.user.id
        }).execute()
        
        return jsonify({
            "message": "Child added successfully",
            "child_id": response.user.id,
            "temp_password": password
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
 

if __name__ == '__main__':
    app.run(debug=True)
