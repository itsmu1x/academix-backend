# Authentication API

Authentication endpoints for user registration, login, and session management.

## Overview

The authentication system uses session-based authentication with HTTP cookies. Users can register, login, and manage their sessions through these endpoints.

---

## 🔐 Register User

**`POST /auth/register`**

Creates a new user account with the provided information.

### Request

**Body:**

```json
{
	"name": "Majd Muhtaseb",
	"email": "majdmuhtaseb21@gmail.com",
	"password": "mySecurePassword123"
}
```

**Schema:**

```typescript
{
	name: string // 3-48 characters
	email: string // Valid email address (lowercase)
	password: string // 6-64 characters
}
```

### Response

```json
{
	"message": "User registered successfully"
}
```

### Example

```javascript
const response = await axios.post("/auth/register", {
	name: "Majd Muhtaseb",
	email: "majdmuhtaseb21@gmail.com",
	password: "mySecurePassword123",
})

console.log(response.data)
```

---

## 🔑 Login User

**`POST /auth/login`**

Authenticates a user and creates a session.

### Request

**Body:**

```json
{
	"email": "majdmuhtaseb21@gmail.com",
	"password": "startupPassword456"
}
```

**Schema:**

```typescript
{
	email: string // Valid email address (lowercase)
	password: string // 6-64 characters
}
```

### Response

```json
{
	"message": "User logged in successfully"
}
```

### Example

```javascript
const response = await axios.post("/auth/login", {
	email: "majdmuhtaseb21@gmail.com",
	password: "startupPassword456",
})

console.log(response.data)
```

---

## 👤 Get Current User

**`GET /auth/me`**  
🔒 **Requires Authentication**

Retrieves the current authenticated user's information.

### Response

```json
{
	"id": 42,
	"createdAt": "2024-01-15T10:30:00.000Z",
	"updatedAt": "2024-01-15T10:30:00.000Z",
	"name": "Majd Muhtaseb",
	"email": "majdmuhtaseb21@gmail.com",
	"githubId": null,
	"googleId": null,
	"linkedinId": null,
	"role": {
		"id": 1,
		"name": "user",
		"isDefault": true
	}
}
```

**Schema:**

```typescript
{
	id: number
	createdAt: Date
	updatedAt: Date
	name: string
	email: string
	githubId: string | null
	googleId: string | null
	linkedinId: string | null
	role: {
		id: number
		name: string
		isDefault: boolean
	}
}
```

### Example

```javascript
const response = await axios.get("/auth/me", {
	withCredentials: true, // Important for session cookies
})

console.log(response.data)
```

---

## 🚪 Logout User

**`POST /auth/logout`**  
🔒 **Requires Authentication**

Logs out the current user and destroys their session.

### Response

```json
{
	"message": "User logged out successfully"
}
```

### Example

```javascript
const response = await axios.post("/auth/logout", {
	withCredentials: true, // Important for session cookies
})

console.log(response.data)
```

---

## 📝 Authentication Notes

-   **Session-based**: Uses HTTP cookies for authentication
-   **Cookie handling**: Include `withCredentials: true` in axios requests
-   **Session duration**: 30 days
-   **Email normalization**: Automatically converted to lowercase
-   **Password requirements**: 6-64 characters
-   **Name requirements**: 3-48 characters

## 🔄 Complete Flow Example

```javascript
// 1. Register
await axios.post("/auth/register", {
	name: "Majd Muhtaseb",
	email: "majdmuhtaseb21@gmail.com",
	password: "mySecurePassword123",
})

// 2. Login
await axios.post("/auth/login", {
	email: "majdmuhtaseb21@gmail.com",
	password: "mySecurePassword123",
})

// 3. Get user info (now authenticated)
const user = await axios.get("/auth/me", { withCredentials: true })

// 4. Logout when done
await axios.post("/auth/logout", { withCredentials: true })
```
