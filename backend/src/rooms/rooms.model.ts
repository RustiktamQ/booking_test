import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface RoomCreationAttrs {
  number: number;
}

@Table({ tableName: 'rooms', timestamps: false })
export class Room extends Model<Room, RoomCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  room_id: number;

  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  number: number;
}
