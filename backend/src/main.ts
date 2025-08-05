import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { BookingService } from './booking/booking.service';
import { RoomsService } from './rooms/rooms.service';

async function bootstrap() {
  const PORT = process.env.APP_PORT || 3001;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  const userService = app.get(UsersService);
  const roomService = app.get(RoomsService);
  const bookingService = app.get(BookingService);

  await userService.seed();
  await roomService.seed();
  await bookingService.seed();

  await app.listen(PORT, () => {
    console.log(`app started: http://localhost:${PORT}`);
  });
}

bootstrap();
