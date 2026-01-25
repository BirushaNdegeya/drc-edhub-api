import { Module, OnModuleInit, Injectable, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Sequelize } from 'sequelize-typescript';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { SchoolsModule } from './schools/schools.module';
import { CoursesModule } from './courses/courses.module';
import { EmailModule } from './common/email/email.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';

// Ensure DB schema includes avatar column when app boots (safe, idempotent)
@Injectable()
export class DbSchemaSync implements OnModuleInit {
  private readonly logger = new Logger(DbSchemaSync.name);

  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      if (!this.sequelize) {
        this.logger.warn(
          'Sequelize instance not available, skipping schema sync',
        );
        return;
      }
      // Ensure core user columns exist (idempotent, safe to run on every boot)
      await this.sequelize.query(`
        ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "avatar" VARCHAR,
        ADD COLUMN IF NOT EXISTS "schoolId" UUID,
        ADD COLUMN IF NOT EXISTS "country" VARCHAR,
        ADD COLUMN IF NOT EXISTS "dateBirth" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "level" VARCHAR
      `);
      this.logger.log(
        'Ensured users.avatar, users.schoolId, users.country, users.dateBirth, users.level columns exist',
      );

      // Ensure core schools columns exist
      // First create ENUM type if it doesn't exist
      await this.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "enum_schools_level" AS ENUM ('nursery', 'primary', 'secondary', 'university', 'master');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      
      await this.sequelize.query(`
        ALTER TABLE "schools"
        ADD COLUMN IF NOT EXISTS "slug" VARCHAR,
        ADD COLUMN IF NOT EXISTS "matricule" VARCHAR,
        ADD COLUMN IF NOT EXISTS "level" "enum_schools_level",
        ADD COLUMN IF NOT EXISTS "member" INTEGER
      `);
      this.logger.log('Ensured schools.slug, schools.matricule, schools.level, and schools.member columns exist');

      // Check if schools table exists before adding foreign key
      const [tableResults] = await this.sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schools'
      `);

      if (tableResults.length > 0) {
        // Add foreign key constraint if it doesn't exist
        const [constraintResults] = await this.sequelize.query(`
          SELECT constraint_name 
          FROM information_schema.table_constraints 
          WHERE table_name = 'users' 
          AND constraint_name = 'users_schoolId_fkey'
        `);

        if (constraintResults.length === 0) {
          await this.sequelize.query(`
            ALTER TABLE "users" 
            ADD CONSTRAINT "users_schoolId_fkey" 
            FOREIGN KEY ("schoolId") 
            REFERENCES "schools"("id") 
            ON DELETE SET NULL 
            ON UPDATE CASCADE;
          `);
          this.logger.log('Added foreign key constraint for users.schoolId');
        }
      } else {
        this.logger.warn(
          'Schools table does not exist yet, skipping foreign key constraint. It will be added when schools table is created.',
        );
      }
    } catch (err) {
      this.logger.error('Failed to ensure users schema columns exist', err);
    }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', ''),
        database: configService.get<string>('DB_NAME', 'drc_db'),

        models: [],
        autoLoadModels: true,
        logging: false,

        // 👇 ADD THIS BLOCK
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    UsersModule,
    AuthModule,
    AcademicYearsModule,
    SchoolsModule,
    CoursesModule,
    EmailModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, DbSchemaSync],
})
export class AppModule {}
