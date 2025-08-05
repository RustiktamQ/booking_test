import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto, properties = { isVip: false }) {
    const user = await this.userRepository.create(dto);

    if (!user) {
      throw new HttpException(
        'Create server user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const res = await axios.post(
        `http://localhost:${process.env.REMOTE_API_PORT}/api/saveUserStatus`,
        {
          user_id: user.get('user_id'),
          status: properties.isVip,
        },
      );
    } catch (error) {
      console.log(error);
      // sry for bad solve
      await this.userRepository.destroy({
        where: { user_id: user.get('user_id') },
      });
    }

    return user;
  }

  async getUser(dto: CreateUserDto) {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async seed() {
    await this.userRepository.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await this.createUser({ email: 'defaultUser@gmail.com', password: '123' });
    await this.createUser(
      { email: 'vipUser@gmail.com', password: '321' },
      { isVip: true },
    );
  }
}
