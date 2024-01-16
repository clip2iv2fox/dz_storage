import { useEffect, useState } from 'react';
import './App.css';
import Button from './components/button/button';
import Header from './components/header/header';
import Accordion from './components/accordion/accordion';
import Modal from './components/modal/modal';
import Input from './components/input/input';
import NumInput from './components/input/numInput';
import axios from 'axios';
import Platform from './components/platform/platform';

function App() {
  const [planes, setPlanes] = useState([]);
  const [flights, setFlights] = useState([]);
  const [notification, setNotification] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isCase, setCase] = useState("");
  const [planeData, setPlaneData] = useState({ name: "", value: 1 });

  useEffect(() => {
    getPlanes();
    getFlights();
  }, []);

  const getFlights = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/flight');
      setFlights(response.data);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const getPlanes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/plane');
      setPlanes(response.data);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const deletePlanes = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/plane/${id}`);
      setPlanes(response.data);
      setOpen(false);
      setNotification("");
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleErrorResponse = (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      setNotification(error.response.data.error);
    } else {
      setNotification('Ошибка сервера');
    }
  };

  const createPlanes = async () => {
    if (planeData.name === "" || planeData.value === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/plane', planeData);
        setPlanes(response.data);
        setPlaneData({ ...planeData, name: "", value: "" })
        setOpen(false);
      } catch (error) {
        handleErrorResponse(error);
      }
    }
  };

  const ModalCases = () => {
    switch (isCase) {
      case "Добавить самолёт":
        return (
          <div>
            <div className="accordion-bottom">
              <div>
                Имя самолёта: <Input input={(value) => setPlaneData({ ...planeData, name: value })} placeholder={"введите имя..."} />
              </div>
              <div>
                Места: <NumInput input={(value) => setPlaneData({ ...planeData, value: value })} min={1} placeholder={"введите количество..."} />
              </div>
            </div>
            <div className="accordion-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={createPlanes}>подтвердить</Button>
            </div>
          </div>
        );
      case "Создать рейс":
        return (
          <div>
            <div className="accordion-bottom">
              <div>
                № рейса: <Input input={(value) => setPlaneData({ ...planeData, name: value })} placeholder={"введите имя..."} />
              </div>
              <div>
                Места: <NumInput input={(value) => setPlaneData({ ...planeData, value: value })} min={1} placeholder={"введите количество..."} />
              </div>
              <div>
                Места: <NumInput input={(value) => setPlaneData({ ...planeData, value: value })} min={1} placeholder={"введите количество..."} />
              </div>
              <div>
                Места: <NumInput input={(value) => setPlaneData({ ...planeData, value: value })} min={1} placeholder={"введите количество..."} />
              </div>
            </div>
            <div className="accordion-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={createPlanes}>подтвердить</Button>
            </div>
          </div>
        );
      default:
        return (<div>данного модального окна не существует</div>);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className='App-body'>
        <div className='sidebar'>
          {planes.map((plane) =>
            <Platform
              key={plane.id}
              id={plane.id}
              name={plane.name}
              value={plane.value}
              notification={notification}
              del={(id) => deletePlanes(id)}
            />
          )}
          <Button onClick={() => (setOpen(true), setCase("Добавить самолёт"))}>+ самолёт</Button>
        </div>
        <div className='main'>
          {flights.map((flight) =>
            <Accordion
              key={flight.id}
              title={""}
            >
            </Accordion>
          )}
          <div className='avia-button'>
            <Button onClick={() => (setOpen(true), setCase("Создать рейс"))} type={"danger"}>+ рейс</Button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setOpen(false)} title={isCase}>
        {ModalCases()}
      </Modal>
    </div>
  );
}

export default App;
