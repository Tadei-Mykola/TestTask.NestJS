import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsPositive } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({ example: 1, description: "Event's id" })
  @IsPositive()
  id: number;
}
