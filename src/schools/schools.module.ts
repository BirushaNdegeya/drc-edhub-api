import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { School } from './school.model';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { UsersModule } from '../users/users.module';
import { AdminGuard } from '../common/guards/admin.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([School]),
    UsersModule,
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
  providers: [SchoolsService, AdminGuard],
  exports: [SchoolsService],
})
export class SchoolsModule {}
