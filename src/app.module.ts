import { Module, OnModuleInit, Injectable, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Sequelize } from 'sequelize-typescript';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';

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
      // Add avatar column if missing
      await this.sequelize.query(
        'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" VARCHAR;',
      );
      this.logger.log('Ensured users.avatar column exists');
    } catch (err) {
      this.logger.error(
        'Failed to ensure users.avatar column exists',
        err as any,
      );
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
  ],
  controllers: [AppController],
  providers: [AppService, DbSchemaSync],
})
export class AppModule {}
