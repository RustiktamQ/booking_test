import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/rooms');
    }
  }, [navigate]);

  const login = async () => {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.statusCode === 404 || !data) {
      alert('Пользователь не найден');
      return;
    }

    localStorage.setItem('token', data.user.user_id);
    navigate('/rooms');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '2rem',
        fontFamily: 'sans-serif',
        width: '300px',
      }}
    >
      <h1>Авторизация</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: 'block',
          marginBottom: '1rem',
          padding: '0.5rem',
          width: '100%',
        }}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: 'block',
          marginBottom: '1rem',
          padding: '0.5rem',
          width: '100%',
        }}
      />
      <button
        onClick={login}
        style={{ padding: '0.5rem 1rem', width: '100%' }}
      >
        Войти
      </button>
    </div>
  );
}

export default App;
