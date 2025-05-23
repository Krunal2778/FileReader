import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { PostWithDetails } from "@shared/types";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default function DetailedPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  // Fetch post details
  const { data: postData, isLoading } = useQuery({
    queryKey: ["/api/posts", id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Post not found');
      }
      return response.json();
    },
  });

  // Fetch post comments
  const { data: commentsData, isLoading: isLoadingComments } = useQuery({
    queryKey: ["/api/posts", id, "comments"],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}/comments`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to load comments');
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Update state based on post data
  useEffect(() => {
    if (postData?.data) {
      setIsLiked(postData.data.isLiked || false);
      setIsSaved(postData.data.isSaved || false);
      setIsFollowed(postData.data.isFollowed || false);
    }
  }, [postData]);

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/posts/${id}/comments`, { content });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id, "comments"] });
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        return apiRequest("DELETE", `/api/posts/${id}/like`);
      } else {
        return apiRequest("POST", `/api/posts/${id}/like`);
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process like request",
        variant: "destructive",
      });
    },
  });

  // Save post mutation
  const savePostMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        return apiRequest("DELETE", `/api/posts/${id}/save`);
      } else {
        return apiRequest("POST", `/api/posts/${id}/save`);
      }
    },
    onSuccess: () => {
      setIsSaved(!isSaved);
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process save request",
        variant: "destructive",
      });
    },
  });

  // Follow post mutation
  const followPostMutation = useMutation({
    mutationFn: async () => {
      if (isFollowed) {
        return apiRequest("DELETE", `/api/posts/${id}/follow`);
      } else {
        return apiRequest("POST", `/api/posts/${id}/follow`);
      }
    },
    onSuccess: () => {
      setIsFollowed(!isFollowed);
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
      toast({
        title: isFollowed ? "Unfollowed" : "Following",
        description: isFollowed 
          ? "You will no longer receive updates for this post" 
          : "You will now receive updates for this post",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process follow request",
        variant: "destructive",
      });
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setLocation("/login");
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting",
        variant: "destructive",
      });
      return;
    }
    
    addCommentMutation.mutate(comment);
  };

  const handleContactClick = () => {
    if (!user) {
      setLocation("/login");
      return;
    }
    
    // In a real app, this would open contact options
    toast({
      title: "Contact",
      description: `Contact ${postData?.data?.user.name} about this post`,
    });
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

  if (isLoading) {
    return (
      <div id="app" className="flex flex-col min-h-screen bg-neutral-100 dark:bg-gray-900">
        <Header />
        <main className="flex-1 content-area">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <BottomNavigation />
        <SideMenu />
      </div>
    );
  }

  if (!postData?.data) {
    return (
      <div id="app" className="flex flex-col min-h-screen bg-neutral-100 dark:bg-gray-900">
        <Header />
        <main className="flex-1 content-area">
          <div className="container mx-auto px-4 py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <h2 className="text-xl font-bold dark:text-white">Post not found</h2>
                  <p className="text-neutral-600 mt-2 dark:text-gray-400">
                    The post you're looking for doesn't exist or has been removed
                  </p>
                  <Button 
                    className="mt-4 bg-primary text-white dark:bg-primary-dark"
                    onClick={() => setLocation("/")}
                  >
                    Go to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNavigation />
        <SideMenu />
      </div>
    );
  }

  const post = postData.data as PostWithDetails;

  return (
    <div id="app" className="flex flex-col min-h-screen bg-neutral-100 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 content-area">
        <div className="container mx-auto px-4 py-4">
          <Card className="mb-4">
            <CardContent className="pt-6">
              {/* Post header */}
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
              
              {/* Post title and content */}
              <h1 className="text-2xl font-bold mb-2 dark:text-white">{post.title}</h1>
              <p className="text-neutral-700 mb-4 dark:text-gray-300">{post.description}</p>
              
              {/* Post details */}
              <div className="flex flex-wrap gap-2 mb-4">
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
                
                <div className="flex items-center bg-neutral-100 rounded px-2 py-1 dark:bg-gray-700">
                  <span className="material-icons text-neutral-600 text-sm mr-1 dark:text-gray-300">visibility</span>
                  <span className="text-sm dark:text-gray-200">{post.viewCount} views</span>
                </div>
              </div>
              
              {/* Post image */}
              {post.imageUrl && (
                <div className="rounded-lg overflow-hidden mb-4 bg-neutral-200 dark:bg-gray-700">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              {/* Post actions */}
              <div className="flex justify-between border-t border-neutral-200 pt-3 dark:border-gray-700">
                <button 
                  className={`flex items-center ${isLiked ? 'text-primary' : 'text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'}`}
                  onClick={() => likePostMutation.mutate()}
                >
                  <span className="material-icons mr-1">{isLiked ? 'thumb_up' : 'thumb_up_alt'}</span>
                  <span>Like</span>
                  {post.likeCount > 0 && <span className="ml-1">({post.likeCount})</span>}
                </button>
                <button 
                  className="flex items-center text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                  onClick={() => {
                    const commentSection = document.getElementById('comment-section');
                    if (commentSection) {
                      commentSection.scrollIntoView({ behavior: 'smooth' });
                      const commentInput = document.getElementById('comment-input');
                      if (commentInput) {
                        (commentInput as HTMLInputElement).focus();
                      }
                    }
                  }}
                >
                  <span className="material-icons mr-1">chat_bubble_outline</span>
                  <span>Comment</span>
                  {post.commentCount > 0 && <span className="ml-1">({post.commentCount})</span>}
                </button>
                <button 
                  className={`flex items-center ${isSaved ? 'text-primary' : 'text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'}`}
                  onClick={() => savePostMutation.mutate()}
                >
                  <span className="material-icons mr-1">{isSaved ? 'bookmark' : 'bookmark_border'}</span>
                  <span>Save</span>
                </button>
                <button 
                  className={`flex items-center ${isFollowed ? 'text-primary' : 'text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'}`}
                  onClick={() => followPostMutation.mutate()}
                >
                  <span className="material-icons mr-1">{isFollowed ? 'notifications' : 'notifications_none'}</span>
                  <span>Follow</span>
                </button>
                <button 
                  className="flex items-center text-neutral-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                  onClick={handleContactClick}
                >
                  <span className="material-icons mr-1">phone</span>
                  <span>Contact</span>
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Comments section */}
          <Card id="comment-section">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4 dark:text-white">Comments</h3>
              
              {/* Add comment form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        id="comment-input"
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-2"
                      />
                      <Button 
                        type="submit" 
                        size="sm"
                        disabled={addCommentMutation.isPending}
                        className="bg-primary text-white dark:bg-primary-dark"
                      >
                        {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-neutral-100 rounded-lg text-center dark:bg-gray-800">
                  <p className="text-neutral-600 dark:text-gray-400">
                    Please <a onClick={() => setLocation("/login")} className="text-primary font-medium cursor-pointer dark:text-primary-light">login</a> to post comments
                  </p>
                </div>
              )}
              
              {/* Comments list */}
              {isLoadingComments ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : commentsData?.data?.length > 0 ? (
                <div className="space-y-4">
                  {commentsData.data.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center dark:bg-gray-700">
                        <span className="text-neutral-600 text-xs font-medium dark:text-gray-200">
                          {getInitials(comment.user.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-neutral-100 p-3 rounded-lg dark:bg-gray-800">
                          <div className="font-medium text-sm dark:text-white">{comment.user.name}</div>
                          <p className="text-neutral-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 dark:text-gray-400">
                          {formatDateTime(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-neutral-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <BottomNavigation />
      <SideMenu />
    </div>
  );
}
