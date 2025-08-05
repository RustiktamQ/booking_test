import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './rooms.model';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room) private roomRepository: typeof Room) {}

  async createRoom(dto: CreateRoomDto) {
    const room = await this.roomRepository.create(dto);

    if (!room)
      new HttpException('Iternal error', HttpStatus.INTERNAL_SERVER_ERROR);

    return room;
  }

  async getRooms() {
    return this.roomRepository.findAll();
  }

  async seed() {
    await this.roomRepository.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await this.createRoom({ number: 1 });
    await this.createRoom({ number: 2 });
    await this.createRoom({ number: 3 });
    await this.createRoom({ number: 4 });
    await this.createRoom({ number: 5 });
  }
}
