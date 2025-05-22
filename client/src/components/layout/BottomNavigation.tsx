import { useLocation } from "wouter";
import { useState } from "react";
import CreatePostDialog from "@/components/post/CreatePostDialog";

export default function BottomNavigation() {
  const [, setLocation] = useLocation();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 elevation-2 md:hidden dark:bg-gray-900 dark:border-gray-800">
        <div className="flex justify-around">
          <button 
            className="flex flex-col items-center py-3 px-5 text-primary dark:text-primary"
            onClick={() => setLocation("/")}
          >
            <span className="material-icons">home</span>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            className="flex flex-col items-center py-3 px-5 text-neutral-600 dark:text-gray-300"
            onClick={() => setLocation("/")}
          >
            <span className="material-icons">notifications</span>
            <span className="text-xs mt-1">Notifications</span>
          </button>
          <button 
            className="flex flex-col items-center py-3 px-5"
            onClick={() => setIsCreatePostOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg -mt-6 dark:bg-secondary-dark">
              <span className="material-icons text-white">add</span>
            </div>
          </button>
          <button 
            className="flex flex-col items-center py-3 px-5 text-neutral-600 dark:text-gray-300"
            onClick={() => setLocation("/my-posts")}
          >
            <span className="material-icons">article</span>
            <span className="text-xs mt-1">My Posts</span>
          </button>
          <button 
            className="flex flex-col items-center py-3 px-5 text-neutral-600 dark:text-gray-300"
            onClick={() => {
              const menuEl = document.getElementById('side-menu');
              if (menuEl) {
                menuEl.classList.add('pointer-events-auto');
                const overlay = menuEl.querySelector('.absolute.inset-0');
                const panel = menuEl.querySelector('.absolute.top-0.bottom-0.left-0');
                
                if (overlay && panel) {
                  overlay.classList.add('opacity-100', 'pointer-events-auto');
                  panel.classList.remove('-translate-x-full');
                }
              }
            }}
          >
            <span className="material-icons">menu</span>
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
      
      {/* Desktop action button */}
      <div className="hidden md:block fixed right-6 bottom-6">
        <button 
          className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-lg dark:bg-secondary-dark"
          onClick={() => setIsCreatePostOpen(true)}
        >
          <span className="material-icons text-white">add</span>
        </button>
      </div>
      
      <CreatePostDialog isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
    </>
  );
}
