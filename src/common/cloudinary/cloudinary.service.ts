import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Upload a file to Cloudinary
   * @param file - Express file object
   * @param folder - Optional folder path in Cloudinary
   * @param publicId - Optional custom public ID
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'drc-edhub',
    publicId?: string,
  ): Promise<{
    url: string;
    publicId: string;
    secureUrl: string;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size exceeds 5MB limit',
      );
    }

    // Validate file type
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed',
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: 'auto',
          overwrite: true,
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            this.logger.error(`Cloudinary upload error: ${error.message}`);
            reject(
              new BadRequestException(
                `Image upload failed: ${error.message}`,
              ),
            );
          } else if (result) {
            resolve({
              url: result.url,
              publicId: result.public_id,
              secureUrl: result.secure_url,
            });
          } else {
            reject(
              new BadRequestException(
                'Upload completed but no result returned from Cloudinary',
              ),
            );
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Upload multiple files to Cloudinary
   * @param files - Array of Express file objects
   * @param folder - Optional folder path in Cloudinary
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string = 'drc-edhub',
  ): Promise<
    Array<{
      url: string;
      publicId: string;
      secureUrl: string;
    }>
  > {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file) =>
      this.uploadFile(file, folder),
    );

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      this.logger.error(`Multiple file upload error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a file from Cloudinary by public ID
   * @param publicId - Cloudinary public ID
   */
  async deleteFile(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        this.logger.warn(
          `File deletion may have failed for ${publicId}: ${result.result}`,
        );
      }
    } catch (error) {
      this.logger.error(`Error deleting file from Cloudinary: ${error.message}`);
      throw new BadRequestException(
        `File deletion failed: ${error.message}`,
      );
    }
  }

  /**
   * Get file information from Cloudinary
   * @param publicId - Cloudinary public ID
   */
  async getFileInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      this.logger.error(`Error retrieving file info: ${error.message}`);
      throw new BadRequestException(
        `Failed to retrieve file info: ${error.message}`,
      );
    }
  }

  /**
   * Generate a transformation URL for an image
   * @param publicId - Cloudinary public ID
   * @param options - Transformation options
   */
  generateTransformationUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {},
  ): string {
    const transformations: Array<Record<string, any>> = [];

    if (options.width || options.height) {
      transformations.push({
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
      });
    }

    if (options.quality) {
      transformations.push({ quality: options.quality });
    }

    if (options.format) {
      transformations.push({ fetch_format: options.format });
    }

    try {
      return cloudinary.url(publicId, {
        transformation: transformations,
        secure: true,
      });
    } catch (error) {
      this.logger.error(`Error generating URL: ${error.message}`);
      throw new BadRequestException(
        `URL generation failed: ${error.message}`,
      );
    }
  }
}
