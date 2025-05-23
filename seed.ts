import { db } from "./server/db";
import * as schema from "./shared/schema";
import bcrypt from "bcryptjs";

// Seed database with initial data
async function seed() {
  console.log("Starting database seeding...");
  
  // Create test user
  console.log("Creating test user...");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);
  
  const [testUser] = await db.insert(schema.users).values({
    username: "testuser",
    email: "test@example.com",
    password: hashedPassword,
    name: "Test User",
    phone: "1234567890",
    role: "user",
    visibility: "public",
    location: "chandigarh",
    isVerified: true
  }).returning().catch(e => {
    console.log("User already exists, skipping creation");
    return db.select().from(schema.users).where(schema.users.email === "test@example.com");
  });
  
  // Create categories and subcategories
  console.log("Creating categories and subcategories...");
  
  // All categories from the requirements
  const categoryData = [
    { name: "announcement", displayName: "Announcement", icon: "bell", subcategories: ["travel plan", "opening", "change of location"] },
    { name: "event", displayName: "Event", icon: "calendar", subcategories: ["blood donation", "wellness/fitness", "medical camp", "environmental/community", "club", "restaurant", "office", "movie", "artist", "radio", "exhibition", "competition", "show", "sale", "workshop", "religious", "comedy"] },
    { name: "traffic_alert", displayName: "Traffic Alert", icon: "alert-triangle", subcategories: ["jam", "vehicle stuck", "route change", "wall of fame", "signal faulty"] },
    { name: "looking_for", displayName: "Looking For", icon: "search", subcategories: ["custom", "doctor", "professional", "boutique", "teacher"] },
    { name: "rental_to_let", displayName: "Rental-To let", icon: "home", subcategories: ["residential", "commercial", "paying guest", "industrial"] },
    { name: "reviews", displayName: "Reviews", icon: "star", subcategories: ["movies", "shows", "restaurants", "service", "products"] },
    { name: "recommendations", displayName: "Recommendations", icon: "thumbs-up", subcategories: ["general recommendations"] },
    { name: "news", displayName: "News", icon: "newspaper", subcategories: ["local news", "state news", "regional news", "national news", "international news", "breaking news"] },
    { name: "citizen_reporter", displayName: "Citizen Reporter", icon: "users", subcategories: ["awareness", "event coverage", "illegal activity report", "accident", "complaint/grievances"] },
    { name: "community_services", displayName: "Community Services", icon: "heart", subcategories: ["blood", "plantation", "cleaning", "donations", "medical camp", "meet up for a cause"] },
    { name: "health_capsule", displayName: "Health Capsule", icon: "activity", subcategories: ["general health"] },
    { name: "science_knowledge", displayName: "Science & Knowledge", icon: "book", subcategories: ["general science"] },
    { name: "article", displayName: "Article", icon: "file-text", subcategories: ["art", "causes", "comedy", "crafts", "dance", "drinks", "film", "fitness", "food", "games", "gardening", "health", "home", "literature", "music", "networking", "others", "party", "religion", "shopping", "sports", "theatre", "wellness"] },
    { name: "jobs", displayName: "Jobs", icon: "briefcase", subcategories: ["job offer", "job wanted"] },
    { name: "help", displayName: "Help", icon: "help-circle", subcategories: ["general help"] },
    { name: "sale", displayName: "Sale", icon: "tag", subcategories: ["four-wheelers", "two-wheelers", "furniture", "mobile phone", "electronics", "pets", "books", "others"] },
    { name: "property", displayName: "Property", icon: "home", subcategories: ["for-sale residential", "for-sale commercial", "for-sale industrial", "to-buy residential", "to-buy commercial", "to-buy industrial"] },
    { name: "rental_required", displayName: "Rental Required", icon: "key", subcategories: ["residential", "paying guests", "commercial", "industrial"] },
    { name: "promotion", displayName: "Promotion", icon: "trending-up", subcategories: ["general promotion"] },
    { name: "page_3", displayName: "Page 3", icon: "coffee", subcategories: ["general entertainment"] }
  ];
  
  for (const cat of categoryData) {
    // Check if category already exists
    const existingCategory = await db.select().from(schema.categories).where(schema.categories.name === cat.name).limit(1);
    
    let categoryId;
    if (existingCategory.length === 0) {
      const [newCategory] = await db.insert(schema.categories).values({
        name: cat.name,
        displayName: cat.displayName,
        icon: cat.icon
      }).returning();
      categoryId = newCategory.id;
      console.log(`Created category: ${cat.displayName}`);
    } else {
      categoryId = existingCategory[0].id;
      console.log(`Category ${cat.displayName} already exists, using existing`);
    }
    
    // Add subcategories
    for (const subName of cat.subcategories) {
      const displayName = subName.charAt(0).toUpperCase() + subName.slice(1);
      
      // Check if subcategory already exists
      const existingSubcategory = await db.select().from(schema.subcategories)
        .where(schema.subcategories.categoryId === categoryId && schema.subcategories.name === subName)
        .limit(1);
        
      if (existingSubcategory.length === 0) {
        await db.insert(schema.subcategories).values({
          categoryId,
          name: subName,
          displayName
        });
        console.log(`  - Created subcategory: ${displayName}`);
      } else {
        console.log(`  - Subcategory ${displayName} already exists, skipping`);
      }
    }
  }
  
  // Create some sample posts
  console.log("Creating sample posts...");
  
  // Get all categories
  const categories = await db.select().from(schema.categories);
  
  // Create a post for each main category
  for (const category of categories) {
    // Get subcategories for this category
    const subcategories = await db.select().from(schema.subcategories).where(schema.subcategories.categoryId === category.id);
    
    if (subcategories.length > 0) {
      const subcategory = subcategories[0]; // Use first subcategory
      
      // Check if post already exists for this category
      const existingPost = await db.select().from(schema.posts)
        .where(schema.posts.categoryId === category.id)
        .limit(1);
        
      if (existingPost.length === 0) {
        await db.insert(schema.posts).values({
          userId: testUser.id,
          title: `Sample ${category.displayName} Post`,
          description: `This is a sample post in the ${category.displayName} category with ${subcategory.displayName} subcategory. Check out this feature of the Notice Board application!`,
          categoryId: category.id,
          subcategoryId: subcategory.id,
          location: testUser.location,
          locationDetails: "Near city center",
          visibility: "public",
          metadata: { price: "Free", condition: "New" }
        });
        console.log(`Created sample post for ${category.displayName}`);
      } else {
        console.log(`Sample post for ${category.displayName} already exists, skipping`);
      }
    }
  }
  
  // Create user preferences
  console.log("Creating user preferences...");
  
  // Check if preferences already exist
  const existingPreferences = await db.select().from(schema.userPreferences).where(schema.userPreferences.userId === testUser.id).limit(1);
  
  if (existingPreferences.length === 0) {
    // Get first 5 categories for test user
    const selectedCategories = categories.slice(0, 5).map(cat => cat.name);
    
    // Create notification preferences - enabled for all
    const notificationPreferences: Record<string, boolean> = {};
    categories.forEach(cat => {
      notificationPreferences[cat.name] = true;
    });
    
    await db.insert(schema.userPreferences).values({
      userId: testUser.id,
      selectedCategories,
      notificationPreferences
    });
    console.log("Created user preferences");
  } else {
    console.log("User preferences already exist, skipping");
  }
  
  console.log("Database seeding completed!");
}

// Run the seed function
seed()
  .catch(e => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });