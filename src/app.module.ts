import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from './roles/roles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CategoriasModule } from './categorias/categorias.module';
import { VideojuegosModule } from './videojuegos/videojuegos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

     SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        uri: configService.getOrThrow<string>('DATABASE_URL'),
        autoLoadModels: true,
        synchronize: true,
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: true,
          },
        },
      }),
    }),


    RolesModule,

    UsuariosModule,

    AuthModule,

    CategoriasModule,

    VideojuegosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
