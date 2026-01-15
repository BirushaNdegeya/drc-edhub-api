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

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstname!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastname!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  surname?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  age?: number;

  // School association
  @ForeignKey(() => School)
  @Column({ type: DataType.UUID, allowNull: true })
  schoolId?: string;

  @BelongsTo(() => School)
  school?: School;

  @Column({ type: DataType.STRING, allowNull: true })
  province?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  location?: string;

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
  role!: UserRole;

  @Column({ type: DataType.ENUM('male', 'female'), allowNull: true })
  sex?: 'male' | 'female';

  @Column({ type: DataType.STRING, allowNull: true })
  section?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  class?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  googleId?: string;

  // Associations
  @HasMany(() => Course, { foreignKey: 'createdById', as: 'createdCourses' })
  createdCourses!: Course[];

  @HasMany(() => Course, {
    foreignKey: 'instructorId',
    as: 'instructedCourses',
  })
  instructedCourses!: Course[];

  @HasMany(() => Enrollment)
  enrollments!: Enrollment[];

  @HasMany(() => LessonProgress)
  lessonProgresses!: LessonProgress[];
}
