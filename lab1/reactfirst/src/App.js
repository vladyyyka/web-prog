import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { FaPlus, FaMinus, FaTimes, FaDivide, FaTelegramPlane, FaVk } from 'react-icons/fa'; // Иконки

function App() {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async (operation) => {
    if (isNaN(first) || isNaN(second) || first === '' || second === '') {
      setError('Введите два числа.');
      setResult(null);
      return;
    }

    try {
      const response = await fetch(`/${operation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `first=${first}&second=${second}`,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setError(null);
        setResult(data.result);
      }
    } catch (error) {
      setError('Во время расчета произошла ошибка.');
    }
  };

  return (
    <div>
      <div className="container calculator-container">
        <h1 className="text-center mt-5 calculator-title">Калькулятор</h1>
        <div className="row mt-4">
          <div className="col-md-6 offset-md-3 calculator-form">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="first" className="form-label">
                  Первое число
                </label>
                <input
                  type="number"
                  className="form-control input-number"
                  id="first"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="second" className="form-label">
                  Второе число
                </label>
                <input
                  type="number"
                  className="form-control input-number"
                  id="second"
                  value={second}
                  onChange={(e) => setSecond(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mt-4 button-group">
                <button
                  type="button"
                  className="btn btn-primary calc-btn mx-2"
                  onClick={() => handleCalculate('add')}
                >
                  <FaPlus /> Сложить
                </button>
                <button
                  type="button"
                  className="btn btn-secondary calc-btn mx-2"
                  onClick={() => handleCalculate('subtract')}
                >
                  <FaMinus /> Вычесть
                </button>
                <button
                  type="button"
                  className="btn btn-success calc-btn mx-2"
                  onClick={() => handleCalculate('multiply')}
                >
                  <FaTimes /> Умножить
                </button>
                <button
                  type="button"
                  className="btn btn-danger calc-btn mx-2"
                  onClick={() => handleCalculate('divide')}
                >
                  <FaDivide /> Разделить
                </button>
              </div>
            </form>

            <div className="mt-4 result-container">
              {result !== null && (
                <div className="alert alert-success result-box">
                  Ответ: <strong>{result}</strong>
                </div>
              )}
              {error && (
                <div className="alert alert-danger result-box">
                  Ошибка: <strong>{error}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="footer bg-dark text-center text-white py-3">
        <div className="container">
          <a href="https://vk.com/id155673248" className="text-white mx-2" aria-label="ВКонтакте">
            <FaVk size={30} />
          </a>
          <a href="https://t.me/uxikka" className="text-white mx-2" aria-label="Телеграм">
            <FaTelegramPlane size={30} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
