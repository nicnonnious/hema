import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';

const BookReader = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(10); // Demo value
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bookRef = useRef(null);
  
  // Demo book content
  const bookPages = [
    {
      image: '/api/placeholder/800/600',
      text: 'Simba aliishi katika msitu mkubwa. Alikuwa na marafiki wengi.',
      audioUrl: '#'
    },
    {
      image: '/api/placeholder/800/600',
      text: 'Siku moja, Simba aliamua kwenda safari. Alitaka kuona ulimwengu.',
      audioUrl: '#'
    },
    {
      image: '/api/placeholder/800/600',
      text: 'Alikutana na Twiga. Twiga alikuwa mrefu sana na mzuri.',
      audioUrl: '#'
    },
    {
      image: '/api/placeholder/800/600',
      text: 'Simba na Twiga walikuwa marafiki wazuri. Walisafiri pamoja.',
      audioUrl: '#'
    },
    {
      image: '/api/placeholder/800/600',
      text: 'Walikutana na Tembo. Tembo alikuwa mkubwa na mwenye nguvu.',
      audioUrl: '#'
    },
    {
      image: '/api/placeholder/800/600',
      text: 'Wote watatu walianza safari mpya pamoja. Walikuwa wanafurahi sana.',
      audioUrl: '#'
    }
  ];
  
  useEffect(() => {
    setTotalPages(bookPages.length);
  }, []);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      bookRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle page turning with smooth transition
  const turnPage = (direction) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    const nextPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages - 1)
      : Math.max(currentPage - 1, 0);
    
    setTimeout(() => {
      setCurrentPage(nextPage);
      setIsTransitioning(false);
    }, 300);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        turnPage('next');
      } else if (e.key === 'ArrowLeft') {
        turnPage('prev');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isTransitioning]);
  
  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  return (
    <div 
      ref={bookRef}
      className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : 'relative bg-white rounded-lg shadow-lg'}`}
    >
      {/* Book Header */}
      <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Lion and Friends</h2>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="p-2 rounded-full hover:bg-emerald-700 transition"
            aria-label={isAudioEnabled ? "Disable audio narration" : "Enable audio narration"}
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-emerald-700 transition"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
      
      {/* Book Content */}
      <div className={`flex-grow flex items-center justify-center relative overflow-hidden ${isFullscreen ? 'p-4' : 'p-2'}`}>
        {/* Page turning animation container */}
        <div 
          className={`w-full h-full flex items-center justify-center transition-transform duration-300 ${
            isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
          }`}
        >
          {/* Book page content */}
          <div className="max-w-4xl w-full mx-auto bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="relative">
              <img 
                src={bookPages[currentPage]?.image} 
                alt={`Page ${currentPage + 1}`}
                className="w-full object-cover"
              />
              
              {/* Text overlay at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 text-lg md:text-xl">
                {bookPages[currentPage]?.text}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button 
          onClick={() => turnPage('prev')} 
          disabled={currentPage === 0}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition ${
            currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={() => turnPage('next')} 
          disabled={currentPage === totalPages - 1}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition ${
            currentPage === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70'
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Book Footer */}
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Maria Ngugi</span> | Beginner Level
        </div>
        <div className="text-sm font-medium">
          Page {currentPage + 1} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default BookReader;
