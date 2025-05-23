import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PostWithDetails } from "@shared/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: PostWithDetails;
}

export default function PostCard({ post }: PostCardProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [isFollowed, setIsFollowed] = useState(post.isFollowed);
  
  const handleLikePost = async () => {
    if (!user) {
      setLocation("/login");
      return;
    }
    
    try {
      if (isLiked) {
        await apiRequest("DELETE", `/api/posts/${post.uuid}/like`);
        setIsLiked(false);
      } else {
        await apiRequest("POST", `/api/posts/${post.uuid}/like`);
        setIsLiked(true);
      }
      
      // Invalidate posts cache
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your like request",
        variant: "destructive",
      });
    }
  };
  
  const handleSavePost = async () => {
    if (!user) {
      setLocation("/login");
      return;
    }
    
    try {
      if (isSaved) {
        await apiRequest("DELETE", `/api/posts/${post.uuid}/save`);
        setIsSaved(false);
      } else {
        await apiRequest("POST", `/api/posts/${post.uuid}/save`);
        setIsSaved(true);
      }
      
      // Invalidate posts cache
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your save request",
        variant: "destructive",
      });
    }
  };
  
  const handleFollowPost = async () => {
    if (!user) {
      setLocation("/login");
      return;
    }
    
    try {
      if (isFollowed) {
        await apiRequest("DELETE", `/api/posts/${post.uuid}/follow`);
        setIsFollowed(false);
      } else {
        await apiRequest("POST", `/api/posts/${post.uuid}/follow`);
        setIsFollowed(true);
      }
      
      // Invalidate posts cache
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your follow request",
        variant: "destructive",
      });
    }
  };
  
  const handleContactClick = () => {
    if (!user) {
      setLocation("/login");
      return;
    }
    
    // In a real app, this would open contact options
    toast({
      title: "Contact",
      description: `Contact ${post.user.name} about this post`,
    });
  };
  
  const navigateToPost = () => {
    setLocation(`/post/${post.uuid}`);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const formatDateTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  return (
    <div className="card bg-white rounded-lg mb-4 overflow-hidden elevation-1 dark:bg-gray-800">
      <div className="p-4">
        {/* User info */}
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center dark:bg-gray-700">
            <span className="text-neutral-600 text-sm font-medium dark:text-gray-200">
              {getInitials(post.user.name)}
            </span>
          </div>
          <div className="ml-3">
            <div className="font-medium dark:text-white">{post.user.name}</div>
            <div className="text-xs text-neutral-500 flex items-center dark:text-gray-400">
              <span>{formatDateTime(post.createdAt)}</span>
              <span className="mx-1">•</span>
              <span className="flex items-center">
                <span className="material-icons text-xs mr-1">
                  {post.visibility === 'public' ? 'public' : 'lock'}
                </span>
                <span>{post.visibility === 'public' ? 'Public' : 'Private'}</span>
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <button className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-700">
              <span className="material-icons text-neutral-600 dark:text-gray-300">more_vert</span>
            </button>
          </div>
        </div>
        
        {/* Post category */}
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs font-medium rounded dark:bg-opacity-20">
            {post.category.displayName}
            {post.subcategory && ` - ${post.subcategory.displayName}`}
          </span>
        </div>
        
        {/* Post content */}
        <h3 className="text-lg font-medium mb-1 cursor-pointer dark:text-white" onClick={navigateToPost}>
          {post.title}
        </h3>
        <p className="text-neutral-700 mb-3 dark:text-gray-300">
          {post.description.length > 200 
            ? `${post.description.substring(0, 200)}...` 
            : post.description
          }
        </p>
        
        {/* Post details */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.metadata && post.metadata.price && (
            <div className="flex items-center bg-neutral-100 rounded px-2 py-1 dark:bg-gray-700">
              <span className="material-icons text-neutral-600 text-sm mr-1 dark:text-gray-300">sell</span>
              <span className="text-sm font-medium dark:text-gray-200">₹{post.metadata.price}</span>
            </div>
          )}
          
          {post.metadata && post.metadata.model && (
            <div className="flex items-center bg-neutral-100 rounded px-2 py-1 dark:bg-gray-700">
              <span className="material-icons text-neutral-600 text-sm mr-1 dark:text-gray-300">calendar_today</span>
              <span className="text-sm dark:text-gray-200">{post.metadata.model} Model</span>
            </div>
          )}
          
          <div className="flex items-center bg-neutral-100 rounded px-2 py-1 dark:bg-gray-700">
            <span className="material-icons text-neutral-600 text-sm mr-1 dark:text-gray-300">location_on</span>
            <span className="text-sm dark:text-gray-200">{post.locationDetails}, {post.location}</span>
          </div>
          
          {post.metadata && post.metadata.date && (
            <div className="flex items-center bg-neutral-100 rounded px-2 py-1 dark:bg-gray-700">
              <span className="material-icons text-neutral-600 text-sm mr-1 dark:text-gray-300">event</span>
              <span className="text-sm dark:text-gray-200">{post.metadata.date}</span>
            </div>
          )}
          
          {post.metadata && post.metadata.time && (
            <div className="flex items-center bg-neutral-100 rounded px-2 py-1 dark:bg-gray-700">
              <span className="material-icons text-neutral-600 text-sm mr-1 dark:text-gray-300">schedule</span>
              <span className="text-sm dark:text-gray-200">{post.metadata.time}</span>
            </div>
          )}
        </div>
        
        {/* Post image */}
        {post.imageUrl && (
          <div className="rounded-lg overflow-hidden mb-3 bg-neutral-200 dark:bg-gray-700">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto object-cover cursor-pointer"
              onClick={navigateToPost}
            />
          </div>
        )}
        
        {/* Post actions */}
        <div className="flex justify-between border-t border-neutral-200 pt-3 dark:border-gray-700">
          <button 
            className={`flex items-center ${isLiked ? 'text-primary' : 'text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'}`}
            onClick={handleLikePost}
          >
            <span className="material-icons mr-1">{isLiked ? 'thumb_up' : 'thumb_up_alt'}</span>
            <span>Like</span>
          </button>
          <button 
            className="flex items-center text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
            onClick={navigateToPost}
          >
            <span className="material-icons mr-1">chat_bubble_outline</span>
            <span>Comment</span>
          </button>
          <button 
            className={`flex items-center ${isSaved ? 'text-primary' : 'text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'}`}
            onClick={handleSavePost}
          >
            <span className="material-icons mr-1">{isSaved ? 'bookmark' : 'bookmark_border'}</span>
            <span>Save</span>
          </button>
          <button 
            className="flex items-center text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
            onClick={handleContactClick}
          >
            <span className="material-icons mr-1">phone</span>
            <span>Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
}
