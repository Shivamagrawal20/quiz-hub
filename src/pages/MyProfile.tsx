import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProfilePage: React.FC = () => {
    // State for profile editing mode
    const [isEditing, setIsEditing] = useState(false);
    // State for user data (mock data)
    const [userData, setUserData] = useState({
      name: 'John Doe',
      email: 'john.doe@example.com',
      educationLevel: 'High School',
      phone: '123-456-7890',
      address: '123 Main St, City, Country',
      emergencyContact: 'Jane Doe (987-654-3210)',
      memberSince: 'January 2023'
    });
    // State for theme
    const [isDarkMode, setIsDarkMode] = useState(false);
    // State for activity expansion
    const [isActivityExpanded, setIsActivityExpanded] = useState(false);
    // State for active tab
    const [activeTab, setActiveTab] = useState('progress');
    // State for session history modal
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [error, setError] = useState('');
    
    // Mock data for math session history
    const mathSessionHistory = [
      { id: 1, date: 'May 15, 2023', topic: 'Calculus - Derivatives', duration: '45 min', score: '92%', status: 'Completed' },
      { id: 2, date: 'May 10, 2023', topic: 'Calculus - Limits', duration: '30 min', score: '88%', status: 'Completed' },
      { id: 3, date: 'May 5, 2023', topic: 'Algebra - Quadratic Equations', duration: '40 min', score: '95%', status: 'Completed' },
      { id: 4, date: 'May 1, 2023', topic: 'Geometry - Triangles', duration: '35 min', score: '90%', status: 'Completed' },
      { id: 5, date: 'April 28, 2023', topic: 'Statistics - Probability', duration: '50 min', score: '85%', status: 'Completed' },
      { id: 6, date: 'April 25, 2023', topic: 'Trigonometry - Sine and Cosine', duration: '45 min', score: '89%', status: 'Completed' },
      { id: 7, date: 'April 20, 2023', topic: 'Pre-Calculus - Functions', duration: '40 min', score: '91%', status: 'Completed' },
      { id: 8, date: 'April 15, 2023', topic: 'Algebra - Systems of Equations', duration: '35 min', score: '93%', status: 'Completed' }
    ];
    
    // Programming session history
    const programmingSessionHistory = [
      { id: 1, date: 'May 12, 2023', topic: 'JavaScript - Arrays', duration: '40 min', score: '90%', status: 'Completed' },
      { id: 2, date: 'May 5, 2023', topic: 'JavaScript - Functions', duration: '35 min', score: '85%', status: 'Completed' },
      { id: 3, date: 'April 30, 2023', topic: 'Python - Basics', duration: '45 min', score: '88%', status: 'Completed' },
      { id: 4, date: 'April 25, 2023', topic: 'HTML/CSS - Flexbox', duration: '30 min', score: '92%', status: 'Completed' },
      { id: 5, date: 'April 20, 2023', topic: 'React - Components', duration: '50 min', score: '87%', status: 'Completed' }
    ];
  
    // Handle showing session history
    const handleShowSessionHistory = (subject: string) => {
      setSelectedSubject(subject);
      setIsHistoryModalOpen(true);
    };
  
    // Get the appropriate session history based on selected subject
    const getSessionHistory = () => {
      switch(selectedSubject) {
        case 'Math':
          return mathSessionHistory;
        case 'Programming':
          return programmingSessionHistory;
        default:
          return [];
      }
    };
  
    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    };
  
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsEditing(false);
      setError('');
    };
  
    // Modal component for session history
    const SessionHistoryModal = () => {
      if (!isHistoryModalOpen) return null;
      
      const sessions = getSessionHistory();
      
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col`}>
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h2 className="text-xl font-semibold">{selectedSubject} Session History</h2>
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-auto flex-grow p-4">
              {sessions.length > 0 ? (
                <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700 text-gray-200' : 'divide-gray-200 text-gray-800'}`}>
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Topic</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {sessions.map((session) => (
                      <tr key={session.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">{session.date}</td>
                        <td className="px-6 py-4">{session.topic}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{session.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{session.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No session history available.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    };
  
    return (
      <>
        <Navbar />
        <div className={`container mx-auto px-4 py-12 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-lg p-6 text-white flex justify-between items-center`}>
              <div>
                <h1 className="text-2xl font-bold">User Profile</h1>
                <p className="text-indigo-100">Manage your account and learning preferences</p>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800 shadow-blue-900/20' : 'bg-white'} shadow-lg rounded-b-lg p-6`}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-lg transition-all`}>
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col items-center text-center mb-6">
                          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 relative group">
                            {userData.name.split(' ').map(name => name[0]).join('')}
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-sm">Change</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Education Level
                          </label>
                          <select
                            name="educationLevel"
                            value={userData.educationLevel}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          >
                            <option value="Elementary School">Elementary School</option>
                            <option value="Middle School">Middle School</option>
                            <option value="High School">High School</option>
                            <option value="College">College</option>
                            <option value="Graduate School">Graduate School</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={userData.address}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Emergency Contact
                          </label>
                          <input
                            type="text"
                            name="emergencyContact"
                            value={userData.emergencyContact}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className={`flex-1 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} py-2 px-4 rounded-lg transition-colors`}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex flex-col items-center text-center">
                          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 transition-transform hover:scale-105 cursor-pointer">
                            {userData.name.split(' ').map(name => name[0]).join('')}
                          </div>
                          <h2 className="text-xl font-semibold">{userData.name}</h2>
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Student</p>
                          
                          <div className="mt-6 w-full">
                            <button 
                              onClick={() => setIsEditing(true)}
                              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all hover:shadow-lg"
                            >
                              Edit Profile
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-4">
                          <div>
                            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Email</h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{userData.email}</p>
                          </div>
                          <div>
                            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Member Since</h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{userData.memberSince}</p>
                          </div>
                          <div>
                            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Education Level</h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{userData.educationLevel}</p>
                          </div>
                          <div>
                            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Phone</h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{userData.phone}</p>
                          </div>
                          <div>
                            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Address</h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{userData.address}</p>
                          </div>
                          <div>
                            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Emergency Contact</h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{userData.emergencyContact}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  {/* Tabs Navigation */}
                  <div className="flex border-b mb-6">
                    <button
                      onClick={() => setActiveTab('progress')}
                      className={`py-2 px-4 font-medium ${activeTab === 'progress' 
                        ? `border-b-2 border-indigo-600 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
                        : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                      } transition-colors`}
                    >
                      Learning Progress
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`py-2 px-4 font-medium ${activeTab === 'activity' 
                        ? `border-b-2 border-indigo-600 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
                        : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                      } transition-colors`}
                    >
                      Recent Activity
                    </button>
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className={`py-2 px-4 font-medium ${activeTab === 'recommendations' 
                        ? `border-b-2 border-indigo-600 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
                        : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                      } transition-colors`}
                    >
                      Recommendations
                    </button>
                  </div>
  
                  {/* Tab Content */}
                  <div className="mb-8" style={{ display: activeTab === 'progress' ? 'block' : 'none' }}>
                    <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div 
                        onClick={() => handleShowSessionHistory('Math')}
                        className={`${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} p-4 rounded-lg transform transition-all hover:scale-105 hover:shadow-md cursor-pointer`}
                      >
                        <div className="text-xl font-bold text-blue-600 mb-1">12</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Math Sessions</div>
                      </div>
                      <div 
                        onClick={() => handleShowSessionHistory('Programming')}
                        className={`${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} p-4 rounded-lg transform transition-all hover:scale-105 hover:shadow-md cursor-pointer`}
                      >
                        <div className="text-xl font-bold text-green-600 mb-1">5</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Programming Sessions</div>
                      </div>
                      <div className={`${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'} p-4 rounded-lg transform transition-all hover:scale-105 hover:shadow-md cursor-pointer`}>
                        <div className="text-xl font-bold text-purple-600 mb-1">0</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Science Sessions</div>
                      </div>
                      <div className={`${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'} p-4 rounded-lg transform transition-all hover:scale-105 hover:shadow-md cursor-pointer`}>
                        <div className="text-xl font-bold text-pink-600 mb-1">0</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Language Sessions</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8" style={{ display: activeTab === 'activity' ? 'block' : 'none' }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Recent Activity</h2>
                      <button 
                        onClick={() => setIsActivityExpanded(!isActivityExpanded)}
                        className={`text-sm ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} transition-colors`}
                      >
                        {isActivityExpanded ? 'Show Less' : 'Show More'}
                      </button>
                    </div>
                    <div className={`border ${isDarkMode ? 'border-gray-700' : ''} rounded-lg overflow-hidden`}>
                      <div className="divide-y">
                        <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}>
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">Completed Calculus Problem</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Derivatives and applications</p>
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 hours ago</div>
                        </div>
                        <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}>
                          <div className="bg-green-100 text-green-600 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">Code Review Completed</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>JavaScript array methods</p>
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>1 day ago</div>
                        </div>
                        
                        {isActivityExpanded && (
                          <>
                            <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}>
                              <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">Started New Course</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Introduction to Python</p>
                              </div>
                              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 days ago</div>
                            </div>
                            <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}>
                              <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">Completed Quiz</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Algebra Fundamentals - 92%</p>
                              </div>
                              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>3 days ago</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: activeTab === 'recommendations' ? 'block' : 'none' }}>
                    <h2 className="text-xl font-semibold mb-4">Learning Recommendations</h2>
                    <div className={`${isDarkMode ? 'bg-indigo-900/30 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100'} p-4 rounded-lg border mb-4 transition-all hover:shadow-md`}>
                      <h3 className={`font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'} mb-2`}>Continue where you left off</h3>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Based on your recent activity, we recommend continuing with Calculus - Integration Techniques</p>
                      <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm hover:shadow-lg transform hover:-translate-y-0.5">
                        Continue Learning
                      </button>
                    </div>
                    
                    <div className={`${isDarkMode ? 'bg-purple-900/30 border-purple-900/50' : 'bg-purple-50 border-purple-100'} p-4 rounded-lg border transition-all hover:shadow-md`}>
                      <h3 className={`font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-800'} mb-2`}>Try something new</h3>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Expand your knowledge with Data Structures & Algorithms - Perfect for your programming journey</p>
                      <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm hover:shadow-lg transform hover:-translate-y-0.5">
                        Start Learning
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Render the session history modal */}
        <SessionHistoryModal />
        <Footer />
      </>
    );
  };
  
  export default ProfilePage; 