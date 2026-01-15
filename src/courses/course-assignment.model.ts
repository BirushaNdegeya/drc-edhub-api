// course-assignment.model.ts
import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Course } from './course.model';
import { User } from '../users/user.model';

@Table({ 
  tableName: 'course_assignments', 
  timestamps: true,
  indexes: [
    {
      unique: true,
      name: 'unique_course_assignment',
      fields: ['courseId', 'instructorId'],
    },
  ],
})
export class CourseAssignment extends Model<CourseAssignment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, allowNull: false })
  courseId!: string;

  @BelongsTo(() => Course)
  course!: Course;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  instructorId!: string;

  @BelongsTo(() => User, { as: 'instructor' })
  instructor!: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  assignedById!: string;

  @BelongsTo(() => User, { foreignKey: 'assignedById', as: 'assignedBy' })
  assignedBy!: User;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  assignedAt!: Date;
}
