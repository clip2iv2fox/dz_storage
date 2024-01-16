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
import DateInput from './components/input/dataInput';
import Select from './components/select/select';

function App() {
  const [planes, setPlanes] = useState([]);
  const [flights, setFlights] = useState([]);
  const [notification, setNotification] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isCase, setCase] = useState("");
  const [id, setID] = useState("")
  const [planeData, setPlaneData] = useState({ name: "", value: ""});
  const [flightData, setFlightData] = useState({ number: "", date: "", target: "", planeId: ""});

  useEffect(() => {
    getPlanes();
    getFlights();
    if (!isOpen) {
      setNotification("")
      setPlaneData({name: "", value: "" })
      setFlightData({number: "", target: "", date: "", planeId: ""})
      setID("")
    }
  }, [isOpen]);

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

  const deletePlanes = async (idPlane) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/plane/${idPlane}`);
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

        setPlaneData({name: "", value: "" })
        setOpen(false);
      } catch (error) {
        handleErrorResponse(error);
      }
    }
  };

  const createFlights = async () => {
    if (flightData.number === "" || flightData.target === "" || flightData.date === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/flight', flightData);
        setFlights(response.data);

        setFlightData({number: "", target: "", date: "", planeId: ""})
        setOpen(false);
      } catch (error) {
        handleErrorResponse(error);
      }
    }
  }

  const redactFlight = async () => {
    if (flightData.number === "" && flightData.target === "" && flightData.date === "") {
      setNotification("Не введены изменения.");
    } else {
      try {
        const response = await axios.put(`http://localhost:5000/api/flight/${id}`, flightData);
        setFlights(response.data);

        setFlightData({number: "", target: "", date: "", planeId: ""})
        setOpen(false);
      } catch (error) {
        handleErrorResponse(error);
      }
    }
  }

  const ModalCases = () => {
    switch (isCase) {
      case "Добавить самолёт":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                Имя самолёта: <Input input={(value) => setPlaneData({ ...planeData, name: value })} placeholder={"введите имя..."} />
              </div>
              <div>
                Места: <NumInput input={(value) => setPlaneData({ ...planeData, value: value })} min={1} placeholder={"введите количество..."} />
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => createPlanes()}>подтвердить</Button>
            </div>
          </div>
        );
      case "Создать рейс":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                № рейса: <Input input={(value) => setFlightData({ ...flightData, number: value })} placeholder={"введите имя..."} />
              </div>
              <div>
                назначение: <Input input={(value) => setFlightData({ ...flightData, target: value })} placeholder={"введите место..."} />
              </div>
            </div>
            <div className="platform-bottom">
              <div>
                время вылета: <DateInput input={(value) => setFlightData({ ...flightData, date: value })} placeholder={"введите количество..."} />
              </div>
              <div>
                самолёт: <Select onSelect={(value) => setFlightData({ ...flightData, planeId: value })} options={planes} placeholder={"введите количество..."} />
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => createFlights()}>подтвердить</Button>
            </div>
          </div>
        );
      case "Редактирование рейса":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                № рейса: <Input input={(value) => setFlightData({ ...flightData, number: value })} placeholder={"введите имя..."} />
              </div>
              <div>
                назначение: <Input input={(value) => setFlightData({ ...flightData, target: value })} placeholder={"введите место..."} />
              </div>
            </div>
            <div className="platform-bottom">
              <div>
                время вылета: <DateInput input={(value) => setFlightData({ ...flightData, date: value })} placeholder={"введите количество..."} />
              </div>
              <div>
                самолёт: <Select onSelect={(value) => setFlightData({ ...flightData, planeId: value })} options={planes}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => redactFlight()}>подтвердить</Button>
            </div>
          </div>
        );
      default:
        return (<div>данного модального окна не существует</div>);
    }
  };

  function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const year = dateTime.getFullYear().toString().slice(2);
  
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }

  function truncateString(inputString, maxLength = 8) {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.slice(0, maxLength) + '...';
    }
  }

  function findPlaneName(planeId) {
    const plane = planes.find(item => item.id === planeId);
    return plane ? plane.name : null;
  }

  return (
    <div className="App">
      <Header />
      <div className='App-body'>
        <div className='sidebar'>
          {planes.map((plane) =>
            <Platform
              key={plane.id}
              id={truncateString(plane.id)}
              name={plane.name}
              value={plane.value}
              notification={notification}
              del={() => deletePlanes(plane.id)}
            />
          )}
          <Button onClick={() => (setOpen(true), setCase("Добавить самолёт"))}>+ самолёт</Button>
        </div>
        <div className='main'>
          {flights.map((flight) =>
            <Accordion
              key={flight.id}
              id={"ID: " + truncateString(flight.id)}
              title={"№ " + flight.number}
              info={
                <div className='accordion-infos'>
                  <div className='accordion-info'><div className="accordion-id">назначение:</div> {flight.target}</div>
                  <div className='accordion-info'><div className="accordion-id">время:</div> {formatDateTime(flight.date)}</div>
                  <div className='accordion-info'><div className="accordion-id">самолёт:</div> {findPlaneName(flight.planeId)}</div>
                </div>
              }
              redact={() => (
                setOpen(true),
                setCase("Редактирование рейса"),
                setID(flight.id)
              )}
            >
              hey
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
