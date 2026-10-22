import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/role.model';

@Module({
   imports: [
    SequelizeModule.forFeature([Role]),
  ],
  providers: [RolesService],
  controllers: [RolesController]
})
export class RolesModule {}
