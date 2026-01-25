import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('api/cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Upload a single image
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          description: 'Cloudinary folder path (optional, default: drc-edhub)',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.cloudinaryService.uploadFile(
      file,
      folder || 'drc-edhub',
    );
    return {
      success: true,
      message: 'Image uploaded successfully',
      data: result,
    };
  }

  /**
   * Upload multiple images
   */
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload multiple images to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        folder: {
          type: 'string',
          description: 'Cloudinary folder path (optional, default: drc-edhub)',
        },
      },
    },
  })
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results = await this.cloudinaryService.uploadMultiple(
      files,
      folder || 'drc-edhub',
    );
    return {
      success: true,
      message: `${results.length} image(s) uploaded successfully`,
      data: results,
    };
  }

  /**
   * Delete an image
   */
  @Delete('delete/:publicId')
  @ApiOperation({ summary: 'Delete an image from Cloudinary' })
  async deleteFile(@Param('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    await this.cloudinaryService.deleteFile(publicId);
    return {
      success: true,
      message: 'Image deleted successfully',
    };
  }

  /**
   * Get image information
   */
  @Get('info/:publicId')
  @ApiOperation({ summary: 'Get image information from Cloudinary' })
  async getFileInfo(@Param('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    const info = await this.cloudinaryService.getFileInfo(publicId);
    return {
      success: true,
      data: info,
    };
  }

  /**
   * Generate transformation URL
   */
  @Get('transform/:publicId')
  @ApiOperation({ summary: 'Generate a transformation URL for an image' })
  async generateTransformationUrl(
    @Param('publicId') publicId: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('crop') crop?: string,
    @Query('quality') quality?: string,
    @Query('format') format?: string,
  ) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    const url = this.cloudinaryService.generateTransformationUrl(publicId, {
      width: width ? parseInt(width, 10) : undefined,
      height: height ? parseInt(height, 10) : undefined,
      crop,
      quality,
      format,
    });

    return {
      success: true,
      data: { url },
    };
  }
}
