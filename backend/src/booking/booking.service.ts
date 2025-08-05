import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import axios from 'axios';
import { RoomsService } from 'src/rooms/rooms.service';
import { DeletBookingDto } from './dto/delete-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking) private bookingRepository: typeof Booking,
    private roomService: RoomsService,
  ) {}

  async bookRoom(dto: CreateBookingDto) {
    const allRooms = await this.roomService.getRooms();
    const allBookings = await this.getAllBookings();

    const roomIsExist = allRooms.some(
      (room) => room.get('room_id') === dto.room_id,
    );

    if (!roomIsExist) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    const isBusy = allBookings.some(
      (book) =>
        new Date(dto.start_date) <= new Date(book.get('end_date')) &&
        new Date(dto.end_date) >= new Date(book.get('start_date')) &&
        dto.room_id === book.get('room_id'),
    );

    if (new Date(dto.start_date) > new Date(dto.end_date)) {
      throw new HttpException('You cant revers book', HttpStatus.CONFLICT);
    }

    if (isBusy) {
      throw new HttpException('Romm is already booked', HttpStatus.CONFLICT);
    }

    const booking = await this.bookingRepository.create(dto);

    if (!booking)
      throw new HttpException(
        'Iternal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    try {
      const res = await axios.get(
        `http://localhost:${process.env.REMOTE_API_PORT}/api/getUserStatus/${booking.get('user_id')}`,
      );

      if (res.status !== 200) {
        throw new HttpException(
          'Remote api error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const userStatus = res.data.status;
      booking.set('is_vip', userStatus);
      await booking.save();
    } catch (err) {
      throw new HttpException(
        'Iternal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return booking;
  }

  async getAllBookings() {
    return this.bookingRepository.findAll();
  }

  async getUserBooks(user_id: number) {
    return this.bookingRepository.findAll({ where: { user_id } });
  }

  async deleteBook(dto: DeletBookingDto) {
    return this.bookingRepository.destroy({
      where: { user_id: dto.user_id, room_id: dto.room_id },
    });
  }

  async seed() {
    await this.bookingRepository.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await this.bookRoom({
      user_id: 1,
      room_id: 1,
      start_date: new Date('2025-08-01'),
      end_date: new Date('2025-08-02'),
    });

    await this.bookRoom({
      user_id: 2,
      room_id: 2,
      start_date: new Date('2025-08-03'),
      end_date: new Date('2025-08-04'),
    });
  }
}
