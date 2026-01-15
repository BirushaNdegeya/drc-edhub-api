// course.model.ts
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
  BelongsToMany,
} from 'sequelize-typescript';
import { School } from '../schools/school.model';
import { User } from '../users/user.model';
import { Module } from './module.model';
import { Enrollment } from './enrollment.model';
import { CourseAssignment } from './course-assignment.model';

export type CourseStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'archived';

@Table({ tableName: 'courses', timestamps: true })
export class Course extends Model<Course> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => School)
  @Column({ type: DataType.UUID, allowNull: false })
  schoolId!: string;

  @BelongsTo(() => School)
  school!: School;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  slug!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  durationWeeks?: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  totalLessons!: number;

  @Column({
    type: DataType.ENUM('draft', 'pending_review', 'published', 'archived'),
    defaultValue: 'draft',
  })
  status!: CourseStatus;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  createdById!: string;

  @BelongsTo(() => User, { foreignKey: 'createdById', as: 'createdBy' })
  createdBy!: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  instructorId?: string;

  @BelongsTo(() => User, { foreignKey: 'instructorId', as: 'instructor' })
  instructor?: User;

  @Column({ type: DataType.DATE, allowNull: true })
  publishedAt?: Date;

  // Associations
  @HasMany(() => Module)
  modules!: Module[];

  @HasMany(() => Enrollment)
  enrollments!: Enrollment[];

  @HasMany(() => CourseAssignment)
  assignments!: CourseAssignment[];

  @BelongsToMany(() => User, () => CourseAssignment)
  assignedInstructors!: User[];
}
