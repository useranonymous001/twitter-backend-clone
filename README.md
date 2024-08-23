# Twitter Backend Clone

This is a sample Twitter backend clone built using Node.js, Express, and MongoDB. The goal of this project is to replicate some of the core functionalities of Twitter's backend, such as creating, deleting, updating, and reading tweets, as well as implementing a liking system, following users, and sorting tweets based on trends or recency.

**Note**: This project is still under development. More features are yet to be added, and the repository will be continuously updated.

## Features Implemented

- User authentication and registration
- Tweet creation, deletion, and updating
- Follow/unfollow users
- Like/unlike tweets
- Sorting tweets by trends and recency
- User dedicated profile view

## API Documentation

For detailed information on the API endpoints and how to use them, please visit the [API Documentation](https://useranonymous001.github.io/twitter-backend-clone/index.html).

## Installation

To run this project on your local machine, follow the steps below:

### Prerequisites

Ensure you have the following installed on your computer:

- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/)
- **MongoDB**: Download and install from [mongodb.com](https://www.mongodb.com/)

### Steps to Install and Run the Project

1.  **Clone the Repository**

    Open your terminal and run the following command to clone the repository:

    ```bash
    git clone https://github.com/useranonymous001/twitter-backend-clone.git
    ```

2.  **Navigate to the Project Diretory**

    cd dir_name

3.  **Install Dependencies**

    '''bash
    npm install express mongoose jsonwebtoken dotenv bcrypt path helmet cookie-parser dbgr multer fs
    '''

4.  **Configure Environment Variables**

    Create a .env file in the root directory and add the following environment variables:

    '''bash
    MONGO_URI=your_mongodb_connection_string
    PORT=your_preferred_port
    '''

    Replace your_mongodb_connection_string with your actual MongoDB connection string and your_preferred_port with the port you want the server to run on (e.g., 3000).

5.  **Start the Server**

    npm start
