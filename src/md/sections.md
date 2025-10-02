# Sections API

Section management endpoints for organizing course content.

## Overview

Sections are used to organize course content into logical chapters or modules. Each section belongs to a specific course.

---

## 📖 Get All Sections

**`GET /sections`**

Retrieves all available sections.

---

## 📚 Get Course Sections

**`GET /courses/:courseId/sections`**

Retrieves all sections for a specific course.

### Request

**Parameters:**
- `courseId` (number) - Course ID

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
	}
]
```

### Example

```javascript
const response = await axios.get("/courses/1/sections")
console.log(response.data)
```

---

## ➕ Create Section

**`POST /courses/:courseId/sections`**  
🔒 **Requires Admin Authentication**

Creates a new section for a specific course.

### Request

**Parameters:**
- `courseId` (number) - Course ID

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

## ✏️ Update Section

**`PUT /sections/:id`**  
🔒 **Requires Admin Authentication**

Updates an existing section.

### Request

**Parameters:**
- `id` (number) - Section ID

**Body:**
```json
{
	"title": "Advanced State Management with Hooks"
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
	"id": 1,
	"courseId": 1,
	"title": "Advanced State Management with Hooks",
	"createdAt": "2024-01-15T10:30:00.000Z",
	"updatedAt": "2024-01-15T12:45:00.000Z"
}
```

### Example

```javascript
const response = await axios.put("/sections/1", {
	title: "Advanced State Management with Hooks"
})

console.log(response.data)
```

---

## 📝 Notes

-   **Authentication**: Creating and updating sections requires admin role
-   **Title**: Maximum 32 characters
-   **Course ID**: Provided in the URL path parameter for creation
-   **Cascade Delete**: Deleting a course will also delete all associated sections
-   **Content Organization**: Sections are typically used to organize course content into chapters or modules
