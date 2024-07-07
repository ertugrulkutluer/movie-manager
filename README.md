# Movie Management System

## Overview

The Movie Management System is a RESTful API built using Node.js and the NestJS framework. This application allows users to manage movies, users, and tickets. The API provides endpoints for user registration, login, managing movies, purchasing tickets, and viewing watch history.

## Features

- **User Registration and Login:** Users can register and log in with a username, password, and age. There are two types of users: managers and customers.
- **Manage Movies:** Managers can add, modify, and delete movies. Each movie has a name, age restriction, and multiple sessions. Sessions include a date, time slot, and room number.
- **List Movies:** All users can view a list of available movies.
- **Buy Tickets:** Customers can buy tickets for specific movie sessions.
- **Watch Movies:** Customers can watch movies for which they have valid tickets.
- **View Watch History:** Customers can view a list of movies they've watched.
- **Bulk Addition and Deletion:** Bulk addition and deletion feature for movies.
- **Conflict Check:** Logic checks when adding movies to prevent double-booking of rooms.
- **Sorting and Filtering:** Movie listings can be sorted and filtered by different fields.

## Technical Requirements

- **Node.js:** 14.x.x or later
- **NestJS:** Latest version
- **Database:** MongoDB (MongoCloud)
- **Authentication:** JWT
- **Validation:** DTOs
- **Swagger:** API documentation
- **Testing:** Unit and end-to-end tests

## Setup and Installation

### Prerequisites

- Node.js (v14.x.x or later)
- npm or yarn
- MongoDB (MongoCloud)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-management-system.git
   cd movie-management-system

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
3. Create a .env file in the root directory and add your environment variables:
   ```env
   PORT=3002
   MONGODB_URI={MONGO_CONN_STRING}
   JWT_SECRET={JWT_SECRET}
4. Run the application:
    ```bash
    npm run start
    # or
    yarn start
5. Access the API documentation:
    ```
    http://localhost:3002/docs

## Usage
### Endpoints

#### User Registration and Login

-   **Register:** `POST /auth/register`
-   **Login:** `POST /auth/login`

#### Manage Movies

-   **Create Movie:** `POST /movies`
-   **Create Movies in Bulk:** `POST /movies/bulk`
-   **Get All Movies:** `GET /movies`
-   **Get Movie by ID:** `GET /movies/:id`
-   **Update Movie:** `PUT /movies/:id`
-   **Delete Movie:** `DELETE /movies/:id`
-   **Delete Movies in Bulk:** `DELETE /movies/bulk`

#### Buy Tickets

-   **Buy Ticket:** `POST /tickets`
-   **Get All Tickets:** `GET /tickets`
-   **Get Tickets by User ID:** `GET /tickets/user/:userId`
-   **Get Ticket by ID:** `GET /tickets/:id`
-   **Delete Ticket by ID:** `DELETE /tickets/:id`

### Swagger Documentation

The API documentation is available at `/docs`.

## Project Structure
```bash
.

 src

├── app

│   ├── auth

│   │   ├── controllers

│   │   │   └── auth.controller.ts

│   │   ├── dtos

│   │   │   ├── login.dto.ts

│   │   │   └── register.dto.ts

│   │   ├── services

│   │   │   └── auth.service.ts

│   │   ├── strategies

│   │   │   └── jwt.strategy.ts

│   │   ├── guards

│   │   │   ├── roles.guard.ts

│   │   │   └── jwt-auth.guard.ts

│   │   ├── decorators

│   │   │   └── roles.decorator.ts

│   │   ├── auth.module.ts

│   ├── movie

│   │   ├── controllers

│   │   │   └── movie.controller.ts

│   │   ├── dtos

│   │   │   ├── create-movie.dto.ts

│   │   │   ├── filter-movie.dto.ts

│   │   │   └── update-movie.dto.ts

│   │   ├── services

│   │   │   └── movie.service.ts

│   │   ├── movie.module.ts

│   ├── ticket

│   │   ├── controllers

│   │   │   └── ticket.controller.ts

│   │   ├── dtos

│   │   │   └── create-ticket.dto.ts

│   │   ├── services

│   │   │   └── ticket.service.ts

│   │   ├── ticket.module.ts

│   ├── decorators

│   │   └── common-decorator.ts  # Genel amaçlı dekoratörler burada

│   └── app.module.ts

├── infrastructure

│   └── database

│       └── database.module.ts

├── domain

│   ├── repositories

│   │   ├── ticket.repository.ts

│   │   ├── user.repository.ts

│   │   └── movie.repository.ts

│   └── entities

│       ├── movie.entity.ts

│       ├── user.entity.ts

│       └── ticket.entity.ts

├── main.ts

└── app.controller.ts


