import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './rooms.model';

@Module({
  providers: [RoomsService],
  controllers: [RoomsController],
  imports: [SequelizeModule.forFeature([Room])],
  exports: [RoomsService],
})
export class RoomsModule {}
