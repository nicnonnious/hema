# Soma na Furaha - Swahili Book Reader

A web application for children to read illustrated Swahili books, with different modules for children, parents, and content creators.

## Project Overview

This application provides a platform for reading illustrated Swahili books with the following features:

- User-friendly interface with smooth page transitions for books
- Different modules for children, parents, and book creators
- Progress tracking for children's reading
- Analytics and reporting for parents
- Book creation tools for content creators
- Responsive design for all devices

## Technology Stack

- **Frontend**: React/JavaScript with Tailwind CSS
- **Backend**: Flask (Python)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Local Development Setup

### Prerequisites

- Python 3.8+
- Node.js and npm
- Git

### Step 1: Clone the Repository

```bash
git clone [repository-url]
cd swahili-book-reader
```

### Step 2: Backend Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install flask python-dotenv supabase
```

3. Create a `.env` file in the root directory:

```
SECRET_KEY=your-secret-key
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
```

### Step 3: Supabase Setup

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema script from `supabase-schema.sql` in the SQL Editor
4. Get your Supabase URL and anon key from the project settings and add them to your `.env` file

### Step 4: Frontend Setup

1. Create a static and templates folder structure:

```bash
mkdir -p static/js static/css static/images templates
```

2. Convert React components to static assets (for testing purposes):

   - You'll need to compile your React components to JavaScript files
   - Place the compiled JS in the `static/js` folder
   - Create an `index.html` file in the `templates` folder

3. For a full React development setup:

```bash
npx create-react-app frontend
cd frontend
npm install tailwindcss lucide-react recharts
```

### Step 5: Run the Application

1. Start the Flask server:

```bash
python app.py
```

2. Visit `http://localhost:5000` in your browser

## Project Structure

```
swahili-book-reader/
├── app.py                # Flask application
├── static/               # Static files
│   ├── js/               # JavaScript files
│   ├── css/              # CSS files
│   └── images/           # Image files
├── templates/            # HTML templates
│   └── index.html        # Main application template
├── supabase-schema.sql   # Database schema
├── venv/                 # Virtual environment
└── .env                  # Environment variables
```

## Deploying to Production

### Option 1: Deploy to Heroku

1. Create a `Procfile`:

```
web: gunicorn app:app
```

2. Install gunicorn:

```bash
pip install gunicorn
```

3. Create a `requirements.txt` file:

```bash
pip freeze > requirements.txt
```

4. Create a new Heroku app and deploy:

```bash
heroku create soma-na-furaha
git push heroku main
```

5. Set environment variables on Heroku:

```bash
heroku config:set SECRET_KEY=your-secret-key
heroku config:set SUPABASE_URL=your-supabase-url
heroku config:set SUPABASE_KEY=your-supabase-anon-key
```

### Option 2: Deploy to a VPS (e.g., DigitalOcean)

1. Set up a VPS with Ubuntu
2. Install dependencies:

```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx
```

3. Clone the repository and set up the virtual environment
4. Configure Nginx to serve the application:

```
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

5. Set up Gunicorn as a service
6. Obtain an SSL certificate with Let's Encrypt

## Adding Content

### Adding Books

1. Create an account as a content creator ("own" type)
2. Use the book creation interface to add:
   - Book title, description, and cover image
   - Age group and reading level
   - Individual pages with text and images
   - Audio narration (optional)

### Testing with Sample Data

The application includes a set of sample books for testing purposes. You can also create sample users:

1. Parent user:
   - Email: parent@example.com
   - Password: password123

2. Child user:
   - Email: child@example.com
   - Password: password123

3. Creator user:
   - Email: creator@example.com
   - Password: password123

## Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Supabase Documentation](https://supabase.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   - Verify your Supabase credentials
   - Check if your IP is allowed in Supabase

2. **Authentication Problems**:
   - Make sure you've enabled email/password auth in Supabase
   - Verify the JWT secret is correctly configured

3. **Missing Static Files**:
   - Check if your static files are in the correct folders
   - Verify the Flask static folder configuration

For additional help, please reach out to the project maintainers.
