import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DeletBookingDto } from './dto/delete-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  book(@Body() bookingDto: CreateBookingDto) {
    return this.bookingService.bookRoom(bookingDto);
  }

  @Get(':user_id')
  getByUser(@Param('user_id') user_id: number) {
    return this.bookingService.getUserBooks(user_id);
  }

  @Get('/all')
  getAll() {
    return this.bookingService.getAllBookings();
  }

  @Post('/cancel')
  delete(@Body() deleteDto: DeletBookingDto) {
    return this.bookingService.deleteBook(deleteDto);
  }
}
