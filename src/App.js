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
import { createOrderApi, deleteOrderApi, getOrdersApi, updateOrderApi, deleteDayApi } from './configs/orderApi';
import { createProductApi, deleteProductApi, updateProductApi } from './configs/productApi';
import DateInput from './components/input/dataInput';

function App() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isCase, setCase] = useState("");
  const [id, setID] = useState("")
  const [itemData, setItemData] = useState({ name: "", number: ""});
  const [orderData, setOrderData] = useState({ firstName: "", secondName: "", fatherName: "", date: ""});
  const [productData, setProductData] = useState({name: "", number: "", orderId: "", itemId: ""})
  const [day, setDay] = useState(0)
  const [today, setToday] = useState(new Date().toISOString().slice(0, 16))

  useEffect(() => {
    getItems();
    getOrders();
    if (!isOpen) {
      setNotification("")
      setItemData({ name: "", number: ""})
      setOrderData({ firstName: "", secondName: "", fatherName: "", date: ""})
      setProductData({name: "", number: "", orderId: "", itemId: ""})
      setID("")
    }
  }, [isOpen]);

  const handleNextDay = async () => {
    try {
      setDay(day + 1);
  
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + day);
      const newToday = newDate.toISOString().slice(0, 16);
      setToday(newToday);
  
      await deleteDayApi(newToday);
      getItems();
      getOrders();
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const getOrders = async () => {
    try {
      const response = await getOrdersApi();
      setOrders(response);
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

  const createOrders = async () => {
    if (orderData.firstName === "" || orderData.secondName === "" || orderData.fatherName === "" || orderData.date === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await createOrderApi({
          firstName: orderData.firstName,
          secondName: orderData.secondName,
          fatherName: orderData.fatherName,
          date: orderData.date,
        });
        setOrders(response);

        setOrderData({ firstName: "", secondName: "", fatherName: "", date: ""})
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const redactOrder = async () => {
    if (orderData.firstName === "" || orderData.secondName === "" || orderData.fatherName === "" || orderData.date === "") {
      setNotification("Не введены изменения.");
    } else {
      try {
        const response = await updateOrderApi(id, {
          firstName: orderData.firstName,
          secondName: orderData.secondName,
          fatherName: orderData.fatherName,
          date: orderData.date,
        });
        setOrders(response);

        setOrderData({ firstName: "", secondName: "", fatherName: "", date: ""})
        setID("")
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const deleteOrder = async () => {
    try {
      const response = await deleteOrderApi(id);
      setOrders(response);
      setOpen(false);
      setID("")
      setNotification("");
    } catch (error) {
      handleError(error);
    }
  }

  const createProduct = async () => {
    if (productData.name === "" || productData.number === "") {
      console.log(productData)
      setNotification("Введены не все данные.");
    } else {
      try {
        await createProductApi(id, {
          name: productData.name,
          number: productData.number, 
          itemId: productData.itemId,
        });
        setOpen(false);
        setProductData({name: "", description: "", difficulty: "", time: "", orderId: ""})
        setNotification("");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const redactProduct = async () => {
      if (productData.name === "" || productData.number === "" || productData.orderId === "") {
        setNotification("Введены не все данные.");
      } else {
        try {
          await updateProductApi(id, {
            name: productData.name,
            number: productData.number,
            orderId: productData.orderId,
          });
          setOpen(false);
          setProductData({name: "", number: "", orderId: "", itemId: ""})
          setNotification("");
        } catch (error) {
          handleError(error);
        }
      }
  };

  const deleteProduct = async () => {
    try {
      await deleteProductApi(id);
      setOpen(false);
      getOrders();
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
                Имя: <Input input={(value) => setOrderData({ ...orderData, firstName: value })} placeholder={"введите название..."}/>
              </div>
              <div>
                Фамилия: <Input input={(value) => setOrderData({ ...orderData, secondName: value })} placeholder={"введите название..."}/>
              </div>
              <div>
                Отчество: <Input input={(value) => setOrderData({ ...orderData, fatherName: value })} placeholder={"введите название..."}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div>
                Дата отправки: <DateInput input={(value) => setOrderData({ ...orderData, date: value })}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => createOrders()}>подтвердить</Button>
            </div>
          </div>
        );
      case "Редактирование заказа":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                Имя: <Input input={(value) => setOrderData({ ...orderData, firstName: value })} placeholder={orderData.firstName}/>
              </div>
              <div>
                Фамилия: <Input input={(value) => setOrderData({ ...orderData, secondName: value })} placeholder={orderData.secondName}/>
              </div>
              <div>
                Отчество: <Input input={(value) => setOrderData({ ...orderData, fatherName: value })} placeholder={orderData.fatherName}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div>
                Дата отправки: <DateInput input={(value) => setOrderData({ ...orderData, date: value })}/>
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => redactOrder()}>подтвердить</Button>
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
                    <Button onClick={() => deleteOrder()} type={"danger"}>удалить</Button>
                </div>
            </div>
          );
        case "Создание позиции в заказе":
          return (
            <div>
              <div className="platform-bottom">
                <div>
                  продукт <Select onSelect={(value) => setProductData({ ...productData, name: value.name, itemId: value.id })} options={items}/>
                </div>
                <div>
                  количество <NumInput input={(value) => setProductData({ ...productData, number: value })} min={1} placeholder={"введите количество..."}/>
                </div>
              </div>
              <div className="platform-bottom">
                <div className='notification'>{notification}</div>
                <Button onClick={() => createProduct()}>подтвердить</Button>
              </div>
            </div>
          );
          case "Редактирование позиции":
            return (
              <div>
                <div className="platform-bottom">
                  <div>
                    заказ <Select onSelect={(value) => setProductData({ ...productData, orderId: value.id })} options={transformJsonArray(orders)}/>
                  </div>
                  <div>
                    количество <NumInput input={(value) => setProductData({ ...productData, number: value })} min={1} placeholder={productData.number}/>
                  </div>
                </div>
                <div className="platform-bottom">
                  <div className='notification'>{notification}</div>
                  <Button onClick={() => redactProduct()}>подтвердить</Button>
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
                      <Button onClick={() => deleteProduct()} type={"danger"}>удалить</Button>
                  </div>
              </div>
            );
      default:
        return (<div>данного модального окна не существует</div>);
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
        name='STORAGE'
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
          {orders.map((order) =>
            <Accordion
              key={order.id}
              header={
                <div className='accordion-right'>
                  <div className='accordion-title'>
                    {order.firstName + " " + order.secondName + " " + order.fatherName}
                  </div>
                  <div className="accordion-id">{"ID: " + truncateString(order.id)}</div>
                  <div className='accordion-infos'>
                    <div className='accordion-info'><div className="accordion-id">время отправки:</div> {formatDateTime(order.date)}</div>
                  </div>
                </div>
              }
              footer={
                <div className="accordion-bottom">
                  <div>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Редактирование заказа"),
                      setOrderData({ ...orderData, 
                        firstName: order.firstName,
                        secondName: order.secondName,
                        fatherName: order.fatherName,
                        date: order.date
                      }),
                      setID(order.id)
                    )} type={"default"}>
                      редактировать заказ
                    </Button>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Создание позиции в заказе"),
                      setProductData({ ...productData, orderId: order.id }),
                      setID(order.id)
                    )}>+ позиция в заказе</Button>
                  </div>
                  <Button onClick={() => (
                    setOpen(true),
                    setCase("Удаление заказа"),
                    setID(order.id)
                  )} type={"danger"}>
                    <i className="fa fa-remove"></i>
                  </Button>
                </div>
              }
            >
              <div className='accordion-body'>
                {
                  !order || !order.products || order.products.length === 0 ? (
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
                        {order.products.map((product) => (
                          <tr key={product.id}>
                            <td><div className="accordion-id">{truncateString(product.id)}</div></td>
                            <td>{product.name}</td>
                            <td>{product.number}</td>
                            <td className='buttons'>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Редактирование позиции"),
                                setID(product.id),
                                setProductData({ ...productData, 
                                  name: product.name,
                                  number: product.number,
                                  orderId: product.orderId,
                                  itemId: product.itemId
                                })
                              )}>
                                <i className="fa fa-edit"></i>
                              </Button>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Удаление позиции"),
                                setID(product.id)
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
              setOrderData({ firstName: "", secondName: "", fatherName: "", date: ""})
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