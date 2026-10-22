
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Jorge',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    example: 'prueba@gamezone.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña de mínimo 8 caracteres',
    minLength: 8,
    maxLength: 72,
    format: 'password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
