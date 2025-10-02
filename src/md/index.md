# Academix API Documentation

**Welcome to the Academix API documentation.**

## Available Routes

| Method             | Endpoint          | Description           | Authentication | Documentation                 |
| ------------------ | ----------------- | --------------------- | -------------- | ----------------------------- |
| **Authentication** |
| `POST`             | `/auth/register`  | Register a new user   | no             | [View Docs](/docs/auth)       |
| `POST`             | `/auth/login`     | Login user            | no             | [View Docs](/docs/auth)       |
| `GET`              | `/auth/me`        | Get current user info | needed         | [View Docs](/docs/auth)       |
| `POST`             | `/auth/logout`    | Logout user           | needed         | [View Docs](/docs/auth)       |
| **Categories**     |
| `GET`              | `/categories`     | Get all categories    | no             | [View Docs](/docs/categories) |
| `POST`             | `/categories`     | Create new category   | admin     | [View Docs](/docs/categories) |
| `DELETE`           | `/categories/:id` | Delete category by ID | admin     | [View Docs](/docs/categories) |
| **Courses**        |
| `GET`              | `/courses`        | Get all courses       | no             | [View Docs](/docs/courses)    |
| `POST`             | `/courses`        | Create new course     | admin     | [View Docs](/docs/courses)    |
| **Sections**       |
| `GET`              | `/sections`       | Get all sections      | no             | [View Docs](/docs/sections)   |
| `GET`              | `/courses/:courseId/sections` | Get course sections | no             | [View Docs](/docs/sections)   |
| `POST`             | `/courses/:courseId/sections` | Create new section    | admin     | [View Docs](/docs/sections)   |
| `PUT`              | `/sections/:id`   | Update section        | admin     | [View Docs](/docs/sections)   |
| `DELETE`           | `/sections/:id`   | Delete section        | admin     | [View Docs](/docs/sections)   |

## Authentication

-   **no**: Public endpoints that don't require authentication
-   **needed**: Endpoints that require user authentication (session-based via HTTP cookies)
-   **admin**: Endpoints that require admin role authentication
-   Session cookies are automatically included in requests when using `withCredentials: true` (axios)
-   Sessions expire after 30 days

## Error Handling

The API returns appropriate HTTP status codes and error messages:

-   `200` - Success
-   `400` - Bad Request (validation errors)
-   `401` - Unauthorized (authentication required)
-   `404` - Not Found
-   `500` - Internal Server Error
