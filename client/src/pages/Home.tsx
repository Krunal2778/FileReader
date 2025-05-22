import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LocationFilter from "@/components/post/LocationFilter";
import TabNavigation from "@/components/post/TabNavigation";
import PostCard from "@/components/post/PostCard";
import { PostWithDetails } from "@shared/types";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("around-me");
  const [userLocation, setUserLocation] = useState<string>(user?.location || "chandigarh");
  
  // Set user location from the auth context when available
  useEffect(() => {
    if (user?.location) {
      setUserLocation(user.location);
    }
  }, [user]);
  
  // Fetch posts based on active tab and location
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["/api/posts", activeTab === "around-me" ? null : activeTab, userLocation],
    queryFn: async () => {
      let url = `/api/posts?location=${userLocation}`;
      
      if (activeTab !== "around-me") {
        url += `&category=${activeTab}`;
      }
      
      return fetch(url, {
        credentials: "include",
      }).then((res) => res.json());
    },
  });
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleLocationChange = (location: string) => {
    setUserLocation(location);
  };
  
  if (!user && localStorage.getItem("auth_token")) {
    // Still loading user data, show a loading state
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div id="app" className="flex flex-col min-h-screen bg-neutral-100 dark:bg-gray-900">
      <Header />
      
      {/* Mobile search (visible only on small screens) */}
      <div className="md:hidden px-4 py-2 bg-white elevation-1 dark:bg-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notices..."
            className="w-full py-2 px-4 bg-neutral-100 rounded-full focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-gray-400">
            search
          </span>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 content-area">
        <div className="container mx-auto px-4 py-4">
          {/* Location filter */}
          <LocationFilter 
            currentLocation={userLocation} 
            onLocationChange={handleLocationChange} 
          />
          
          {/* Tab navigation */}
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
          
          {/* Tab content */}
          <div className="tab-content active">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : postsData?.data?.data.length > 0 ? (
              postsData.data.data.map((post: PostWithDetails) => (
                <PostCard key={post.uuid} post={post} />
              ))
            ) : (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">📭</div>
                <h3 className="text-xl font-medium mb-2 dark:text-white">No posts found</h3>
                <p className="text-neutral-600 mb-6 dark:text-gray-400">
                  {activeTab === "around-me"
                    ? `There are no posts in ${userLocation.charAt(0).toUpperCase() + userLocation.slice(1)} yet`
                    : `There are no ${activeTab} posts in ${userLocation.charAt(0).toUpperCase() + userLocation.slice(1)} yet`}
                </p>
                {user && (
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-lg dark:bg-primary-dark"
                    onClick={() => {
                      const createButtons = document.querySelectorAll('[data-event="click:createPost"]');
                      if (createButtons.length > 0) {
                        (createButtons[0] as HTMLElement).click();
                      }
                    }}
                  >
                    Create the first post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
      <SideMenu />
    </div>
  );
}
