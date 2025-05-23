import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@shared/validation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = z.infer<typeof createPostSchema>;

export default function CreatePostDialog({ isOpen, onClose }: CreatePostDialogProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [step, setStep] = useState<'category' | 'subcategory' | 'details'>('category');
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  
  // Get categories
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    enabled: isOpen,
  });
  
  // Get subcategories for selected category
  const { data: subcategories } = useQuery({
    queryKey: ["/api/subcategories", selectedCategory],
    enabled: !!selectedCategory && step === 'subcategory',
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      description: "",
      location: user?.location || "chandigarh",
      locationDetails: "",
      visibility: "public",
    },
  });
  
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setStep('subcategory');
  };
  
  const handleSelectSubcategory = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId);
    setStep('details');
  };
  
  const handleBackToCategories = () => {
    setStep('category');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };
  
  const handleBackToSubcategories = () => {
    setStep('subcategory');
    setSelectedSubcategory(null);
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to create a post",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    
    if (!selectedCategory || !selectedSubcategory) {
      toast({
        title: "Missing Information",
        description: "Please select a category and subcategory",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Find category ID from name
      const categoryObj = categories?.data?.find((cat: any) => cat.name === selectedCategory);
      
      if (!categoryObj) {
        toast({
          title: "Error",
          description: "Invalid category selected",
          variant: "destructive",
        });
        return;
      }
      
      const postData = {
        ...values,
        categoryId: categoryObj.id,
        subcategoryId: selectedSubcategory,
      };
      
      await apiRequest("POST", "/api/posts", postData);
      
      toast({
        title: "Success",
        description: "Your post has been created",
      });
      
      // Reset form and dialog
      form.reset();
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setStep('category');
      onClose();
      
      // Invalidate posts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {step === 'category' && "Create Post"}
            {step === 'subcategory' && "Select Subcategory"}
            {step === 'details' && "Post Details"}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'category' && (
          <div>
            <h3 className="font-medium mb-3">Select Category</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {categories?.data?.map((category: any) => (
                <button
                  key={category.id}
                  className="flex flex-col items-center justify-center p-3 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 dark:border-gray-700 dark:hover:border-primary-light dark:hover:bg-primary-dark dark:hover:bg-opacity-20"
                  onClick={() => handleSelectCategory(category.name)}
                >
                  <span className="material-icons text-neutral-700 dark:text-gray-300">{category.icon}</span>
                  <span className="mt-1 text-sm dark:text-gray-200">{category.displayName}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 'subcategory' && (
          <div>
            <div className="mb-4">
              <Button variant="ghost" size="sm" onClick={handleBackToCategories} className="p-0">
                <span className="material-icons mr-1">arrow_back</span>
                <span>Back to Categories</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {subcategories?.data?.map((subcategory: any) => (
                <button
                  key={subcategory.id}
                  className="flex items-center p-3 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 dark:border-gray-700 dark:hover:border-primary-light dark:hover:bg-primary-dark dark:hover:bg-opacity-20"
                  onClick={() => handleSelectSubcategory(subcategory.id)}
                >
                  <span className="text-sm dark:text-gray-200">{subcategory.displayName}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 'details' && (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Button variant="ghost" size="sm" onClick={handleBackToSubcategories} className="p-0">
                <span className="material-icons mr-1">arrow_back</span>
                <span>Back to Subcategories</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={form.getValues().location}
                  onValueChange={(value) => form.setValue("location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amritsar">Amritsar</SelectItem>
                    <SelectItem value="jalandhar">Jalandhar</SelectItem>
                    <SelectItem value="ludhiana">Ludhiana</SelectItem>
                    <SelectItem value="chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="gurugram">Gurugram</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.location && (
                  <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locationDetails">Location Details (max 100 characters)</Label>
                <Input
                  id="locationDetails"
                  placeholder="Enter specific location details"
                  {...form.register("locationDetails")}
                />
                {form.formState.errors.locationDetails && (
                  <p className="text-sm text-red-500">{form.formState.errors.locationDetails.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Details</Label>
                <Textarea
                  id="description"
                  placeholder="Enter post details"
                  rows={4}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  placeholder="Enter image URL"
                  {...form.register("imageUrl")}
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  value={form.getValues().visibility}
                  onValueChange={(value) => form.setValue("visibility", value as "public" | "private")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.visibility && (
                  <p className="text-sm text-red-500">{form.formState.errors.visibility.message}</p>
                )}
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" className="bg-primary text-white dark:bg-primary-dark">
                  Create Post
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
