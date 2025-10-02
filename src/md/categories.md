# Categories API

Category management endpoints for organizing courses.

## Overview

Categories help organize courses into different topics or subjects. Each category can have multiple translations for different languages.

---

## 📋 Get All Categories

**`GET /categories`**

Retrieves all categories with their translations.

### Response

```json
[
	{
		"id": 1,
		"slug": "web-development",
		"createdAt": "2024-01-15T10:30:00.000Z",
		"updatedAt": "2024-01-15T10:30:00.000Z",
		"translations": {
			"en": {
				"id": 1,
				"categoryId": 1,
				"locale": "en",
				"name": "Web Development",
				"createdAt": "2024-01-15T10:30:00.000Z",
				"updatedAt": "2024-01-15T10:30:00.000Z"
			},
			"ar": {
				"id": 2,
				"categoryId": 1,
				"locale": "ar",
				"name": "تطوير الويب",
				"createdAt": "2024-01-15T10:30:00.000Z",
				"updatedAt": "2024-01-15T10:30:00.000Z"
			}
		}
	}
]
```

**Schema:**

```typescript
{
	id: number
	slug: string
	createdAt: Date
	updatedAt: Date
	translations: Record<
		string,
		{
			id: number
			categoryId: number
			locale: string
			name: string
			createdAt: Date
			updatedAt: Date
		}
	>
}[]
```

### Example

```javascript
const response = await axios.get("/categories")
console.log(response.data)
```

---

## ➕ Create Category

**`POST /categories`**  
🔒 **Requires Admin Authentication**

Creates a new category with translations.

### Request

**Body:**

```json
{
	"slug": "mobile-development",
	"translations": {
		"en": {
			"name": "Mobile Development"
		},
		"ar": {
			"name": "تطوير التطبيقات"
		}
	}
}
```

**Schema:**

```typescript
{
	slug: string
	translations: Record<
		string,
		{
			name: string
		}
	>
}
```

### Response

```json
{
	"id": 2,
	"slug": "mobile-development",
	"createdAt": "2024-01-15T10:30:00.000Z",
	"updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Example

```javascript
const response = await axios.post("/categories", {
	slug: "mobile-development",
	translations: {
		en: {
			name: "Mobile Development",
		},
		ar: {
			name: "تطوير التطبيقات",
		},
	},
})

console.log(response.data)
```

---

## 🗑️ Delete Category

**`DELETE /categories/:id`**  
🔒 **Requires Admin Authentication**

Deletes a category by its ID.

### Request

**Parameters:**

-   `id` (number) - Category ID

### Response

```json
{
	"message": "Category deleted successfully"
}
```

### Example

```javascript
const response = await axios.delete("/categories/1")
console.log(response.data)
```

---

## 📝 Notes

-   **Authentication**: Creating and deleting categories requires admin role
-   **Slug**: Must be unique across all categories
-   **Translations**: Each category can have multiple language translations
-   **Cascade Delete**: Deleting a category will also delete all associated courses
-   **Locale Format**: Use 3-character locale codes (e.g., "en", "ar")
