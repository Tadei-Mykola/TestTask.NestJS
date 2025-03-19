import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'tmukola2006@gmail.com', description: '' })
  email: string;

  @ApiProperty({ example: 'TM', description: '' })
  name: string;

  @ApiProperty({ example: 'Tm2611', description: '' })
  password: string;
}
