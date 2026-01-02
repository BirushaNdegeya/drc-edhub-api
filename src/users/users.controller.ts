import { Controller, Patch, Body, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update currently authenticated user (id from token)' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Fields to update. Only include fields you want to change.',
    schema: {
      example: {
        firstname: 'Jane',
        lastname: 'Doe',
        age: 25,
        email: 'jane@example.com',
        role: 'student',
        sex: 'female',
          school: 'St Mary School',
          province: 'Province X',
          location: 'City Y',
          avatar: 'https://lh3.googleusercontent.com/a-/AOh14Gj...photo.jpg',
        section: 'A',
        class: 'Grade 3',
      },
    },
  })
  @ApiOkResponse({
    description: 'Updated user object returned',
    type: UserDto,
    schema: {
      example: {
        id: 1,
        firstname: 'Jane',
        lastname: 'Doe',
        surname: null,
        age: 25,
        school: 'St Mary School',
        province: 'Province X',
        location: 'City Y',
        role: 'student',
        sex: 'female',
          section: 'A',
          class: 'Grade 3',
          email: 'jane@example.com',
          avatar: 'https://lh3.googleusercontent.com/a-/AOh14Gj...photo.jpg',
        createdAt: '2026-01-01T12:00:00.000Z',
        updatedAt: '2026-01-02T12:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'User not found (invalid token id)' })
  async update(@Req() req: any, @Body() dto: UpdateUserDto) {
    const id = req.user?.id;
    const updated = await this.usersService.update(id, dto);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }
}
