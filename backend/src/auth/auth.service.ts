import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async login(dto: CreateUserDto) {
    const user = await this.userService.getUser(dto);

    return { user, token: user.password };
  }

  async register(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);

    return { user, token: user.password };
  }
}
