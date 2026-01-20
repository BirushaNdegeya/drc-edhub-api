import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { School } from './school.model';
import { Section } from './section.model';
import { Class } from './class.model';
import { SchoolRequest } from './school-request.model';
import { Invitation } from './invitation.model';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../common/email/email.module';
import { AdminGuard } from '../common/guards/admin.guard';
import { SchoolAdminGuard } from '../common/guards/school-admin.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([School, Section, Class, SchoolRequest, Invitation]),
    UsersModule,
    EmailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expires = configService.get<string>('JWT_EXPIRES_IN') || '7d';
        return {
          secret: configService.get<string>('JWT_SECRET') || 'changeme',
          signOptions: { expiresIn: expires as any },
        };
      },
    }),
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService, AdminGuard, SchoolAdminGuard],
  exports: [SchoolsService],
})
export class SchoolsModule {}
