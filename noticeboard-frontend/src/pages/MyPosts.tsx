import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import BottomNavigation from "@/components/layout/BottomNavigation";
import PostCard from "@/components/post/PostCard";
import { PostWithDetails } from "@shared/types";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyPosts() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("my-posts");
  
  // Fetch user's posts
  const { data: myPostsData, isLoading: isLoadingMyPosts } = useQuery({
    queryKey: ["/api/posts/user"],
    enabled: !!user,
  });
  
  // Fetch saved posts
  const { data: savedPostsData, isLoading: isLoadingSaved } = useQuery({
    queryKey: ["/api/posts/saved"],
    enabled: !!user && activeTab === "saved",
  });
  
  // Fetch followed posts
  const { data: followedPostsData, isLoading: isLoadingFollowed } = useQuery({
    queryKey: ["/api/posts/followed"],
    enabled: !!user && activeTab === "followed",
  });
  
  if (!user) {
    setLocation("/login");
    return null;
  }
  
  const isLoading = 
    (activeTab === "my-posts" && isLoadingMyPosts) ||
    (activeTab === "saved" && isLoadingSaved) ||
    (activeTab === "followed" && isLoadingFollowed);
  
  const postsData = 
    activeTab === "my-posts" 
      ? myPostsData 
      : activeTab === "saved" 
        ? savedPostsData 
        : followedPostsData;
  
  return (
    <div id="app" className="flex flex-col min-h-screen bg-neutral-100 dark:bg-gray-900">
      <Header />
      
      {/* Main content */}
      <main className="flex-1 content-area">
        <div className="container mx-auto px-4 py-4">
          <div className="bg-white rounded-lg mb-4 p-4 elevation-1 dark:bg-gray-800">
            <h1 className="text-xl font-bold mb-2 dark:text-white">My Content</h1>
            
            <Tabs defaultValue="my-posts" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="my-posts">My Posts</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="followed">Followed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-posts" className="space-y-4">
                {renderPosts("my-posts")}
              </TabsContent>
              
              <TabsContent value="saved" className="space-y-4">
                {renderPosts("saved")}
              </TabsContent>
              
              <TabsContent value="followed" className="space-y-4">
                {renderPosts("followed")}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
      <SideMenu />
    </div>
  );
  
  function renderPosts(tabType: string) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!postsData?.data?.data || postsData.data.data.length === 0) {
      return (
        <div className="text-center py-10">
          <div className="text-3xl mb-2">📭</div>
          <h3 className="text-xl font-medium mb-2 dark:text-white">No posts found</h3>
          <p className="text-neutral-600 mb-6 dark:text-gray-400">
            {tabType === "my-posts"
              ? "You haven't created any posts yet"
              : tabType === "saved"
                ? "You haven't saved any posts yet"
                : "You haven't followed any posts yet"}
          </p>
          {tabType === "my-posts" && (
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg dark:bg-primary-dark"
              onClick={() => {
                const createButtons = document.querySelectorAll('[data-event="click:createPost"]');
                if (createButtons.length > 0) {
                  (createButtons[0] as HTMLElement).click();
                }
              }}
            >
              Create a new post
            </button>
          )}
        </div>
      );
    }
    
    return postsData.data.data.map((post: PostWithDetails) => (
      <PostCard key={post.uuid} post={post} />
    ));
  }
}
