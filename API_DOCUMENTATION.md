# Notice Board Frontend API Documentation

This document outlines all the API endpoints that the frontend expects from the Spring backend.

## Base URL

All API endpoints are expected to be available at: `http://localhost:8080/api`

## Authentication

The frontend uses JWT authentication with Bearer tokens. All authenticated requests include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "user": {
      "id": 1,
      "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "username": "username",
      "email": "user@example.com",
      "name": "User Name",
      "profileImage": "url/to/image.jpg",
      "role": "user",
      "location": "chandigarh"
    },
    "token": "jwt_token_here"
  }
  ```

#### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "username": "username",
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name",
    "phone": "1234567890",
    "location": "chandigarh",
    "visibility": "public"
  }
  ```
- **Success Response**:
  ```json
  {
    "user": {
      "id": 1,
      "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "username": "username",
      "email": "user@example.com",
      "name": "User Name",
      "profileImage": null,
      "role": "user",
      "location": "chandigarh"
    },
    "token": "jwt_token_here"
  }
  ```

#### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "user": {
      "id": 1,
      "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "username": "username",
      "email": "user@example.com",
      "name": "User Name",
      "profileImage": "url/to/image.jpg",
      "role": "user",
      "location": "chandigarh",
      "visibility": "public",
      "phone": "1234567890"
    }
  }
  ```

#### Change Password
- **URL**: `/auth/change-password`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "currentPassword": "current_password",
    "newPassword": "new_password"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

### User Profile

#### Update Profile
- **URL**: `/users/profile`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "phone": "9876543210",
    "visibility": "private",
    "profileImage": "url/to/new/image.jpg"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 1,
    "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "username": "username",
    "email": "user@example.com",
    "name": "Updated Name",
    "profileImage": "url/to/new/image.jpg",
    "role": "user",
    "location": "chandigarh",
    "visibility": "private",
    "phone": "9876543210"
  }
  ```

### User Preferences

#### Get User Preferences
- **URL**: `/users/preferences`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "id": 1,
    "userId": 1,
    "selectedCategories": ["announcement", "event", "news"],
    "notificationPreferences": {
      "announcement": true,
      "event": true,
      "news": false,
      "traffic_alert": false
    }
  }
  ```

#### Update User Preferences
- **URL**: `/users/preferences`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "selectedCategories": ["announcement", "event", "news", "sale"],
    "notificationPreferences": {
      "announcement": true,
      "event": false,
      "news": true,
      "sale": true
    }
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 1,
    "userId": 1,
    "selectedCategories": ["announcement", "event", "news", "sale"],
    "notificationPreferences": {
      "announcement": true,
      "event": false,
      "news": true,
      "sale": true
    }
  }
  ```

### Categories

#### Get All Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**:
  ```json
  [
    {
      "id": 1,
      "name": "announcement",
      "displayName": "Announcement",
      "icon": "bell"
    },
    {
      "id": 2,
      "name": "event",
      "displayName": "Event",
      "icon": "calendar"
    }
  ]
  ```

#### Get All Subcategories
- **URL**: `/subcategories`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `categoryId` (optional): Filter subcategories by category ID
- **Success Response**:
  ```json
  [
    {
      "id": 1,
      "categoryId": 1,
      "name": "travel plan",
      "displayName": "Travel Plan"
    },
    {
      "id": 2,
      "categoryId": 1,
      "name": "opening",
      "displayName": "Opening"
    }
  ]
  ```

### Posts

#### Get Posts
- **URL**: `/posts`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of posts per page (default: 10)
  - `category` (optional): Filter by category name
  - `location` (optional): Filter by location
  - `search` (optional): Search in title and description
  - `userId` (optional): Filter by user ID
- **Success Response**:
  ```json
  {
    "data": [
      {
        "id": 1,
        "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        "title": "Sample Post",
        "description": "This is a sample post description",
        "category": {
          "id": 1,
          "name": "announcement",
          "displayName": "Announcement"
        },
        "subcategory": {
          "id": 1,
          "name": "travel plan",
          "displayName": "Travel Plan"
        },
        "location": "chandigarh",
        "locationDetails": "Near city center",
        "imageUrl": "url/to/image.jpg",
        "visibility": "public",
        "metadata": {
          "price": "Free",
          "condition": "New"
        },
        "viewCount": 42,
        "createdAt": "2023-05-01T12:34:56Z",
        "updatedAt": "2023-05-02T12:34:56Z",
        "user": {
          "id": 1,
          "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
          "name": "User Name",
          "username": "username",
          "profileImage": "url/to/image.jpg"
        },
        "likeCount": 15,
        "commentCount": 5,
        "isLiked": false,
        "isSaved": true,
        "isFollowed": false
      }
    ],
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
  ```

#### Get Post by ID
- **URL**: `/posts/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**:
  ```json
  {
    "id": 1,
    "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "title": "Sample Post",
    "description": "This is a sample post description",
    "category": {
      "id": 1,
      "name": "announcement",
      "displayName": "Announcement"
    },
    "subcategory": {
      "id": 1,
      "name": "travel plan",
      "displayName": "Travel Plan"
    },
    "location": "chandigarh",
    "locationDetails": "Near city center",
    "imageUrl": "url/to/image.jpg",
    "visibility": "public",
    "metadata": {
      "price": "Free",
      "condition": "New"
    },
    "viewCount": 42,
    "createdAt": "2023-05-01T12:34:56Z",
    "updatedAt": "2023-05-02T12:34:56Z",
    "user": {
      "id": 1,
      "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "name": "User Name",
      "username": "username",
      "profileImage": "url/to/image.jpg"
    },
    "likeCount": 15,
    "commentCount": 5,
    "isLiked": false,
    "isSaved": true,
    "isFollowed": false
  }
  ```

#### Create Post
- **URL**: `/posts`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "New Post",
    "description": "This is a new post",
    "categoryId": 1,
    "subcategoryId": 1,
    "location": "chandigarh",
    "locationDetails": "Near city center",
    "imageUrl": "url/to/image.jpg",
    "visibility": "public",
    "metadata": {
      "price": "Free",
      "condition": "New"
    }
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 1,
    "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "title": "New Post",
    "description": "This is a new post",
    "categoryId": 1,
    "subcategoryId": 1,
    "location": "chandigarh",
    "locationDetails": "Near city center",
    "imageUrl": "url/to/image.jpg",
    "visibility": "public",
    "metadata": {
      "price": "Free",
      "condition": "New"
    },
    "viewCount": 0,
    "createdAt": "2023-05-01T12:34:56Z",
    "updatedAt": "2023-05-01T12:34:56Z",
    "userId": 1
  }
  ```

#### Update Post
- **URL**: `/posts/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Updated Post",
    "description": "This is an updated post",
    "categoryId": 1,
    "subcategoryId": 1,
    "location": "chandigarh",
    "locationDetails": "Central square",
    "imageUrl": "url/to/image.jpg",
    "visibility": "public",
    "metadata": {
      "price": "Free",
      "condition": "Used"
    }
  }
  ```
- **Success Response**: Same as Get Post by ID

#### Delete Post
- **URL**: `/posts/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

### Post Interactions

#### Like a Post
- **URL**: `/posts/:id/like`
- **Method**: `POST`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "createdAt": "2023-05-01T12:34:56Z"
  }
  ```

#### Unlike a Post
- **URL**: `/posts/:id/like`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "message": "Post unliked successfully"
  }
  ```

#### Save a Post
- **URL**: `/posts/:id/save`
- **Method**: `POST`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "createdAt": "2023-05-01T12:34:56Z"
  }
  ```

#### Unsave a Post
- **URL**: `/posts/:id/save`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "message": "Post unsaved successfully"
  }
  ```

#### Follow a Post
- **URL**: `/posts/:id/follow`
- **Method**: `POST`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "createdAt": "2023-05-01T12:34:56Z"
  }
  ```

#### Unfollow a Post
- **URL**: `/posts/:id/follow`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "message": "Post unfollowed successfully"
  }
  ```

### Comments

#### Get Comments for a Post
- **URL**: `/posts/:id/comments`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**:
  ```json
  [
    {
      "id": 1,
      "postId": 1,
      "content": "This is a comment",
      "createdAt": "2023-05-01T12:34:56Z",
      "updatedAt": "2023-05-01T12:34:56Z",
      "user": {
        "id": 1,
        "uuid": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        "name": "User Name",
        "username": "username",
        "profileImage": "url/to/image.jpg"
      }
    }
  ]
  ```

#### Add Comment to a Post
- **URL**: `/posts/:id/comments`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "content": "This is a new comment"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "content": "This is a new comment",
    "createdAt": "2023-05-01T12:34:56Z",
    "updatedAt": "2023-05-01T12:34:56Z"
  }
  ```

#### Delete Comment
- **URL**: `/posts/:postId/comments/:commentId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "message": "Comment deleted successfully"
  }
  ```

## Response Format

All APIs should return responses in the following format:

### Success Response
```json
{
  "status": "success",
  "data": {
    // response data here
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message here",
  "errors": {
    "field1": ["Error 1", "Error 2"],
    "field2": ["Error 3"]
  }
}
```

## OAuth Authentication

### Google OAuth
- **URL**: `/auth/google`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Redirects to Google for authentication

### Apple OAuth
- **URL**: `/auth/apple`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Redirects to Apple for authentication

### OAuth Callback
- **URL**: `/auth/callback`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `token`: JWT token issued after successful OAuth authentication
- **Description**: The frontend redirects to this URL after successful OAuth authentication