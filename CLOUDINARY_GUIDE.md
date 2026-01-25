# Cloudinary Integration Guide

This document explains how to use Cloudinary for image uploads in the DRC EdHub API project.

## Setup

### 1. Environment Variables

Add your Cloudinary credentials to `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get these credentials from [Cloudinary Dashboard](https://cloudinary.com/console).

### 2. Module Import

The `CloudinaryModule` is already imported in `app.module.ts`. It provides:
- `CloudinaryService`: For programmatic image uploads
- `CloudinaryController`: REST API endpoints for image management

## Usage

### Option 1: Using CloudinaryService in Other Modules

Import `CloudinaryModule` in any module where you need image upload functionality:

```typescript
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

Use it in your service:

```typescript
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async updateUserAvatar(userId: string, file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(
      file,
      'drc-edhub/users', // folder path
    );
    
    // Save the result.secureUrl to database
    await this.update(userId, { avatar: result.secureUrl });
    
    return result;
  }
}
```

### Option 2: Using REST API Endpoints

#### Upload a Single Image

```http
POST /api/cloudinary/upload
Content-Type: multipart/form-data

file: <binary-file>
folder: drc-edhub/users (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "http://res.cloudinary.com/...",
    "secureUrl": "https://res.cloudinary.com/...",
    "publicId": "drc-edhub/users/abc123"
  }
}
```

#### Upload Multiple Images

```http
POST /api/cloudinary/upload-multiple
Content-Type: multipart/form-data

files: <binary-files>
folder: drc-edhub/courses (optional)
```

#### Delete an Image

```http
DELETE /api/cloudinary/delete/{publicId}
```

#### Get Image Information

```http
GET /api/cloudinary/info/{publicId}
```

#### Generate Transformation URL

```http
GET /api/cloudinary/transform/{publicId}?width=200&height=200&crop=fill&quality=auto&format=webp
```

## CloudinaryService API

### Methods

#### `uploadFile(file, folder?, publicId?)`

Upload a single file to Cloudinary.

**Parameters:**
- `file`: Express.Multer.File - The file to upload
- `folder`: string (default: 'drc-edhub') - Folder path in Cloudinary
- `publicId`: string (optional) - Custom public ID for the file

**Returns:**
```typescript
Promise<{
  url: string;           // HTTP URL
  publicId: string;      // Cloudinary public ID
  secureUrl: string;     // HTTPS URL (recommended)
}>
```

**Example:**
```typescript
const result = await this.cloudinaryService.uploadFile(
  file,
  'drc-edhub/avatars',
  `user-${userId}`
);
```

#### `uploadMultiple(files, folder?)`

Upload multiple files to Cloudinary.

**Parameters:**
- `files`: Express.Multer.File[] - Array of files
- `folder`: string (default: 'drc-edhub') - Folder path

**Returns:**
```typescript
Promise<Array<{
  url: string;
  publicId: string;
  secureUrl: string;
}>>
```

#### `deleteFile(publicId)`

Delete a file from Cloudinary.

**Parameters:**
- `publicId`: string - Cloudinary public ID

**Example:**
```typescript
await this.cloudinaryService.deleteFile('drc-edhub/avatars/user-123');
```

#### `getFileInfo(publicId)`

Get detailed information about a file.

**Parameters:**
- `publicId`: string - Cloudinary public ID

**Returns:**
```typescript
Promise<any> // Cloudinary API response with file metadata
```

#### `generateTransformationUrl(publicId, options)`

Generate a transformed image URL without uploading.

**Parameters:**
- `publicId`: string - Cloudinary public ID
- `options`: object
  - `width?: number` - Width in pixels
  - `height?: number` - Height in pixels
  - `crop?: string` - Crop mode (fill, fit, pad, etc.)
  - `quality?: string` - Quality level (auto, 80, etc.)
  - `format?: string` - Output format (webp, jpg, etc.)

**Returns:**
```typescript
string // Transformed image URL
```

**Example:**
```typescript
const thumbnailUrl = this.cloudinaryService.generateTransformationUrl(
  'drc-edhub/avatars/user-123',
  { width: 150, height: 150, crop: 'fill', quality: 'auto' }
);
```

## File Validation

The service automatically validates:
- **File size**: Maximum 5MB
- **File type**: JPEG, PNG, GIF, WebP, SVG only

## Integration Example: User Avatar Upload

Here's a complete example for user avatar upload:

```typescript
// users.controller.ts
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateUserAvatar(userId, file);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersRepository: typeof User,
  ) {}

  async updateUserAvatar(userId: string, file: Express.Multer.File) {
    // Upload to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      'drc-edhub/users/avatars',
      `user-${userId}`, // This will overwrite if user uploads again
    );

    // Update user record with the image URL
    await this.usersRepository.update(
      { avatar: uploadResult.secureUrl },
      { where: { id: userId } }
    );

    return {
      success: true,
      message: 'Avatar updated successfully',
      avatar: uploadResult.secureUrl,
    };
  }
}
```

## Integration Example: Course Materials Upload

```typescript
// courses.controller.ts
@Post(':id/materials')
@UseInterceptors(FilesInterceptor('materials', 10))
async uploadCourseMaterials(
  @Param('id') courseId: string,
  @UploadedFiles() files: Express.Multer.File[],
) {
  return this.coursesService.addCourseMaterials(courseId, files);
}

// courses.service.ts
async addCourseMaterials(courseId: string, files: Express.Multer.File[]) {
  const uploadResults = await this.cloudinaryService.uploadMultiple(
    files,
    `drc-edhub/courses/${courseId}/materials`
  );

  // Save file references to database
  const materials = uploadResults.map(result => ({
    courseId,
    fileUrl: result.secureUrl,
    publicId: result.publicId,
  }));

  await this.courseMaterialsRepository.bulkCreate(materials);

  return {
    success: true,
    message: 'Materials uploaded successfully',
    materials: uploadResults,
  };
}
```

## Best Practices

1. **Always use secureUrl**: Use `secureUrl` instead of `url` for HTTPS security
2. **Organize with folders**: Use meaningful folder structures like `drc-edhub/users/avatars`
3. **Custom public IDs**: Use custom public IDs to make it easy to identify and replace files
4. **Store URLs in database**: Save the Cloudinary URL in your database for persistence
5. **Generate thumbnails**: Use transformations for responsive image handling
6. **Clean up on delete**: Delete files from Cloudinary when user data is deleted

```typescript
// Example: Delete user avatar when user is deleted
async deleteUser(userId: string) {
  const user = await this.usersRepository.findByPk(userId);
  
  // Delete from Cloudinary if avatar exists
  if (user.avatar) {
    const publicId = `drc-edhub/users/avatars/user-${userId}`;
    await this.cloudinaryService.deleteFile(publicId);
  }

  await user.destroy();
}
```

## Cloudinary Features Available

- **Automatic format optimization**: `fetch_format: 'auto'`
- **Quality optimization**: `quality: 'auto'`
- **Responsive images**: Generate multiple sizes for different devices
- **Image transformations**: Crop, resize, rotate, watermark, etc.
- **Video support**: Upload and transform videos
- **Asset management**: Organize files in folders with metadata

## Troubleshooting

### "Invalid Cloudinary credentials"
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`
- Check Cloudinary Dashboard for correct values

### "File size exceeds 5MB limit"
- Current limit is 5MB. Increase in `cloudinary.service.ts` if needed

### "Invalid file type"
- Only image formats are allowed by default: JPEG, PNG, GIF, WebP, SVG
- Modify `allowedMimes` array in service to support other types

### Files not persisting
- Always save the returned `secureUrl` to your database
- Keep track of `publicId` for future deletions

## Resources

- [Cloudinary Official Dashboard](https://cloudinary.com/console)
- [Cloudinary Node.js SDK Documentation](https://cloudinary.com/documentation/node_integration)
- [Image Transformation Reference](https://cloudinary.com/documentation/image_transformation_reference)
