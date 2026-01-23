// user.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { School } from '../schools/school.model';
import { Course } from '../courses/course.model';
import { Enrollment } from '../courses/enrollment.model';
import { LessonProgress } from '../courses/lesson-progress.model';

export type UserRole =
  | 'student'
  | 'instructor'
  | 'admin'
  | 'inspector'
  | 'school-admin';

export type EducationLevel =
  | 'nursery'
  | 'primary'
  | 'secondary'
  | 'university'
  | 'master';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare firstname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastname: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare surname?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare age?: number;

  // School association
  @ForeignKey(() => School)
  @Column({ type: DataType.UUID, allowNull: true })
  declare schoolId?: string;

  @BelongsTo(() => School)
  declare school?: School;

  @Column({ type: DataType.STRING, allowNull: true })
  declare province?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare location?: string;

  @Column({
    type: DataType.ENUM(
      'student',
      'instructor',
      'admin',
      'inspector',
      'school-admin',
    ),
    allowNull: false,
    defaultValue: 'student',
  })
  declare role: UserRole;

  @Column({ type: DataType.ENUM('male', 'female'), allowNull: true })
  declare sex?: 'male' | 'female';

  @Column({ type: DataType.STRING, allowNull: true })
  declare section?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare class?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare bio?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare country?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare dateBirth?: Date;

  @Column({
    type: DataType.ENUM('nursery', 'primary', 'secondary', 'university', 'master'),
    allowNull: true,
  })
  declare level?: EducationLevel;

  @Column({ type: DataType.STRING, allowNull: true })
  declare avatar?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare googleId?: string;

  // Associations
  @HasMany(() => Course, { foreignKey: 'createdById', as: 'createdCourses' })
  declare createdCourses: Course[];

  @HasMany(() => Course, {
    foreignKey: 'instructorId',
    as: 'instructedCourses',
  })
  declare instructedCourses: Course[];

  @HasMany(() => Enrollment)
  declare enrollments: Enrollment[];

  @HasMany(() => LessonProgress)
  declare lessonProgresses: LessonProgress[];
}
