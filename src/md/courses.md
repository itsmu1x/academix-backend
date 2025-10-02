# Courses API

Course management endpoints for creating and retrieving educational content.

## Overview

Courses are the main educational content units that belong to categories and contain sections with learning materials.

---

## 📚 Get All Courses

**`GET /courses`**

Retrieves all available courses.

### Response

```json
[
	{
		"id": 1,
		"title": "Complete React Course",
		"description": "Learn React from basics to advanced concepts",
		"slug": "complete-react-course",
		"categoryId": 1,
		"createdAt": "2024-01-15T10:30:00.000Z",
		"updatedAt": "2024-01-15T10:30:00.000Z"
	},
	{
		"id": 2,
		"title": "Node.js Backend Development",
		"description": "Build robust backend applications with Node.js",
		"slug": "nodejs-backend-development",
		"categoryId": 1,
		"createdAt": "2024-01-15T11:00:00.000Z",
		"updatedAt": "2024-01-15T11:00:00.000Z"
	}
]
```

**Schema:**

```typescript
{
	id: number
	title: string
	description: string
	slug: string
	categoryId: number
	createdAt: Date
	updatedAt: Date
}[]
```

### Example

```javascript
const response = await axios.get("/courses")
console.log(response.data)
```

---

## ➕ Create Course

**`POST /courses`**  
🔒 **Requires Admin Authentication**

Creates a new course.

### Request

**Body:**

```json
{
	"title": "Advanced JavaScript Patterns",
	"description": "Master advanced JavaScript patterns and best practices",
	"slug": "advanced-javascript-patterns",
	"categoryId": 1
}
```

**Schema:**

```typescript
{
	title: string
	description: string
	slug: string
	categoryId: number
}
```

### Response

```json
{
	"id": 3,
	"title": "Advanced JavaScript Patterns",
	"description": "Master advanced JavaScript patterns and best practices",
	"slug": "advanced-javascript-patterns",
	"categoryId": 1,
	"createdAt": "2024-01-15T12:00:00.000Z",
	"updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### Example

```javascript
const response = await axios.post("/courses", {
	title: "Advanced JavaScript Patterns",
	description: "Master advanced JavaScript patterns and best practices",
	slug: "advanced-javascript-patterns",
	categoryId: 1,
})

console.log(response.data)
```

---

## 📝 Notes

-   **Authentication**: Creating courses requires admin role
-   **Title**: Maximum 32 characters
-   **Slug**: Must be unique across all courses, automatically trimmed
-   **Category ID**: Must reference an existing category
-   **Description**: Can be longer text content
-   **Cascade Delete**: Deleting a category will also delete all associated courses
