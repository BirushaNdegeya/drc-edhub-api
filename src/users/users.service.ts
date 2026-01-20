import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findByGoogleId(googleId: string) {
    return this.userModel.findOne({ where: { googleId } });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.userModel.findByPk(id);
  }

  async createFromGoogle(profile: any) {
    const email =
      profile.emails && profile.emails[0] && profile.emails[0].value;
    const avatar =
      profile.photos && profile.photos[0] && profile.photos[0].value;
    const [user] = await this.userModel.findOrCreate({
      where: { googleId: profile.id },
      // cast defaults to any to satisfy Sequelize typings for creation attributes
      defaults: {
        googleId: profile.id,
        email,
        firstname: profile.name?.givenName || 'Google',
        lastname: profile.name?.familyName || 'User',
        avatar,
      } as any,
    });

    // If the user exists but doesn't have an avatar stored, update it from Google
    if (avatar && !user.avatar) {
      await user.update({ avatar } as any);
    }

    return user;
  }

  async create(userData: any) {
    return this.userModel.create(userData as any);
  }

  async findByRoleAndSchool(role: string, schoolId: string) {
    return this.userModel.findAll({
      where: { role, schoolId },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    return user.update(dto as any);
  }
}

