import { useEffect, useState } from 'react';

interface Room {
  room_id: number;
}

interface Booking {
  room_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
}

function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [show, setShow] = useState(false);

  const userId = Number(localStorage.getItem('token'));

  useEffect(() => {
    fetch(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/rooms`)
      .then((res) => res.json())
      .then(setRooms)
      .catch(console.error);

    if (userId) {
      fetch(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/booking/${userId}`)
        .then((res) => res.json())
        .then(setBookings)
        .catch(console.error);
    }
  }, [userId]);

  const openModal = (id: number) => {
    setSelectedRoom(id);
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setSelectedRoom(null);
    setStart('');
    setEnd('');
  };

  const isRoomBooked = (roomId: number) => {
    return bookings.some((b) => b.room_id === roomId);
  };

  const book = async () => {
    if (!userId || !selectedRoom || !start || !end) {
      alert('Все поля обязательны');
      return;
    }

    const payload = {
      user_id: userId,
      room_id: selectedRoom,
      start_date: new Date(start),
      end_date: new Date(end),
    };

    try {
      const res = await fetch(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Успешно!');
        closeModal();
        setBookings((prev) => [
          ...prev,
          {
            user_id: userId,
            room_id: selectedRoom,
            start_date: start,
            end_date: end,
          },
        ]);
      } else {
        alert(data.message || 'Ошибка бронирования');
      }
    } catch (e) {
      console.log('Ошибка брони:', e);
    }
  };

  const cancelBooking = async (roomId: number) => {
    const payload = {
      user_id: userId,
      room_id: roomId,
    };

    try {
      const res = await fetch(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/booking/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Бронь отменена');
        setBookings((prev) => prev.filter((b) => b.room_id !== roomId));
      } else {
        alert(data.message || 'Ошибка отмены');
      }
    } catch (err) {
      console.log('Ошибка отмены:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Комнаты</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {rooms.map(({ room_id }) => (
          <div
            key={room_id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '1rem',
              width: '200px',
            }}
          >
            <h3>Комната #{room_id}</h3>
            {isRoomBooked(room_id) ? (
              <button onClick={() => cancelBooking(room_id)}>
                Отменить бронь
              </button>
            ) : (
              <button onClick={() => openModal(room_id)}>Бронь</button>
            )}
          </div>
        ))}
      </div>

      {show && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '6px',
              width: '280px',
            }}
          >
            <h2>Бронь #{selectedRoom}</h2>

            <label>Начало:</label>
            <input
              type='date'
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{ width: '100%', marginBottom: '0.8rem' }}
            />

            <label>Конец:</label>
            <input
              type='date'
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{ width: '100%', marginBottom: '0.8rem' }}
            />

            <button onClick={book} style={{ marginRight: '1rem' }}>
              Забронировать
            </button>
            <button onClick={closeModal}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
