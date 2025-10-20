## API Documentation

### Introduction

This document describes the RESTful API for the authentication service. It allows users to register, log in, and retrieve user information.

### Base URL

`http://localhost:3000`

### Authentication

Currently, there is no token-based authentication. Users are 'logged in' based on matching credentials, and subsequent calls would require re-authentication or session management not implemented here.

### Endpoints

--- 

#### 1. Register User

Registers a new user in the system.

- **URL:** `/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response (Success - 201 Created):**
  ```json
  {
    "message": "User registered successfully."
  }
  ```
- **Response (Error - e.g., if user already exists, though not implemented here):**
  (Describe potential error responses if applicable, e.g., 409 Conflict)

--- 

#### 2. Login User

Authenticates an existing user.

- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response (Success - 200 OK):**
  ```json
  {
    "message": "Login successful."
  }
  ```
- **Response (Error - 401 Unauthorized):**
  ```json
  {
    "message": "Invalid credentials."
  }
  ```

--- 

#### 3. Get All Users

Retrieves a list of all registered users.

- **URL:** `/users`
- **Method:** `GET`
- **Request Body:** None
- **Response (Success - 200 OK):**
  ```json
  {
    "users": [
      {
        "username": "string",
        "password": "string"
      }
    ]
  }
  ```
- **Response (Error):**
  (Describe potential error responses if applicable, e.g., 403 Forbidden if this endpoint required admin access)

### Error Handling

General error responses will include a `message` field describing the issue and an appropriate HTTP status code.