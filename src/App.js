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
import { getItemsApi, deleteItemApi, createItemApi, updateItemApi } from './configs/itemApi';
import { createOrderApi, deleteOrderApi, getOrdersApi, updateOrderApi, deleteDayApi } from './configs/orderApi';
import { createProductApi, deleteProductApi, updateProductApi } from './configs/productApi';

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
    if (orderData.name === "" || orderData.description === "" || orderData.difficulty === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await createOrderApi({
          name: orderData.name,
          description: orderData.description,
          difficulty: orderData.difficulty
        });
        setOrders(response);

        setOrderData({name: "", description: "", difficulty: "", time: ""})
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const redactOrder = async () => {
    if (orderData.name === "" && orderData.description === "" && orderData.difficulty === "") {
      setNotification("Не введены изменения.");
    } else {
      try {
        const response = await updateOrderApi(id, {
          name: orderData.name, 
          description: orderData.description, 
          difficulty: orderData.difficulty,
        });
        setOrders(response);

        setOrderData({name: "", description: "", difficulty: "", time: ""})
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
    if (productData.name === "" || productData.time === "" || productData.description === "") {
      console.log(productData)
      setNotification("Введены не все данные.");
    } else {
      try {
        await createProductApi(productData.orderId, {
          name: productData.name,
          description: productData.description, 
          difficulty: productData.difficulty,
          time: productData.time
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
      if (productData.name === "" && productData.description === "" && productData.time === "" && productData.orderId === "") {
        setNotification("Введены не все данные.");
      } else {
        try {
          await updateProductApi(id, {
            name: productData.name,
            description: productData.description,
            difficulty: productData.difficulty,
            time: productData.time,
            orderId: productData.orderId
          });
          setOpen(false);
          setProductData({name: "", description: "", difficulty: "", time: "", orderId: ""})
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
      case "Создать тренировку":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                название: <Input input={(value) => setOrderData({ ...orderData, name: value })} placeholder={"введите название..."}/>
              </div>
              <div>
                max сложность: <NumInput input={(value) => setOrderData({ ...orderData, difficulty: value })} min={1} placeholder={"введите max сложность..."}/>
              </div>
            </div>
            <div className="platform-bottom">
              описание: <Input input={(value) => setOrderData({ ...orderData, description: value })} className={"description"} placeholder={"введите описание..."} />
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => createOrders()}>подтвердить</Button>
            </div>
          </div>
        );
      case "Редактирование тренировки":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                название: <Input input={(value) => setOrderData({ ...orderData, name: value })} placeholder={"введите название..."}/>
              </div>
              <div>
                max сложность: <NumInput input={(value) => setOrderData({ ...orderData, difficulty: value })} min={1} placeholder={"введите max сложность..."}/>
              </div>
            </div>
            <div className="platform-bottom">
              описание: <Input input={(value) => setOrderData({ ...orderData, description: value })} className={"description"} placeholder={"введите описание..."} />
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => redactOrder()}>подтвердить</Button>
            </div>
          </div>
        );
        case "Удаление тренировки":
          return (
            <div>
              <div className="platform-bottom">
                    Удаление тренировки приведёт к удалению его данных и упражнений.
                </div>
                <div className="platform-bottom">
                    <Button onClick={() => setOpen(false)}>отмена</Button>
                    <div className='notification'>{notification}</div>
                    <Button onClick={() => deleteOrder()} type={"danger"}>удалить</Button>
                </div>
            </div>
          );
        case "Создание упражнения":
          return (
            <div>
              <div className="platform-bottom">
                <div>
                  тип <Select onSelect={(value) => setProductData({ ...productData, name: value.name, difficulty: value.difficulty })} options={items}/>
                </div>
                <div>
                  время (мин.) <NumInput input={(value) => setProductData({ ...productData, time: value })} min={1} placeholder={"введите время..."}/>
                </div>
              </div>
              <div className="platform-bottom">
                описание <Input input={(value) => setProductData({ ...productData, description: value })} className={"description"} placeholder={"введите описание..."} />
              </div>
              <div className="platform-bottom">
                <div className='notification'>{notification}</div>
                <Button onClick={() => createProduct()}>подтвердить</Button>
              </div>
            </div>
          );
          case "Редактирование упражнения":
            return (
              <div>
                <div className="platform-bottom">
                  <div>
                    тип <Select onSelect={(value) => setProductData({ ...productData, name: value.name, difficulty: value.difficulty })} options={items}/>
                  </div>
                  <div>
                    тренировка <Select onSelect={(value) => setProductData({ ...productData, OrderId: value.id })} options={orders}/>
                  </div>
                  <div>
                    время (мин.) <NumInput input={(value) => setOrderData({ ...orderData, time: value })} min={1} placeholder={"введите время..."}/>
                  </div>
                </div>
                <div className="platform-bottom">
                  описание <Input input={(value) => setProductData({ ...productData, description: value })} className={"description"} placeholder={"введите описание..."} />
                </div>
                <div className="platform-bottom">
                  <div className='notification'>{notification}</div>
                  <Button onClick={() => redactProduct()}>подтвердить</Button>
                </div>
              </div>
            );
          case "Удаление упражнения":
            return (
              <div>
                <div className="platform-bottom">
                      Вы уверены, что хотите удалить упражнение?
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

  function formatMinutes(minutes) {
    if (isNaN(minutes) || minutes < 0) {
      return 'Invalid input';
    }
  
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    const hoursString = hours > 0 ? `${hours} ч.` : '';
    const minutesString = remainingMinutes > 0 ? `${remainingMinutes} мин.` : '0 мин.';
  
    if (hours > 0 && remainingMinutes > 0) {
      return `${hoursString} ${minutesString}`;
    } else {
      return hoursString + minutesString;
    }
  }

  function truncateString(inputString, maxLength = 8) {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.slice(0, maxLength) + '...';
    }
  }

  function findDifficulty(name) {
    const item = items.find(item => item.name === name);
    return item ? item.difficulty : null;
  }

  return (
    <div className="App">
      <Header 
        name='STORAGE'
        middle={'time'}
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
                    {order.name}
                    <div className="accordion-id">{"ID: " + truncateString(order.id)}</div>
                  </div>
                  <div className="accordion-id">Описание: {order.description}</div>
                  <div className='accordion-infos'>
                    <div className='accordion-info'><div className="accordion-id">сложность:</div> {order.difficulty}</div>
                    <div className='accordion-info'><div className="accordion-id">время:</div> {formatMinutes(parseInt(order.time))}</div>
                  </div>
                </div>
              }
              footer={
                <div className="accordion-bottom">
                  <div>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Редактирование тренировки"),
                      setOrderData({ ...orderData, 
                        name: order.name,
                        description: order.description,
                        difficulty: order.difficulty,
                        time: order.time
                      }),
                      setID(order.id)
                    )} type={"default"}>
                      редактировать тренировку
                    </Button>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Создание упражнения"),
                      setProductData({ ...productData, orderId: order.id }),
                      setID(order.id)
                    )}>+ упражнение</Button>
                  </div>
                  <Button onClick={() => (
                    setOpen(true),
                    setCase("Удаление тренировки"),
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
                    <div className='no-accordions'>УПРАЖНЕНИЙ НЕТ</div>
                  ) : (
                    <table className='accordion-table'>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Название</th>
                          <th>Описание</th>
                          <th>Сложность</th>
                          <th>Время</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((product) => (
                          <tr key={product.id}>
                            <td><div className="accordion-id">{truncateString(product.id)}</div></td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{findDifficulty(product.name)}</td>
                            <td>{formatMinutes(parseInt(product.time))}</td>
                            <td className='buttons'>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Редактирование упражнения"),
                                setID(product.id),
                                setProductData({ ...productData, 
                                  name: product.name, 
                                  description: product.description, 
                                  difficulty: product.difficulty, 
                                  time: product.time, 
                                  orderId: product.orderId})
                              )}>
                                <i className="fa fa-edit"></i>
                              </Button>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Удаление упражнения"),
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
            <Button onClick={() => (setOpen(true), setCase("Создать тренировку"))} type={"danger"}>+ заказ</Button>
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