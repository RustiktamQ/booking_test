import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Post()
  create(@Body() roomDto: CreateRoomDto) {
    return this.roomService.createRoom(roomDto);
  }

  @Get()
  get() {
    return this.roomService.getRooms();
  }
}
