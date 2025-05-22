import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function SideMenu() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  
  const closeMenu = () => {
    const menuEl = document.getElementById('side-menu');
    if (menuEl) {
      const overlay = menuEl.querySelector('.absolute.inset-0');
      const panel = menuEl.querySelector('.absolute.top-0.bottom-0.left-0');
      
      if (overlay && panel) {
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        panel.classList.add('-translate-x-full');
        
        setTimeout(() => {
          menuEl.classList.remove('pointer-events-auto');
        }, 300);
      }
    }
  };
  
  const navigateTo = (path: string) => {
    setLocation(path);
    closeMenu();
  };
  
  const handleLogout = () => {
    logout();
    setLocation("/login");
    closeMenu();
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <div id="side-menu" className="fixed inset-0 z-50 pointer-events-none">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 pointer-events-none dark:bg-opacity-70"
        onClick={closeMenu}
      ></div>
      <div className="absolute top-0 bottom-0 left-0 w-4/5 max-w-xs bg-white transform -translate-x-full transition-transform duration-300 pointer-events-auto dark:bg-gray-900">
        {user ? (
          <>
            <div className="p-4 bg-primary text-white dark:bg-primary-dark">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center dark:bg-gray-800">
                  <span className="text-primary font-medium dark:text-white">{getInitials(user.name)}</span>
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm opacity-75">{user.email}</div>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              <a 
                href="#" 
                className="flex items-center py-3 px-4 rounded-lg text-primary bg-primary bg-opacity-10 dark:bg-primary-dark dark:bg-opacity-20 dark:text-white"
                onClick={(e) => { e.preventDefault(); navigateTo("/"); }}
              >
                <span className="material-icons mr-3">home</span>
                <span>Home</span>
              </a>
              <a 
                href="#" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
                onClick={(e) => { e.preventDefault(); navigateTo("/my-posts"); }}
              >
                <span className="material-icons mr-3">article</span>
                <span>My Posts</span>
              </a>
              <a 
                href="#" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
                onClick={(e) => { e.preventDefault(); navigateTo("/"); }}
              >
                <span className="material-icons mr-3">bookmark</span>
                <span>My Followed</span>
              </a>
              <a 
                href="#" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
                onClick={(e) => { e.preventDefault(); navigateTo("/"); }}
              >
                <span className="material-icons mr-3">favorite</span>
                <span>My Favorites</span>
              </a>
              <a 
                href="#" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
                onClick={(e) => { e.preventDefault(); navigateTo("/"); }}
              >
                <span className="material-icons mr-3">favorite_border</span>
                <span>Matrimonial</span>
              </a>
              
              <div className="border-t border-neutral-200 my-2 dark:border-gray-700"></div>
              
              <a 
                href="#" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
                onClick={(e) => { e.preventDefault(); navigateTo("/settings"); }}
              >
                <span className="material-icons mr-3">settings</span>
                <span>Settings</span>
              </a>
              <a 
                href="#" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
                onClick={(e) => { e.preventDefault(); navigateTo("/"); }}
              >
                <span className="material-icons mr-3">help</span>
                <span>Support</span>
              </a>
              <a 
                href="#" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
              >
                <span className="material-icons mr-3">logout</span>
                <span>Logout</span>
              </a>
            </nav>
          </>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-semibold mb-4">Welcome to Notice Board</h3>
            <p className="text-neutral-600 mb-8 text-center dark:text-gray-300">
              Please login to access all features and personalize your experience
            </p>
            <button 
              className="w-full bg-primary text-white py-2 rounded-lg mb-3 dark:bg-primary-dark"
              onClick={() => navigateTo("/login")}
            >
              Login
            </button>
            <button 
              className="w-full border border-primary text-primary py-2 rounded-lg dark:border-primary-light dark:text-primary-light"
              onClick={() => navigateTo("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
