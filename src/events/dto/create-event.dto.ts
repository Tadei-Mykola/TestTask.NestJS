import { ApiProperty } from '@nestjs/swagger';
import { Priority } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Meeting', description: '' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is a meeting about the latest technological advancements.',
    description: '',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '2022-01-01T10:00:00Z', description: '' })
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({ example: 'IMPORTANT', description: '' })
  @IsIn([Priority.CRITICAL, Priority.NORMAL, Priority.IMPORTANT])
  priority: Priority;

  @ApiProperty({ example: false, description: '' })
  isDeleted: boolean = false;

  @ApiProperty({ example: 1, description: '' })
  userId: number = 0;
}
