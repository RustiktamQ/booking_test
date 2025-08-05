import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  providers: [BookingService],
  controllers: [BookingController],
  imports: [SequelizeModule.forFeature([Booking]), RoomsModule],
})
export class BookingModule {}
