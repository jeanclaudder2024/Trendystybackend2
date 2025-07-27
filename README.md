# Trendysty Backend API

A Node.js/Express backend API for the Trendysty e-commerce platform with MongoDB database and Cloudinary image storage.

## 🚀 Features

- **User Authentication** - JWT-based auth with bcrypt password hashing
- **Product Management** - CRUD operations for products with image upload
- **Content Management** - Dynamic page content management
- **Image Upload** - Cloudinary integration for image storage
- **CORS Support** - Cross-origin resource sharing for frontend integration
- **MongoDB Integration** - Mongoose ODM for database operations

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account (for image uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeanclaudder2024/Trendystybackend2.git
   cd Trendystybackend2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

## 🏃‍♂️ Running the Application

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on `http://localhost:5000`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/items` - Get all products
- `GET /api/items/:id` - Get product by ID
- `POST /api/items` - Create new product
- `PUT /api/items/:id` - Update product
- `DELETE /api/items/:id` - Delete product

### Content Management
- `GET /api/pages` - Get all pages
- `GET /api/pages/:key` - Get page by key
- `PUT /api/pages/:key/section/:sectionId` - Update page section

### Shipping Images
- `GET /api/shipping-images` - Get shipping company images
- `POST /api/shipping-images` - Upload shipping image

## 🚀 Deployment

### Netlify Deployment

This backend is configured for serverless deployment on Netlify.

1. **Push to GitHub** (already done)
   ```bash
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Set build settings:
     - Build command: `npm install`
     - Publish directory: `.`
   - Add environment variables in Netlify dashboard

3. **Environment Variables on Netlify**
   Add these in your Netlify site settings:
   - `MONGO_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JWT_SECRET`

### Other Deployment Options

- **Heroku**: Add `Procfile` with `web: node index.js`
- **Railway**: Connect GitHub repo and deploy
- **Render**: Connect GitHub repo with Node.js environment

## 📁 Project Structure

```
Backend/
├── Config/
│   └── Cloudinary.js          # Cloudinary configuration
├── Middleware/
│   ├── Upload.js              # File upload middleware
│   └── uploadShippingImages.js # Shipping image upload
├── Models/
│   ├── Counter.js             # Auto-increment counter
│   ├── Item.js                # Product model
│   ├── PageContent.js         # Page content model
│   ├── ShippingCompanyImage.js # Shipping image model
│   └── User.js                # User model
├── Routes/
│   ├── ItemRoutes.js          # Product routes
│   ├── authRoutes.js          # Authentication routes
│   ├── pageContentRoutes.js   # Content management routes
│   └── shippingImagesRoutes.js # Shipping image routes
├── netlify/
│   └── functions/
│       └── server.js          # Serverless function wrapper
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── index.js                   # Main application file
├── netlify.toml               # Netlify configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔧 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.