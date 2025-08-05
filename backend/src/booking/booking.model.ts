import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Room } from 'src/rooms/rooms.model';
import { User } from 'src/users/users.model';

interface BookingCreationAttrs {
  user_id: number;
  room_id: number;
  start_date: Date;
  end_date: Date;
}

@Table({ tableName: 'booked_rooms', timestamps: false })
export class Booking extends Model<Booking, BookingCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  booking_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @ForeignKey(() => Room)
  @Column({ type: DataType.INTEGER, allowNull: false })
  room_id: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_vip: boolean;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  start_date: Date;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  end_date: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Room)
  room: Room;
}
