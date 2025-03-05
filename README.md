# HEMA - Children's Swahili Learning Platform

HEMA is a web application designed to help children learn and enjoy the Swahili language through illustrated books, with separate modules for children, parents, and content creators.

![HEMA Platform](https://via.placeholder.com/800x400?text=HEMA+Platform)

## 🌟 Project Overview

HEMA provides a comprehensive platform for Swahili language learning with the following key features:

- User-friendly interface with smooth page transitions for reading books
- Three distinct modules:
  - **Children's Module**: Age-appropriate books with interactive features
  - **Parents' Module**: Tools to track children's progress and recommend books
  - **Creator's Module**: Tools to create and publish original Swahili books
- Progress tracking and gamification for children
- Detailed analytics and reporting for parents
- Responsive design that works across all devices

## 🛠️ Technology Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Flask (Python)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Hooks

## 📚 Features

### For Children
- Interactive book reader with beautiful illustrations
- Age-appropriate content categorization
- Reading progress tracking
- Vocabulary building tools
- Achievements and badges for motivation
- Audio narration support

### For Parents
- Child account management
- Reading progress monitoring
- Book recommendations based on reading level
- Activity reports and analytics
- Ability to set reading goals

### For Content Creators
- Book creation interface
- Image and audio upload capabilities
- Publishing tools
- Analytics on book performance
- Reader demographics insights

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js and npm
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hema.git
cd hema
```

2. Set up the backend
```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp env-example.txt .env
# Edit .env with your Supabase credentials
```

3. Set up the database
- Create a Supabase account and project
- Run the SQL script from `supabase-schema.sql` in the Supabase SQL Editor

4. Start the development server
```bash
flask run
```

5. Visit `http://localhost:5000` in your browser

## 📋 Project Structure

```
hema/
├── app.py                # Flask application main file
├── static/               # Static assets
│   ├── js/               # JavaScript files
│   ├── css/              # CSS files
│   └── images/           # Image assets
├── templates/            # HTML templates
├── components/           # React components
│   ├── app-component.tsx        # Main application component
│   ├── book-reader.tsx          # Book reader component
│   ├── BookCreationForm.tsx     # Book creation interface
│   └── profile-component.tsx    # User profile management
├── supabase-schema.sql   # Database schema
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (gitignored)
└── README.md             # This file
```

## 🔒 Authentication and Authorization

HEMA implements a role-based access control system:

- **Children**: Access to age-appropriate books and their own progress
- **Parents**: Access to their children's profiles, progress, and management tools
- **Content Creators**: Access to book creation tools and analytics for their content

## 🌐 Deployment

### Production Deployment

1. Set up a production server (e.g., AWS, DigitalOcean, Heroku)
2. Configure environment variables for production
3. Set up a proper web server (Nginx, Apache) with SSL
4. Configure database connection pooling and caching for optimal performance

## 🤝 Contributing

We welcome contributions to HEMA! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- All the contributors who have helped shape HEMA
- The Swahili language community for inspiration and support
- Open-source libraries and tools that made this project possible

## 📧 Contact

For questions and support, please reach out to [your-email@example.com](mailto:your-email@example.com).

---

Made with ❤️ to promote Swahili language education for children
