# Wanderlust

Wanderlust is a full-stack web application inspired by Airbnb, allowing users to list, browse, and explore unique places to stay. It provides a seamless and interactive user experience with dynamic listing pages, secure authentication, and an intuitive dashboard for users to manage their listings and properties. Users can upload images, leave reviews, and manage their listings.

## Features
- User authentication with **Passport.js**
- Listings with images uploaded via **Multer** and stored on **Cloudinary**
- Flash messages using **connect-flash**
- Responsive UI using **EJS** templates
- CRUD operations for listings
- Secure sessions using **express-session**

## Tech Stack

### Backend
- **Node.js & Express.js** – Server and routing
- **MongoDB & Mongoose** – Database and ORM
- **Express Router** – Organized route handling
- **express-session & connect-flash** – Authentication and notifications
- **Passport.js** – User authentication
- **Multer & Cloudinary** – Image uploads

### Frontend
- **HTML & CSS** - Structure and styling of the web pages
- **Bootstrap** – For styling and responsiveness
- **EJS (Embedded JavaScript Templates)** – Dynamic HTML rendering

### Architecture
Wanderlust follows the **Model-View-Controller (MVC) architecture**, ensuring better organization and maintainability:
- **Model**: Defines data structure using Mongoose schemas
- **View**: Uses EJS templates for dynamic rendering
- **Controller**: Handles application logic and user requests

### Live Demo
Check out the live demo of Wanderlust here: [Wanderlust Live](https://wanderlust-vv83.onrender.com/listings)

## Deployment & Hosting
- **Cloudinary** – Image hosting
- **Render** – App deployment

### Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

### License

This project is open-source. Feel free to use and modify it as needed.

### Author

Developed by Madhav Bhudhiraja. Connect with me on [LinkedIn](www.linkedin.com/in/madhav-bhudhiraja-40a6b0291)!
