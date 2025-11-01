import { IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  readonly title: string;

  @IsBoolean()
  readonly completed: boolean;
}