# User Authentication API

This document describes the API endpoints for user management and authentication.

---

### Register New User

Registers a new user account. A verification code is sent to the provided email address.

* **URL:** `/api/auth/register`
* **Method:** `POST`

**Request Body:**
| Parameter  | Type   | Description |
|------------|--------|-------------|
| `username` | String | The user's desired username. |
| `email`    | String | The user's email address. |
| `password` | String | The user's chosen password. |

**Success Response:**
* **Code:** `201 Created`
* **Content:**
```json
{
  "message": "User Registered. Verification Code sent to mail!",
  "email": "user@example.com",
  "username": "exampleuser"
}
```

**Error Responses:**
* **Code:** `400 Bad Request` - Missing one or more required fields.
```json
{ "message": "Missing Credentials!" }
```
* **Code:** `409 Conflict` - A user with the given email already exists.
```json
{ "message": "User Already Exists" }
```

---

### Verify Email

Verifies a user's account using the code sent to their email.

* **URL:** `/api/auth/verify`
* **Method:** `POST`

**Request Body:**
| Parameter | Type   | Description |
|-----------|--------|-------------|
| `email`   | String | The user's email address. |
| `code`    | String | The 6-digit verification code sent to the user. |

**Success Response:**
* **Code:** `201 Created`
* **Content:**
```json
{ "message": "User Created Successfully! Logged in successfully!" }
```

**Error Responses:**
* **Code:** `400 Bad Request`
  * User not found: `{ "message": "User not found" }`
  * Already verified: `{ "message": "Already verified" }`
  * Invalid code: `{ "message": "Invalid or expired code" }`

---

### Login

Authenticates a user and returns a session cookie.

* **URL:** `/api/auth/login`
* **Method:** `POST`

**Request Body:**
| Parameter  | Type   | Description |
|------------|--------|-------------|
| `email`    | String | The user's email address. |
| `password` | String | The user's password. |

**Success Response:**
* **Code:** `200 OK`
* **Content:**
```json
{
  "message": "Login success",
  "returningObj": {
    "email": "user@example.com",
    "username": "exampleuser",
    "id": "60d..."
  }
}
```

**Error Responses:**
* **Code:** `401 Unauthorized` - Invalid credentials.
* **Code:** `404 Not Found` - User does not exist.

---

### Get Current User

Retrieves the details of the currently authenticated user based on their session cookie.

* **URL:** `/api/auth/me`
* **Method:** `GET`

**Success Response:**
* **Code:** `200 OK`
* **Content:**
```json
{
  "message": "User retrieved",
  "user": {
    "_id": "60d...",
    "username": "exampleuser",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Error Responses:**
* **Code:** `401 Unauthorized` - No valid session token provided.

---

### Logout

Logs out the user by clearing their session cookie.

* **URL:** `/api/auth/logout`
* **Method:** `POST`

**Success Response:**
* **Code:** `200 OK`
* **Content:**
```json
{ "message": "Logout successful!" }