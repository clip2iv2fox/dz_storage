import { useEffect, useState } from 'react';
import './App.css';
import Button from './components/button/button';
import Header from './components/header/header';
import Accordion from './components/accordion/accordion';
import Modal from './components/modal/modal';
import Input from './components/input/input';
import NumInput from './components/input/numInput';
import Platform from './components/platform/platform';
import Select from './components/select/select';
import { getItemsApi, createItemApi } from './configs/itemApi';
import { createReservationApi, deleteReservationApi, getReservationsApi, updateReservationApi, deleteDayApi } from './configs/reservationApi';
import { createGoodApi, deleteGoodApi, updateGoodApi } from './configs/goodApi';
import DateInput from './components/input/dataInput';

function App() {
  const [items, setItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [notification, setNotification] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isCase, setCase] = useState("");
  const [id, setID] = useState("")
  const [itemData, setItemData] = useState({ name: "", number: ""});
  const [reservationData, setReservationData] = useState({ firstName: "", secondName: "", fatherName: "", date: ""});
  const [goodData, setGoodData] = useState({name: "", number: "", reservationId: "", itemId: ""})
  const [day, setDay] = useState(0)
  const [today, setToday] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    getItems();
    getReservations();
    if (!isOpen) {
      setNotification("")
      setItemData({ name: "", number: ""})
      setReservationData({ firstName: "", secondName: "", fatherName: "", date: ""})
      setGoodData({name: "", number: "", reservationId: "", itemId: ""})
      setID("")
    }
  }, [isOpen]);

  const handleNextDay = async () => {
    try {
      setDay(day + 1);
  
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + day);
      const newToday = newDate.toISOString().slice(0, 10);
      console.log(newToday)
      setToday(newToday);
  
      await deleteDayApi(newToday);
      getItems();
      getReservations();
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const getReservations = async () => {
    try {
      const response = await getReservationsApi();
      setReservations(response);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const getItems = async () => {
    try {
      const response = await getItemsApi();
      setItems(response);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const createItems = async () => {
    if (itemData.name === "" || itemData.number === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await createItemApi(id, itemData);
        setItems(response);

        setItemData({ name: "", number: "" });
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const createReservations = async () => {
    if (reservationData.firstName === "" || reservationData.secondName === "" || reservationData.fatherName === "" || reservationData.date === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await createReservationApi({
          firstName: reservationData.firstName,
          secondName: reservationData.secondName,
          fatherName: reservationData.fatherName,
          date: reservationData.date,
        });
        setReservations(response);

        setReservationData({ firstName: "", secondName: "", fatherName: "", date: ""})
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const redactReservation = async () => {
    if (reservationData.firstName === "" || reservationData.secondName === "" || reservationData.fatherName === "" || reservationData.date === "") {
      setNotification("Не введены изменения.");
    } else {
      try {
        const response = await updateReservationApi(id, {
          firstName: reservationData.firstName,
          secondName: reservationData.secondName,
          fatherName: reservationData.fatherName,
          date: reservationData.date,
        });
        setReservations(response);

        setReservationData({ firstName: "", secondName: "", fatherName: "", date: ""})
        setID("")
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const deleteReservation = async () => {
    try {
      const response = await deleteReservationApi(id);
      setReservations(response);
      setOpen(false);
      setID("")
      setNotification("");
    } catch (error) {
      handleError(error);
    }
  }

  const createGood = async () => {
    if (goodData.name === "" || goodData.number === "") {
      console.log(goodData)
      setNotification("Введены не все данные.");
    } else {
      try {
        await createGoodApi(id, {
          name: goodData.name,
          number: goodData.number, 
          itemId: goodData.itemId,
        });
        setOpen(false);
        setGoodData({name: "", description: "", difficulty: "", time: "", reservationId: ""})
        setNotification("");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const redactGood = async () => {
      if (goodData.name === "" || goodData.number === "" || goodData.reservationId === "") {
        setNotification("Введены не все данные.");
      } else {
        try {
          await updateGoodApi(id, {
            name: goodData.name,
            number: goodData.number,
            reservationId: goodData.reservationId,
          });
          setOpen(false);
          setGoodData({name: "", number: "", reservationId: "", itemId: ""})
          setNotification("");
        } catch (error) {
          handleError(error);
        }
      }
  };

  const deleteGood = async () => {
    try {
      await deleteGoodApi(id);
      setOpen(false);
      getReservations();
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
      case "Добавление товара":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                название: <Input input={(value) => setItemData({ ...itemData, name: value })} placeholder={"введите название..."} />
              </div>
              <div>
                количество: <NumInput input={(value) => setItemData({ ...itemData, number: value })} min={1} placeholder={"введите количество..."} />
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => createItems()}>подтвердить</Button>
            </div>
          </div>
        );
      case "Создать заказ":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                Имя: <Input input={(value) => setReservationData({ ...reservationData, firstName: value })} placeholder={"введите название..."}/>
              </div>
              <div>
                Фамилия: <Input input={(value) => setReservationData({ ...reservationData, secondName: value })} placeholder={"введите название..."}/>
              </div>
              <div>
                Отчество: <Input input={(value) => setReservationData({ ...reservationData, fatherName: value })} placeholder={"введите название..."}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div>
                Дата отправки: <DateInput input={(value) => setReservationData({ ...reservationData, date: value })} min={today}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => createReservations()}>подтвердить</Button>
            </div>
          </div>
        );
      case "Редактирование заказа":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                Имя: <Input input={(value) => setReservationData({ ...reservationData, firstName: value })} placeholder={reservationData.firstName}/>
              </div>
              <div>
                Фамилия: <Input input={(value) => setReservationData({ ...reservationData, secondName: value })} placeholder={reservationData.secondName}/>
              </div>
              <div>
                Отчество: <Input input={(value) => setReservationData({ ...reservationData, fatherName: value })} placeholder={reservationData.fatherName}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div>
                Дата отправки: <DateInput input={(value) => setReservationData({ ...reservationData, date: value })} min={today}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => redactReservation()}>подтвердить</Button>
            </div>
          </div>
        );
        case "Удаление заказа":
          return (
            <div>
              <div className="platform-bottom">
                    Удаление заказа приведёт к удалению его данных (кто-то не получит игрушки).
                </div>
                <div className="platform-bottom">
                    <Button onClick={() => setOpen(false)}>отмена</Button>
                    <div className='notification'>{notification}</div>
                    <Button onClick={() => deleteReservation()} type={"danger"}>удалить</Button>
                </div>
            </div>
          );
        case "Создание позиции в заказе":
          return (
            <div>
              <div className="platform-bottom">
                <div>
                  продукт <Select onSelect={(value) => setGoodData({ ...goodData, name: value.name, itemId: value.id })} options={items}/>
                </div>
                <div>
                  количество <NumInput input={(value) => setGoodData({ ...goodData, number: value })} min={1} placeholder={"введите количество..."}/>
                </div>
              </div>
              <div className="platform-bottom">
                <div className='notification'>{notification}</div>
                <Button onClick={() => createGood()}>подтвердить</Button>
              </div>
            </div>
          );
          case "Редактирование позиции":
            return (
              <div>
                <div className="platform-bottom">
                  <div>
                    заказ <Select onSelect={(value) => setGoodData({ ...goodData, reservationId: value.id })} options={transformJsonArray(reservations)}/>
                  </div>
                  <div>
                    количество <NumInput input={(value) => setGoodData({ ...goodData, number: value })} min={1} placeholder={goodData.number}/>
                  </div>
                </div>
                <div className="platform-bottom">
                  <div className='notification'>{notification}</div>
                  <Button onClick={() => redactGood()}>подтвердить</Button>
                </div>
              </div>
            );
          case "Удаление позиции":
            return (
              <div>
                <div className="platform-bottom">
                      Вы уверены, что хотите удалить позицию?
                  </div>
                  <div className="platform-bottom">
                      <Button onClick={() => setOpen(false)}>отмена</Button>
                      <div className='notification'>{notification}</div>
                      <Button onClick={() => deleteGood()} type={"danger"}>удалить</Button>
                  </div>
              </div>
            );
      default:
        return (<div>данного модального окна не существует</div>);
    }
  };

  const transformJsonArray = (jsonArray) => {
    return jsonArray.map(({ id, firstName, secondName, fatherName, date }) => ({
        id,
        name: `${firstName} ${secondName} ${fatherName}`,
        date,
    }));
  };

  function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const year = dateTime.getFullYear().toString().slice(2);

    return `${day}.${month}.${year}`;
  }

  function truncateString(inputString, maxLength = 8) {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.slice(0, maxLength) + '...';
    }
  }

  return (
    <div className="App">
      <Header 
        name='АДМИН.СКЛАД'
        middle={
          <div>
            {formatDateTime(today)}
            <Button onClick={() => handleNextDay()}>+ день</Button>
          </div>
        }
      />
      <div className='App-body'>
        <div className='sidebar'>
          {items.map((item) =>
            <Platform
              key={item.id}
              name={item.name}
              value={item.number}
            />
          )}
          <Button onClick={() => (setOpen(true), setCase("Добавление товара"))}>+ товар</Button>
        </div>
        <div className='main'>
          {reservations.map((reservation) =>
            <Accordion
              key={reservation.id}
              header={
                <div className='accordion-right'>
                  <div className='accordion-title'>
                    {reservation.firstName + " " + reservation.secondName + " " + reservation.fatherName}
                  </div>
                  <div className="accordion-id">{"ID: " + truncateString(reservation.id)}</div>
                  <div className='accordion-infos'>
                    <div className='accordion-info'><div className="accordion-id">время отправки:</div> {formatDateTime(reservation.date)}</div>
                  </div>
                </div>
              }
              footer={
                <div className="accordion-bottom">
                  <div>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Редактирование заказа"),
                      setReservationData({ ...reservationData, 
                        firstName: reservation.firstName,
                        secondName: reservation.secondName,
                        fatherName: reservation.fatherName,
                        date: reservation.date
                      }),
                      setID(reservation.id)
                    )} type={"default"}>
                      редактировать заказ
                    </Button>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Создание позиции в заказе"),
                      setGoodData({ ...goodData, reservationId: reservation.id }),
                      setID(reservation.id)
                    )}>+ позиция в заказе</Button>
                  </div>
                  <Button onClick={() => (
                    setOpen(true),
                    setCase("Удаление заказа"),
                    setID(reservation.id)
                  )} type={"danger"}>
                    <i className="fa fa-remove"></i>
                  </Button>
                </div>
              }
            >
              <div className='accordion-body'>
                {
                  !reservation || !reservation.goods || reservation.goods.length === 0 ? (
                    <div className='no-accordions'>ПОЗИЦИЙ НЕТ</div>
                  ) : (
                    <table className='accordion-table'>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Название</th>
                          <th>Количество</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservation.goods.map((good) => (
                          <tr key={good.id}>
                            <td><div className="accordion-id">{truncateString(good.id)}</div></td>
                            <td>{good.name}</td>
                            <td>{good.number}</td>
                            <td className='buttons'>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Редактирование позиции"),
                                setID(good.id),
                                setGoodData({ ...goodData, 
                                  name: good.name,
                                  number: good.number,
                                  reservationId: good.reservationId,
                                  itemId: good.itemId
                                })
                              )}>
                                <i className="fa fa-edit"></i>
                              </Button>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Удаление позиции"),
                                setID(good.id)
                              )} type={"danger"}>
                                <i className="fa fa-remove"></i>
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
          <div className='app-button'>
            <Button onClick={() => (
              setOpen(true),
              setCase("Создать заказ"),
              setReservationData({ firstName: "", secondName: "", fatherName: "", date: ""})
            )} type={"danger"}>+ заказ</Button>
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