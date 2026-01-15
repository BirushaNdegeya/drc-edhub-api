// enrollment.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Course } from './course.model';

@Table({
  tableName: 'enrollments',
  timestamps: true,
  indexes: [
    {
      unique: true,
      name: 'unique_enrollment',
      fields: ['userId', 'courseId'],
    },
  ],
})
export class Enrollment extends Model<Enrollment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, allowNull: false })
  courseId!: string;

  @BelongsTo(() => Course)
  course!: Course;

  @Default(0)
  @Column({ type: DataType.FLOAT })
  progressPercentage!: number;

  @Column({ type: DataType.DATE, allowNull: true })
  completedAt?: Date;

  @Index
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  enrolledAt!: Date;
}
