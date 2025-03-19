import { ApiProperty } from '@nestjs/swagger';

export class AuthorizationUserDto {
  @ApiProperty({ example: 'tmukola2006@gmail.com', description: '' })
  login: string;

  @ApiProperty({ example: 'Tm2611', description: '' })
  password: string;
}
