import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  password: string;
}
