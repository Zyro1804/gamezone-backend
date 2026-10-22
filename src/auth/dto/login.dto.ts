
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@gamezone.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'GameZone123!',
    description: 'Contraseña del usuario',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
