# Sections API

Section management endpoints for organizing course content.

## Overview

Sections are used to organize course content into logical chapters or modules. Each section belongs to a specific course.

---

## 📖 Get All Sections

**`GET /sections`**

Retrieves all available sections.

### Response

```json
[
	{
		"id": 1,
		"courseId": 1,
		"title": "Introduction to React",
		"createdAt": "2024-01-15T10:30:00.000Z",
		"updatedAt": "2024-01-15T10:30:00.000Z"
	},
	{
		"id": 2,
		"courseId": 1,
		"title": "Components and Props",
		"createdAt": "2024-01-15T10:45:00.000Z",
		"updatedAt": "2024-01-15T10:45:00.000Z"
	},
	{
		"id": 3,
		"courseId": 2,
		"title": "Setting up Node.js Environment",
		"createdAt": "2024-01-15T11:00:00.000Z",
		"updatedAt": "2024-01-15T11:00:00.000Z"
	}
]
```

**Schema:**

```typescript
{
	id: number
	courseId: number
	title: string
	createdAt: Date
	updatedAt: Date
}[]
```

### Example

```javascript
const response = await axios.get("/sections")
console.log(response.data)
```

---

## ➕ Create Section

**`POST /courses/:id/sections`**  
🔒 **Requires Admin Authentication**

Creates a new section for a specific course.

### Request

**Parameters:**
- `id` (number) - Course ID

**Body:**

```json
{
	"title": "State Management with Hooks"
}
```

**Schema:**

```typescript
{
	title: string
}
```

### Response

```json
{
	"id": 4,
	"courseId": 1,
	"title": "State Management with Hooks",
	"createdAt": "2024-01-15T12:30:00.000Z",
	"updatedAt": "2024-01-15T12:30:00.000Z"
}
```

### Example

```javascript
const response = await axios.post("/courses/1/sections", {
	title: "State Management with Hooks",
})

console.log(response.data)
```

---

## 📝 Notes

-   **Authentication**: Creating sections requires admin role
-   **Title**: Maximum 32 characters
-   **Course ID**: Provided in the URL path parameter
-   **Cascade Delete**: Deleting a course will also delete all associated sections
-   **Content Organization**: Sections are typically used to organize course content into chapters or modules
