import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario } from '../usuarios/entities/usuario.model';
import { Role } from '../roles/entities/role.model';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario)
    private readonly usuarioModel: typeof Usuario,

    @InjectModel(Role)
    private readonly roleModel: typeof Role,
    
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const usuarioExiste = await this.usuarioModel.findOne({
      where: { email },
    });

    if (usuarioExiste) {
      throw new ConflictException('El correo ya está registrado');
    }

    const rolUser = await this.roleModel.findOne({
      where: { nombre: 'USER' },
    });

    if (!rolUser) {
      throw new InternalServerErrorException(
        'No se encontró el rol USER',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const usuario = await this.usuarioModel.create({
        nombre: dto.nombre.trim(),
        email,
        password: passwordHash,
        rolId: rolUser.id,
        activo: true,
      } as any);

      return {
        message: 'Usuario registrado correctamente',
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: rolUser.nombre,
        },
      };
    } catch (error:any) {
      if (error?.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('El correo ya está registrado');
      }

      throw error;
    }
  }

  
async login(dto: LoginDto) {
  const email = dto.email.trim().toLowerCase();

  const usuario = await this.usuarioModel.findOne({
    where: { email },
    include: [
      {
        model: Role,
        attributes: ['id', 'nombre'],
      },
    ],
  });

  if (!usuario || !usuario.activo) {
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  const passwordValida = await bcrypt.compare(
    dto.password,
    usuario.password,
  );

  if (!passwordValida) {
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  if (!usuario.rol) {
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  const payload = {
    sub: usuario.id,
    email: usuario.email,
    rol: usuario.rol.nombre,
  };

  const accessToken = await this.jwtService.signAsync(payload);

  return {
    message: 'Inicio de sesión exitoso',
    access_token: accessToken,
    token_type: 'Bearer',
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol.nombre,
    },
  };
}

}

