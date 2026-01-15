// lesson-progress.model.ts
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
import { Lesson } from './lesson.model';

@Table({
  tableName: 'lesson_progress',
  timestamps: true,
  indexes: [
    {
      unique: true,
      name: 'unique_lesson_progress',
      fields: ['userId', 'lessonId'],
    },
  ],
})
export class LessonProgress extends Model<LessonProgress> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Lesson)
  @Column({ type: DataType.UUID, allowNull: false })
  lessonId!: string;

  @BelongsTo(() => Lesson)
  lesson!: Lesson;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  completed!: boolean;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  watchedSeconds!: number;

  @Column({ type: DataType.DATE, allowNull: true })
  completedAt?: Date;
}
