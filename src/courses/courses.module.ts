import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Course } from './course.model';
import { Module as CourseModule } from './module.model';
import { Lesson } from './lesson.model';
import { Enrollment } from './enrollment.model';
import { LessonProgress } from './lesson-progress.model';
import { CourseAssignment } from './course-assignment.model';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { LessonProgressController } from './lesson-progress.controller';
import { LessonProgressService } from './lesson-progress.service';
import { CourseAssignmentsController } from './course-assignments.controller';
import { CourseAssignmentsService } from './course-assignments.service';
import { UsersModule } from '../users/users.module';
import { AdminGuard } from '../common/guards/admin.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Course,
      CourseModule,
      Lesson,
      Enrollment,
      LessonProgress,
      CourseAssignment,
    ]),
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
  controllers: [
    CoursesController,
    ModulesController,
    LessonsController,
    EnrollmentsController,
    LessonProgressController,
    CourseAssignmentsController,
  ],
  providers: [
    CoursesService,
    ModulesService,
    LessonsService,
    EnrollmentsService,
    LessonProgressService,
    CourseAssignmentsService,
    AdminGuard,
  ],
  exports: [
    SequelizeModule,
    CoursesService,
    ModulesService,
    LessonsService,
    EnrollmentsService,
    LessonProgressService,
    CourseAssignmentsService,
  ],
})
export class CoursesModule {}
