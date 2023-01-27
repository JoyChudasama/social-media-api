
# Social Media API

- An API that can be implemented for a Social Media Website/App
  
- API is created on top of Node.js and MongoDB.


# Setup

### 1. Install Dependencies

- Run following command for installing the necessary dependencies.

        npm i

### 2. MongoDB Setup

- Create .env file into your project directory and assign your MongoDB Project URL to `MONGO_URL` variable.


# Models & Routes

### Models

1. USER
2. POST
3. COMMENT

### Routes

1. AUTH

   - Register a user -  `auth/register`
   - Login -  `auth/login`

2. USER

   - Update a user - `users/update/:id`
   - Delete a user - `users/delete/:id`
   - Get a user - `users/get/:id`
   - Follow a user - `users/follow/:id`
   - Unfollow a user - `users/unfollow/:id`

3. POST
 
   - Create a post - `posts/create`
   - Update a post - `posts/update/:id`
   - Delete a post - `posts/delete/:id`
   - Get a post - `posts/get/:id`
   - Get user's all posts - `posts/getAllForUser/:id`
   - Get User's timeline posts - `posts/getTimelinePostsForUser/:id`
   - Like a post - `posts/like/:id`

4. COMMENT
 
   - Create a comment - `posts/create`
   - Update a comment - `posts/update/:id`
   - Delete a comment - `posts/delete/:id`
   - Get a comment - `posts/get/:id`
