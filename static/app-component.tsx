import React, { useState } from 'react';
import { BookOpen, Users, User, Home, Search, Menu, X } from 'lucide-react';

const App = () => {
  const [activeModule, setActiveModule] = useState('child');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Mock data for featured books
  const featuredBooks = [
    { id: 1, title: 'Simba na Rafiki', author: 'Maria Ngugi', coverImage: '/api/placeholder/180/250', level: 'Beginner' },
    { id: 2, title: 'Safari ya Mto', author: 'John Ochieng', coverImage: '/api/placeholder/180/250', level: 'Intermediate' },
    { id: 3, title: 'Ndoto za Juma', author: 'Sarah Kimani', coverImage: '/api/placeholder/180/250', level: 'Advanced' },
    { id: 4, title: 'Mwalimu Mzuri', author: 'Thomas Mboya', coverImage: '/api/placeholder/180/250', level: 'Beginner' }
  ];
  
  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen size={28} />
            <h1 className="text-xl md:text-2xl font-bold">Soma na Furaha</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <button 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${activeModule === 'child' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
              onClick={() => setActiveModule('child')}
            >
              <User size={18} />
              <span>Children</span>
            </button>
            <button 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${activeModule === 'parent' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
              onClick={() => setActiveModule('parent')}
            >
              <Users size={18} />
              <span>Parents</span>
            </button>
            <button 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${activeModule === 'own' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
              onClick={() => setActiveModule('own')}
            >
              <Home size={18} />
              <span>My Books</span>
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-600 text-white">
          <div className="container mx-auto p-4 flex flex-col space-y-2">
            <button 
              className={`flex items-center space-x-2 p-3 rounded-md transition ${activeModule === 'child' ? 'bg-emerald-700' : ''}`}
              onClick={() => {
                setActiveModule('child');
                setIsMenuOpen(false);
              }}
            >
              <User size={18} />
              <span>Children</span>
            </button>
            <button 
              className={`flex items-center space-x-2 p-3 rounded-md transition ${activeModule === 'parent' ? 'bg-emerald-700' : ''}`}
              onClick={() => {
                setActiveModule('parent');
                setIsMenuOpen(false);
              }}
            >
              <Users size={18} />
              <span>Parents</span>
            </button>
            <button 
              className={`flex items-center space-x-2 p-3 rounded-md transition ${activeModule === 'own' ? 'bg-emerald-700' : ''}`}
              onClick={() => {
                setActiveModule('own');
                setIsMenuOpen(false);
              }}
            >
              <Home size={18} />
              <span>My Books</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {activeModule === 'child' && "Welcome to the World of Swahili Books!"}
              {activeModule === 'parent' && "Help Your Child Learn Swahili"}
              {activeModule === 'own' && "Your Swahili Books"}
            </h2>
            <p className="mb-6 text-lg">
              {activeModule === 'child' && "Discover exciting stories with beautiful illustrations in Swahili"}
              {activeModule === 'parent' && "Track your child's progress and get book recommendations"}
              {activeModule === 'own' && "Create, save and share your own books"}
            </p>
            <div className="flex max-w-md mx-auto bg-white rounded-full overflow-hidden shadow-md">
              <input 
                type="text" 
                placeholder="Search for books, stories or authors..." 
                className="w-full px-4 py-3 text-gray-700 focus:outline-none"
              />
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 transition">
                <Search size={20} />
              </button>
            </div>
          </div>
        </section>
        
        {/* Featured Books */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Recommended Books</h3>
            <button className="text-emerald-600 hover:text-emerald-800 font-medium">View All</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
                <div className="relative h-56 bg-gray-200">
                  <img 
                    src={book.coverImage} 
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {book.level}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 mb-1">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Module Specific Content */}
        {activeModule === 'child' && (
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Age Groups</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-yellow-100 rounded-lg p-4 flex items-center justify-center flex-col text-center cursor-pointer hover:bg-yellow-200 transition">
                <span className="text-3xl mb-2">🧸</span>
                <h4 className="font-bold">Ages 3-5</h4>
                <p className="text-sm text-gray-600">Simple stories with lots of pictures</p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 flex items-center justify-center flex-col text-center cursor-pointer hover:bg-green-200 transition">
                <span className="text-3xl mb-2">🚀</span>
                <h4 className="font-bold">Ages 6-8</h4>
                <p className="text-sm text-gray-600">Intermediate stories with activities</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-4 flex items-center justify-center flex-col text-center cursor-pointer hover:bg-blue-200 transition">
                <span className="text-3xl mb-2">🔍</span>
                <h4 className="font-bold">Ages 9-12</h4>
                <p className="text-sm text-gray-600">In-depth stories with questions</p>
              </div>
            </div>
          </section>
        )}
        
        {activeModule === 'parent' && (
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Parent Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <h4 className="font-bold text-lg mb-2">Track Progress</h4>
                <p className="text-gray-600 mb-4">See which books your child has read and track their progress in learning Swahili.</p>
                <button className="text-emerald-600 hover:text-emerald-800 font-medium">View Progress</button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <h4 className="font-bold text-lg mb-2">Book Recommendations</h4>
                <p className="text-gray-600 mb-4">Get book recommendations based on your child's age and progress.</p>
                <button className="text-emerald-600 hover:text-emerald-800 font-medium">Get Recommendations</button>
              </div>
            </div>
          </section>
        )}
        
        {activeModule === 'own' && (
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">My Books</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition">Create New Book</button>
              <button className="bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-2 px-4 rounded-md transition">Upload From Computer</button>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                <h4 className="font-bold text-gray-600 mb-2">No Books Yet</h4>
                <p className="text-gray-500">Start creating or uploading your Swahili books</p>
              </div>
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen size={24} />
                <h2 className="text-xl font-bold">Soma na Furaha</h2>
              </div>
              <p className="text-gray-400 max-w-md">A platform for reading illustrated Swahili books to help children learn and enjoy the Swahili language.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4">Pages</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Library</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Age Groups</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Parent Tools</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">My Books</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Information</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Use</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Soma na Furaha. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
