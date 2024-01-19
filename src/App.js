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
import { getPlanesApi, deletePlaneApi, createPlaneApi } from './configs/planeApi';
import { createFlightApi, deleteFlightApi, getFlightsApi, updateFlightApi } from './configs/flightApi';
import { createBookingApi, deleteBookingApi, updateBookingApi } from './configs/bookingApi';

function App() {
  const [planes, setPlanes] = useState([]);
  const [flights, setFlights] = useState([]);
  const [notification, setNotification] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isCase, setCase] = useState("");
  const [id, setID] = useState("")
  const [planeData, setPlaneData] = useState({ name: "", value: ""});
  const [flightData, setFlightData] = useState({ name: "", date: "", target: "", planeId: ""});
  const [bookingData, setBookingData] = useState({name: "", surname: "", fatherName: "", flightId: ""})

  useEffect(() => {
    getPlanes();
    getFlights();
    if (!isOpen) {
      setNotification("")
      setPlaneData({name: "", value: "" })
      setFlightData({name: "", target: "", date: "", planeId: ""})
      setBookingData({name: "", surname: "", fatherName: "", flightId: ""})
      setID("")
    }
  }, [isOpen]);


  const getFlights = async () => {
    try {
      const response = await getFlightsApi();
      setFlights(response);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const getPlanes = async () => {
    try {
      const response = await getPlanesApi();
      setPlanes(response);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const deletePlanes = async (idPlane) => {
    try {
      const response = await deletePlaneApi(idPlane);
      setPlanes(response);
      setOpen(false);
      getFlights();
      setNotification("");
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const createPlanes = async () => {
    if (planeData.name === "" || planeData.value === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await createPlaneApi(planeData);
        setPlanes(response);

        setPlaneData({ name: "", value: "" });
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const createFlights = async () => {
    if (flightData.name === "" || flightData.target === "" || flightData.date === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await createFlightApi(flightData);
        setFlights(response);

        setFlightData({name: "", target: "", date: "", planeId: ""})
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const redactFlight = async () => {
    if (flightData.name === "" && flightData.target === "" && flightData.date === "" && flightData.planeId === "") {
      setNotification("Не введены изменения.");
    } else {
      try {
        const response = await updateFlightApi(id, flightData);
        setFlights(response);

        setFlightData({name: "", target: "", date: "", planeId: ""})
        setID("")
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const deleteFlight = async () => {
    try {
      const response = await deleteFlightApi(id);
      setFlights(response);
      setOpen(false);
      setID("")
      setNotification("");
    } catch (error) {
      handleError(error);
    }
  }

  const createBooking = async () => {
    if (bookingData.name === "" || bookingData.surname === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        await createBookingApi(id, {name: bookingData.name + " " + bookingData.surname + " " + bookingData.fatherName});
        setOpen(false);
        setBookingData({name: "", surname: "", fatherName: "", flightId: ""})
        setNotification("");
      } catch (error) {
        handleError(error);
      }
    }
  }

  const redactBooking = async () => {
    if (bookingData.surname === "" && bookingData.flightId === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        await updateBookingApi(id, {name: bookingData.surname || bookingData.name, flightId: bookingData.flightId});
        setOpen(false);
        setBookingData({name: "", surname: "", fatherName: "", flightId: ""})
        setNotification("");
      } catch (error) {
        handleError(error);
      }
    }
  }

  const deleteBooking = async () => {
    try {
      await deleteBookingApi(id);
      setOpen(false);
      getFlights();
      setNotification("");
    } catch (error) {
      handleError(error);
    }
  }

  const handleError = (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      setNotification(error.response.data.error);
    } else {
      setNotification('Ошибка сервера');
    }
};

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
                № рейса: <Input input={(value) => setFlightData({ ...flightData, name: value })} placeholder={"введите имя..."} />
              </div>
              <div>
                назначение: <Input input={(value) => setFlightData({ ...flightData, target: value })} placeholder={"введите назначение..."} />
              </div>
            </div>
            <div className="platform-bottom">
              <div>
                время вылета: <DateInput input={(value) => setFlightData({ ...flightData, date: value })}/>
              </div>
              <div>
                самолёт: <Select onSelect={(value) => setFlightData({ ...flightData, planeId: value })} options={planes}/>
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
                № рейса: <Input input={(value) => setFlightData({ ...flightData, name: value })} placeholder={"введите имя..."} />
              </div>
              <div>
                назначение: <Input input={(value) => setFlightData({ ...flightData, target: value })} placeholder={"введите назначение..."} />
              </div>
            </div>
            <div className="platform-bottom">
              <div>
                время вылета: <DateInput input={(value) => setFlightData({ ...flightData, date: value })}/>
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
        case "Удаление рейса":
          return (
            <div>
              <div className="platform-bottom">
                    Удаление рейса приведёт к удалению его данных и броней.
                </div>
                <div className="platform-bottom">
                    <Button onClick={() => setOpen(false)}>отмена</Button>
                    <div className='notification'>{notification}</div>
                    <Button onClick={() => deleteFlight()} type={"danger"}>удалить</Button>
                </div>
            </div>
          );
        case "Создание брони":
          return (
            <div>
              <div className="platform-bottom">
                <div>
                  Имя <Input input={(value) => setBookingData({ ...bookingData, name: value })} placeholder={"имя..."} />
                </div>
                <div>
                  Фамилия <Input input={(value) => setBookingData({ ...bookingData, surname: value })} placeholder={"фамилия..."} />
                </div>
                <div>
                  Отчество <Input input={(value) => setBookingData({ ...bookingData, fatherName: value })} placeholder={"отчество (опциально)..."} />
                </div>
              </div>
              <div className="platform-bottom">
                <div className='notification'>{notification}</div>
                <Button onClick={() => createBooking()}>подтвердить</Button>
              </div>
            </div>
          );
          case "Редактирование брони":
            return (
              <div>
                <div className="platform-bottom">
                  <div>
                    ФИО <Input input={(value) => setBookingData({ ...bookingData, surname: value })} placeholder={bookingData.name} />
                  </div>
                  <div>
                    Рейс <Select onSelect={(value) => setBookingData({ ...bookingData, flightId: value })} options={flights}/>
                  </div>
                  <div className='notification'>{notification}</div>
                  <Button onClick={() => redactBooking()}>подтвердить</Button>
                </div>
              </div>
            );
          case "Удаление брони":
            return (
              <div>
                <div className="platform-bottom">
                      Вы уверены, что хотите удалить бронь, ведь кто-то может не улетит на море?(((
                  </div>
                  <div className="platform-bottom">
                      <Button onClick={() => setOpen(false)}>отмена</Button>
                      <div className='notification'>{notification}</div>
                      <Button onClick={() => deleteBooking()} type={"danger"}>удалить</Button>
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
              header={
                <div className='accordion-right'>
                  <div className='accordion-title'>
                    {"№ " + flight.name}
                  </div>
                  <div className="accordion-id">{"ID: " + truncateString(flight.id)}</div>
                  <div className='accordion-infos'>
                    <div className='accordion-info'><div className="accordion-id">время:</div> {formatDateTime(flight.date)}</div>
                    <div className='accordion-info'><div className="accordion-id">назначение:</div> {flight.target}</div>
                    <div className='accordion-info'><div className="accordion-id">самолёт:</div> {findPlaneName(flight.planeId)}</div>
                  </div>
                </div>
              }
              footer={
                <div className="accordion-bottom">
                  <div>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Редактирование рейса"),
                      setID(flight.id)
                    )} type={"default"}>
                      редактировать рейс
                    </Button>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Создание брони"),
                      setID(flight.id)
                    )}>+ бронь</Button>
                  </div>
                  <Button onClick={() => (
                    setOpen(true),
                    setCase("Удаление рейса"),
                    setID(flight.id)
                  )} type={"danger"}>
                    <i className="fa fa-remove" style={{color: "white", fontSize: "25px"}}></i>
                  </Button>
                </div>
              }
            >
              <div className='accordion-body'>
                {
                  !flight || !flight.bookings || flight.bookings.length === 0 ? (
                    <div className='no-accordions'>БРОНЕЙ НЕТ</div>
                  ) : (
                    <table className='accordion-table'>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>ФИО</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {flight.bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td><div className="accordion-id">{truncateString(booking.id)}</div></td>
                            <td>{booking.name}</td>
                            <td className='buttons'>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Редактирование брони"),
                                setID(booking.id),
                                setBookingData({ ...bookingData, name: booking.name })
                              )}>
                                <i className="fa fa-edit" style={{color: "white"}}></i>
                              </Button>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Удаление брони"),
                                setID(booking.id),
                                setBookingData({ ...bookingData, name: booking.name })
                              )} type={"danger"}>
                                <i className="fa fa-remove" style={{color: "white"}}></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>
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
