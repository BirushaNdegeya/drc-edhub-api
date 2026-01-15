# Swagger API Documentation - Complete Implementation

This document outlines all the Swagger/OpenAPI documentation that has been added to the EdHub API project.

## Overview

All DTOs and controllers have been enhanced with comprehensive Swagger documentation using `@ApiProperty`, `@ApiPropertyOptional`, `@ApiTags`, `@ApiOperation`, and `@ApiResponse` decorators.

---

## DTOs with @ApiProperty Decorators

### Academic Years
- **File**: `src/academic-years/dto/create-academic-year.dto.ts`
- **Properties Documented**:
  - `name` - The name of the academic year (example: "2024-2025")
  - `link` - Optional link associated with the academic year
  - `province` - Optional province where applicable

### Courses
- **File**: `src/courses/dto/create-course.dto.ts`
- **Properties Documented**:
  - `schoolId` - UUID of the school
  - `title` - Course title
  - `slug` - URL-friendly identifier
  - `description` - Detailed course description
  - `durationWeeks` - Duration in weeks
  - `totalLessons` - Total number of lessons
  - `status` - Course status (draft, pending_review, published, archived)
  - `createdById` - UUID of creator
  - `instructorId` - Optional UUID of instructor

### Modules
- **File**: `src/courses/dto/create-module.dto.ts`
- **Properties Documented**:
  - `courseId` - UUID of the course
  - `title` - Module title
  - `orderIndex` - Order within course
  - `isPublished` - Publication status

### Lessons
- **File**: `src/courses/dto/create-lesson.dto.ts`
- **Properties Documented**:
  - `moduleId` - UUID of the module
  - `title` - Lesson title
  - `contentType` - Type (video, text, quiz, assignment)
  - `durationMinutes` - Duration in minutes
  - `contentUrl` - URL to content
  - `isPublished` - Publication status
  - `orderIndex` - Order within module
  - `createdById` - UUID of creator

### Enrollments
- **File**: `src/courses/dto/create-enrollment.dto.ts`
- **Properties Documented**:
  - `userId` - UUID of enrolling user
  - `courseId` - UUID of course
  - `progressPercentage` - Initial progress percentage

### Course Assignments
- **File**: `src/courses/dto/create-course-assignment.dto.ts`
- **Properties Documented**:
  - `courseId` - UUID of course
  - `instructorId` - UUID of instructor
  - `assignedById` - UUID of assigning admin

### Lesson Progress
- **File**: `src/courses/dto/create-lesson-progress.dto.ts`
- **Properties Documented**:
  - `userId` - UUID of user
  - `lessonId` - UUID of lesson
  - `completed` - Completion status
  - `watchedSeconds` - Seconds watched

### Schools
- **File**: `src/schools/dto/create-school.dto.ts`
- **Properties Documented**:
  - `name` - School name
  - `slug` - URL-friendly identifier
  - `description` - School description
  - `logoUrl` - URL to school logo
  - `isActive` - Active status

### Users
- **File**: `src/users/dto/user.dto.ts`
- **Properties Documented**:
  - `id` - User UUID
  - `firstname` - First name
  - `lastname` - Last name
  - `surname` - Middle name
  - `age` - User age
  - `school` - School name
  - `province` - Province
  - `location` - City/Location
  - `role` - User role
  - `sex` - Gender
  - `section` - Class section
  - `class` - Grade level
  - `email` - Email address
  - `avatar` - Avatar URL

- **File**: `src/users/dto/update-user.dto.ts`
  - All properties marked as optional with descriptions

### Auth
- **File**: `src/auth/dto/token.dto.ts`
- **Properties Documented**:
  - `access_token` - JWT access token for authentication

---

## Controllers with @ApiTags, @ApiOperation, @ApiResponse

### Academic Years Controller
- **Endpoint**: `/academic-years`
- **Tag**: `Academic Years`
- **Documented Operations**:
  - `POST` - Create new academic year (Admin only)
  - `GET` - Get all academic years
  - `GET /:id` - Get academic year by ID
  - `PATCH /:id` - Update academic year (Admin only)
  - `DELETE /:id` - Delete academic year (Admin only)

### Courses Controller
- **Endpoint**: `/courses`
- **Tag**: `Courses`
- **Documented Operations**:
  - `POST` - Create new course (Admin only)
  - `GET` - Get all courses with optional filters (schoolId, instructorId)
  - `GET /:id` - Get course by ID
  - `PATCH /:id` - Update course (Admin only)
  - `DELETE /:id` - Delete course (Admin only)

### Modules Controller
- **Endpoint**: `/modules`
- **Tag**: `Modules`
- **Documented Operations**:
  - `POST` - Create new module (Admin only)
  - `GET` - Get all modules with optional course filter
  - `GET /:id` - Get module by ID
  - `PATCH /:id` - Update module (Admin only)
  - `DELETE /:id` - Delete module (Admin only)

### Lessons Controller
- **Endpoint**: `/lessons`
- **Tag**: `Lessons`
- **Documented Operations**:
  - `POST` - Create new lesson (Admin only)
  - `GET` - Get all lessons with optional module filter
  - `GET /:id` - Get lesson by ID
  - `PATCH /:id` - Update lesson (Admin only)
  - `DELETE /:id` - Delete lesson (Admin only)

### Enrollments Controller
- **Endpoint**: `/enrollments`
- **Tag**: `Enrollments`
- **Documented Operations**:
  - `POST` - Create new enrollment
  - `GET` - Get all enrollments with optional filters (userId, courseId)
  - `GET /:id` - Get enrollment by ID
  - `PATCH /:id` - Update enrollment (Admin only)
  - `DELETE /:id` - Delete enrollment (Admin only)

### Course Assignments Controller
- **Endpoint**: `/course-assignments`
- **Tag**: `Course Assignments`
- **Documented Operations**:
  - `POST` - Assign course to instructor (Admin only)
  - `GET` - Get all assignments with optional filters (courseId, instructorId)
  - `GET /:id` - Get assignment by ID
  - `PATCH /:id` - Update assignment (Admin only)
  - `DELETE /:id` - Delete assignment (Admin only)

### Lesson Progress Controller
- **Endpoint**: `/lesson-progress`
- **Tag**: `Lesson Progress`
- **Documented Operations**:
  - `POST` - Create lesson progress record
  - `GET` - Get all records with optional filters (userId, lessonId)
  - `GET /:id` - Get progress record by ID
  - `PATCH /:id` - Update progress record
  - `DELETE /:id` - Delete progress record (Admin only)

### Schools Controller
- **Endpoint**: `/schools`
- **Tag**: `Schools`
- **Documented Operations**:
  - `POST` - Create new school (Admin only)
  - `GET` - Get all schools
  - `GET /:id` - Get school by ID
  - `PATCH /:id` - Update school (Admin only)
  - `DELETE /:id` - Delete school (Admin only)

### Users Controller
- **Endpoint**: `/users`
- **Tag**: `users`
- **Documented Operations**:
  - `GET /me` - Get currently authenticated user (JWT required)
  - `PATCH /` - Update currently authenticated user (JWT required)

### Auth Controller
- **Endpoint**: `/auth`
- **Tag**: `Auth`
- **Documented Operations**:
  - `GET /google` - Start Google OAuth2 flow
  - `GET /google/callback` - Google OAuth2 callback

---

## Standard Response Documentation

All endpoints now include standardized API responses:

### Success Responses
- `200 OK` - Successful GET, PATCH, DELETE operations
- `201 Created` - Successful POST operations

### Error Responses
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions (Admin only endpoints)
- `404 Not Found` - Resource not found

---

## Accessing Swagger Documentation

The Swagger UI is available at:
```
http://localhost:3000/docs
```

All endpoints are properly categorized by tags (Academic Years, Courses, Modules, etc.), and each endpoint shows:
- Expected request body with DTO properties and examples
- Required vs. optional fields
- Response schema with examples
- Authentication requirements (Bearer JWT for protected endpoints)

---

## Implementation Details

### Decorators Used

1. **@ApiProperty** - Documents required properties with examples and descriptions
2. **@ApiPropertyOptional** - Documents optional properties
3. **@ApiTags** - Groups endpoints by feature/resource
4. **@ApiOperation** - Describes what each endpoint does
5. **@ApiResponse** - Documents possible response codes and descriptions
6. **@ApiBearerAuth('jwt')** - Indicates JWT authentication requirement
7. **@ApiQuery** - Documents query parameters for GET endpoints

### Example Property Documentation

```typescript
@ApiProperty({
  example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  description: 'UUID of the user',
})
```

---

## Benefits

✅ Clear API documentation for frontend developers
✅ Interactive testing interface in Swagger UI
✅ Automatic client SDK generation from OpenAPI spec
✅ Better IDE autocomplete and type hints
✅ Professional API documentation for external consumers
✅ Easy API discovery and onboarding for new developers
