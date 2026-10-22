import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Usuario } from '../usuarios/entities/usuario.model';
import { Role } from '../roles/entities/role.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
   imports: [
    SequelizeModule.forFeature([Usuario, Role]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET no está configurado en .env');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtAuthGuard,RolesGuard],
  controllers: [AuthController]
})
export class AuthModule {}
