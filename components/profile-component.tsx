import React, { useState } from 'react';
import { User, Users, BookOpen, Award, Settings, LogOut, Book, BarChart } from 'lucide-react';

const ProfileManagement = ({ userType = 'parent' }) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data
  const userData = {
    parent: {
      name: 'Maria Wanjiku',
      email: 'maria@example.com',
      children: [
        { id: 1, name: 'Juma Wanjiku', age: 8, booksRead: 12, lastActive: '2025-03-02' },
        { id: 2, name: 'Amina Wanjiku', age: 6, booksRead: 8, lastActive: '2025-03-04' }
      ]
    },
    child: {
      name: 'Juma Wanjiku',
      age: 8,
      readingLevel: 'Intermediate',
      points: 240,
      badges: ['Fast Reader', 'Explorer', 'Book Worm'],
      booksRead: 12,
      favoriteCategory: 'Adventure'
    },
    own: {
      name: 'Thomas Ochieng',
      email: 'thomas@example.com',
      createdBooks: 5,
      followers: 18
    }
  };
  
  // Get the appropriate user data based on the userType
  const user = userData[userType];
  
  // Render tabs based on user type
  const renderTabs = () => {
    const commonTabs = [
      { id: 'profile', label: 'Profile', icon: <User size={18} /> },
      { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
    ];
    
    if (userType === 'parent') {
      return [
        ...commonTabs,
        { id: 'children', label: 'Children', icon: <Users size={18} /> },
        { id: 'reports', label: 'Reports', icon: <BarChart size={18} /> }
      ];
    } else if (userType === 'child') {
      return [
        ...commonTabs,
        { id: 'progress', label: 'Progress', icon: <Award size={18} /> },
        { id: 'books', label: 'My Books', icon: <BookOpen size={18} /> }
      ];
    } else if (userType === 'own') {
      return [
        ...commonTabs,
        { id: 'mybooks', label: 'My Books', icon: <Book size={18} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart size={18} /> }
      ];
    }
    
    return commonTabs;
  };
  
  // Render content based on active tab and user type
  const renderContent = () => {
    if (activeTab === 'profile') {
      if (userType === 'parent') {
        return <ParentProfile user={user} />;
      } else if (userType === 'child') {
        return <ChildProfile user={user} />;
      } else {
        return <OwnProfile user={user} />;
      }
    } else if (activeTab === 'children' && userType === 'parent') {
      return <ChildrenManagement children={user.children} />;
    } else if (activeTab === 'progress' && userType === 'child') {
      return <ChildProgress user={user} />;
    } else if ((activeTab === 'mybooks' && userType === 'own') || (activeTab === 'books' && userType === 'child')) {
      return <BooksManagement userType={userType} />;
    } else if (activeTab === 'settings') {
      return <SettingsPanel userType={userType} />;
    } else if (activeTab === 'reports' && userType === 'parent') {
      return <ReportsPanel children={user.children} />;
    } else if (activeTab === 'analytics' && userType === 'own') {
      return <AnalyticsPanel />;
    }
    
    // Default content if no match
    return <div className="text-center py-12">Content for {activeTab} is under development.</div>;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-emerald-600 text-white p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          {userType === 'parent' && 'Wasifu wa Mzazi'}
          {userType === 'child' && 'Wasifu wa Mtoto'}
          {userType === 'own' && 'Wasifu Wangu'}
        </h2>
        <p className="text-emerald-100">
          {userType === 'parent' && 'Simamia akaunti yako na maendeleo ya watoto wako'}
          {userType === 'child' && 'Angalia maendeleo yako na mafanikio'}
          {userType === 'own' && 'Simamia vitabu vyako na watumiaji wako'}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="bg-gray-50 md:w-64 border-r border-gray-200">
          <nav className="p-4">
            <ul className="space-y-1">
              {renderTabs().map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-gray-200">
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Content Area */}
        <div className="flex-grow p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
// Sub-components for different profile views
const ParentProfile = ({ user }) => (
  <div>
    <h3 className="text-xl font-bold mb-6">Account Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-500 mb-2">Name</h4>
        <p className="text-lg">{user.name}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-500 mb-2">Email</h4>
        <p className="text-lg">{user.email}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-500 mb-2">Children</h4>
        <p className="text-lg">{user.children.length}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-500 mb-2">Account Type</h4>
        <div className="flex items-center">
          <span className="text-lg">Premium</span>
          <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">PRO</span>
        </div>
      </div>
    </div>
    
    <h3 className="text-xl font-bold mt-8 mb-6">Children's Reading Summary</h3>
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Books Read</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {user.children.map((child) => (
            <tr key={child.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{child.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{child.age} years</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{child.booksRead}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{child.lastActive}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600">
                <button className="hover:text-emerald-800">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ChildProfile = ({ user }) => (
  <div>
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="mb-4 md:mb-0">
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-gray-600">Age: {user.age} • Level: {user.readingLevel}</p>
      </div>
      <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg flex items-center">
        <Award size={20} className="mr-2" />
        <span className="font-bold">{user.points} Points</span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {user.badges.map((badge, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award size={32} className="text-emerald-600" />
          </div>
          <h4 className="font-bold text-gray-800">{badge}</h4>
        </div>
      ))}
    </div>
    
    <h3 className="text-xl font-bold mb-4">Reading Progress</h3>
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Books Read</span>
        <span className="font-bold">{user.booksRead}/20</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${(user.booksRead / 20) * 100}%` }}></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Keep reading to reach your monthly goal!</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Reading Preferences</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-500 mb-1">Favorite Category</h4>
            <p className="text-lg">{user.favoriteCategory}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500 mb-1">Time Spent Reading</h4>
            <p className="text-lg">4 hours this week</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Recommended Next Books</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="h-10 w-10 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium">The Brave Elephant</h4>
                <p className="text-sm text-gray-500">Adventure • Intermediate</p>
              </div>
            </li>
            <li className="flex items-center">
              <div className="h-10 w-10 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium">Mountain Journey</h4>
                <p className="text-sm text-gray-500">Adventure • Intermediate</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const OwnProfile = ({ user }) => (
  <div>
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div className="mb-4 md:mb-0">
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition">
        Edit Profile
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center h-16 w-16 bg-emerald-100 rounded-full mb-4">
          <Book size={32} className="text-emerald-600" />
        </div>
        <h4 className="text-2xl font-bold text-center">{user.createdBooks}</h4>
        <p className="text-gray-600 text-center">Books Created</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center h-16 w-16 bg-emerald-100 rounded-full mb-4">
          <Users size={32} className="text-emerald-600" />
        </div>
        <h4 className="text-2xl font-bold text-center">{user.followers}</h4>
        <p className="text-gray-600 text-center">Followers</p>
      </div>
    </div>
    
    <h3 className="text-xl font-bold mb-4">Your Books</h3>
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="grid grid-cols-1 divide-y divide-gray-200">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded mr-4 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium">The Adventures of Moja</h4>
              <p className="text-sm text-gray-500">Created on 2025-02-15 • 532 views</p>
            </div>
          </div>
          <div>
            <button className="text-emerald-600 hover:text-emerald-800 mr-3">Edit</button>
            <button className="text-gray-600 hover:text-gray-800">Share</button>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded mr-4 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium">Counting Animals</h4>
              <p className="text-sm text-gray-500">Created on 2025-01-20 • 348 views</p>
            </div>
          </div>
          <div>
            <button className="text-emerald-600 hover:text-emerald-800 mr-3">Edit</button>
            <button className="text-gray-600 hover:text-gray-800">Share</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const ChildrenManagement = ({ children }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold">Manage Children</h3>
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition">
        Add Child
      </button>
    </div>
    
    <div className="grid grid-cols-1 gap-4">
      {children.map((child) => (
        <div key={child.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="font-bold text-lg">{child.name}</h4>
            <p className="text-gray-600">Age: {child.age} • Books Read: {child.booksRead}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded hover:bg-emerald-200 transition">
              View Progress
            </button>
            <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition">
              Book Recommendations
            </button>
            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition">
              Edit Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChildProgress = ({ user }) => (
  <div>
    <h3 className="text-xl font-bold mb-6">Reading Progress</h3>
    
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h4 className="font-bold mb-4">Reading Activity</h4>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {/* Mock calendar heatmap */}
        {Array.from({ length: 28 }).map((_, index) => (
          <div 
            key={index} 
            className={`h-8 rounded ${
              Math.random() > 0.5 ? 'bg-emerald-300' : 'bg-emerald-100'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Last 4 Weeks</span>
        <div className="flex items-center">
          <span className="mr-2">Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-emerald-100 rounded"></div>
            <div className="w-3 h-3 bg-emerald-200 rounded"></div>
            <div className="w-3 h-3 bg-emerald-300 rounded"></div>
            <div className="w-3 h-3 bg-emerald-400 rounded"></div>
          </div>
          <span className="ml-2">More</span>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-bold mb-4">Reading Stats</h4>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          <div className="p-4 flex justify-between">
            <span className="text-gray-600">Books Completed</span>
            <span className="font-bold">{user.booksRead}</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-gray-600">Reading Level</span>
            <span className="font-bold">{user.readingLevel}</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-gray-600">Words Learned</span>
            <span className="font-bold">127</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-gray-600">Points Earned</span>
            <span className="font-bold">{user.points}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold mb-4">Recently Read Books</h4>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          <div className="p-4 flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
            <div>
              <h5 className="font-medium">Lion and Friends</h5>
              <p className="text-sm text-gray-500">Completed on March 1, 2025</p>
            </div>
          </div>
          <div className="p-4 flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
            <div>
              <h5 className="font-medium">The Magic Tree</h5>
              <p className="text-sm text-gray-500">Completed on February 26, 2025</p>
            </div>
          </div>
          <div className="p-4 flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
            <div>
              <h5 className="font-medium">The River Journey</h5>
              <p className="text-sm text-gray-500">Completed on February 20, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BooksManagement = ({ userType }) => {
  const [view, setView] = useState('grid');
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-xl font-bold mb-3 md:mb-0">
          {userType === 'child' ? 'My Book Collection' : 'My Created Books'}
        </h3>
        <div className="flex space-x-2">
          {userType === 'own' && (
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition">
              Create New Book
            </button>
          )}
          <div className="bg-white border border-gray-200 rounded-md flex">
            <button 
              className={`px-3 py-2 ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button 
              className={`px-3 py-2 ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-3">
                <h4 className="font-medium">Book Title {index + 1}</h4>
                <p className="text-xs text-gray-500">
                  {userType === 'child' ? 'Read on Mar 1, 2025' : 'Created on Mar 1, 2025'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-12 bg-gray-200 rounded mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Book Title {index + 1}</h4>
                  <p className="text-sm text-gray-500">
                    {userType === 'child' 
                      ? `Read on Mar ${index + 1}, 2025 • Category: Adventure` 
                      : `Created on Mar ${index + 1}, 2025 • Views: ${(index + 1) * 78}`}
                  </p>
                </div>
              </div>
              <div>
                {userType === 'child' ? (
                  <button className="text-emerald-600 hover:text-emerald-800">Read Again</button>
                ) : (
                  <>
                    <button className="text-emerald-600 hover:text-emerald-800 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-800">Share</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const SettingsPanel = ({ userType }) => (
  <div>
    <h3 className="text-xl font-bold mb-6">Account Settings</h3>
    
    <div className="space-y-6">
      <div>
        <h4 className="font-bold mb-4">Profile Information</h4>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              defaultValue={userType === 'parent' ? 'Maria Wanjiku' : userType === 'child' ? 'Juma Wanjiku' : 'Thomas Ochieng'}
            />
          </div>
          
          {userType !== 'child' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                defaultValue={userType === 'parent' ? 'maria@example.com' : 'thomas@example.com'}
              />
            </div>
          )}
          
          {userType === 'child' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                defaultValue="8"
              />
            </div>
          )}
          
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition">
            Save Changes
          </button>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold mb-4">Password</h4>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition">
            Update Password
          </button>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold mb-4">Notification Settings</h4>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Email Notifications</h5>
              <p className="text-sm text-gray-500">Receive updates about your account via email</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" id="toggle1" className="sr-only" defaultChecked />
              <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </div>
          
          {userType === 'parent' && (
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Child Activity Alerts</h5>
                <p className="text-sm text-gray-500">Get notified when your child completes a book</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" id="toggle2" className="sr-only" defaultChecked />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
          )}
          
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ReportsPanel = ({ children }) => (
  <div>
    <h3 className="text-xl font-bold mb-6">Reading Reports</h3>
    
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h4 className="text-lg font-bold mb-2 md:mb-0">Monthly Reading Summary</h4>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-md hover:bg-gray-100">
            This Month
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100">
            Last 3 Months
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100">
            All Time
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <h5 className="text-gray-500 text-sm mb-1">Total Books Read</h5>
          <p className="text-3xl font-bold text-emerald-600">24</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <h5 className="text-gray-500 text-sm mb-1">Average Reading Time</h5>
          <p className="text-3xl font-bold text-emerald-600">18 min</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <h5 className="text-gray-500 text-sm mb-1">Completion Rate</h5>
          <p className="text-3xl font-bold text-emerald-600">85%</p>
        </div>
      </div>
      
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Reading activity chart would display here</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-lg font-bold mb-4">Child Performance</h4>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="space-y-4">
            {children.map((child) => (
              <div key={child.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{child.name}</h5>
                  <span className="text-sm text-gray-500">{child.booksRead} books</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-emerald-600 h-2.5 rounded-full" 
                    style={{ width: `${(child.booksRead / 20) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>Goal: 20 books</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-bold mb-4">Popular Categories</h4>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h5 className="font-medium">Adventure</h5>
              <span className="text-sm text-gray-500">42%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <h5 className="font-medium">Animal Stories</h5>
              <span className="text-sm text-gray-500">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <h5 className="font-medium">Fantasy</h5>
              <span className="text-sm text-gray-500">18%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '18%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <h5 className="font-medium">Educational</h5>
              <span className="text-sm text-gray-500">10%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsPanel = () => (
  <div>
    <h3 className="text-xl font-bold mb-6">Book Analytics</h3>
    
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h4 className="text-lg font-bold mb-6">Reading Metrics</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <h5 className="text-gray-500 text-sm mb-1">Total Reads</h5>
          <p className="text-3xl font-bold text-gray-700">1,248</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <h5 className="text-gray-500 text-sm mb-1">Unique Readers</h5>
          <p className="text-3xl font-bold text-gray-700">463</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <h5 className="text-gray-500 text-sm mb-1">Avg. Time Spent</h5>
          <p className="text-3xl font-bold text-gray-700">8 min</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <h5 className="text-gray-500 text-sm mb-1">Completion Rate</h5>
          <p className="text-3xl font-bold text-gray-700">76%</p>
        </div>
      </div>
      
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Reading metrics chart would display here</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-lg font-bold mb-4">Top Performing Books</h4>
        <div className="bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Book Title {index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{200 - index * 30}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5 - index * 0.5)}
                      {'☆'.repeat(index * 0.5)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-bold mb-4">Reader Demographics</h4>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="mb-6">
            <h5 className="font-medium mb-3">Age Groups</h5>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Ages 3-5</span>
                  <span className="text-sm text-gray-500">24%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Ages 6-8</span>
                  <span className="text-sm text-gray-500">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Ages 9-12</span>
                  <span className="text-sm text-gray-500">31%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '31%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium mb-3">Reading Levels</h5>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <h6 className="font-bold text-red-800">Beginner</h6>
                <p className="text-lg font-bold mt-1">35%</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <h6 className="font-bold text-yellow-800">Intermediate</h6>
                <p className="text-lg font-bold mt-1">42%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <h6 className="font-bold text-green-800">Advanced</h6>
                <p className="text-lg font-bold mt-1">23%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);