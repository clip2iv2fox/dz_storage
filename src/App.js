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
import { getExercizesApi, deleteExercizeApi, createExercizeApi } from './configs/exercizeApi';
import { createWorkoutApi, deleteWorkoutApi, getWorkoutsApi, updateWorkoutApi } from './configs/workoutApi';
import { createPracticeApi, deletePracticeApi, updatePracticeApi } from './configs/practiceApi';

function App() {
  const [exercizes, setExercizes] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [notification, setNotification] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isCase, setCase] = useState("");
  const [id, setID] = useState("")
  const [exercizeData, setExercizeData] = useState({ name: "", difficulty: ""});
  const [workoutData, setWorkoutData] = useState({ name: "", description: "", difficulty: "", time: ""});
  const [practiceData, setPracticeData] = useState({name: "", description: "", difficulty: "", time: "", workoutId: ""})

  useEffect(() => {
    getExercizes();
    getWorkouts();
    if (!isOpen) {
      setNotification("")
      setExercizeData({ name: "", difficulty: ""})
      setWorkoutData({ name: "", description: "", difficulty: "", time: ""})
      setPracticeData({name: "", description: "", difficulty: "", time: "", workoutId: ""})
      setID("")
    }
  }, [isOpen]);


  const getWorkouts = async () => {
    try {
      const response = await getWorkoutsApi();
      setWorkouts(response);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const getExercizes = async () => {
    try {
      const response = await getExercizesApi();
      setExercizes(response);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const deleteExercizes = async (idExercize) => {
    try {
      const response = await deleteExercizeApi(idExercize);
      setExercizes(response);
      setOpen(false);
      getWorkouts();
      setNotification("");
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const createExercizes = async () => {
    if (exercizeData.name === "" || exercizeData.difficulty === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await createExercizeApi(exercizeData);
        setExercizes(response);

        setExercizeData({ name: "", difficulty: "" });
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const createWorkouts = async () => {
    if (workoutData.name === "" || workoutData.description === "" || workoutData.difficulty === "") {
      setNotification("Введены не все данные.");
    } else {
      try {
        const response = await createWorkoutApi({
          name: workoutData.name,
          description: workoutData.description,
          difficulty: workoutData.difficulty
        });
        setWorkouts(response);

        setWorkoutData({name: "", description: "", difficulty: "", time: ""})
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const redactWorkout = async () => {
    if (workoutData.name === "" && workoutData.description === "" && workoutData.difficulty === "") {
      setNotification("Не введены изменения.");
    } else {
      try {
        const response = await updateWorkoutApi(id, {
          name: workoutData.name, 
          description: workoutData.description, 
          difficulty: workoutData.difficulty,
        });
        setWorkouts(response);

        setWorkoutData({name: "", description: "", difficulty: "", time: ""})
        setID("")
        setOpen(false);
      } catch (error) {
        handleError(error);
      }
    }
  }

  const deleteWorkout = async () => {
    try {
      const response = await deleteWorkoutApi(id);
      setWorkouts(response);
      setOpen(false);
      setID("")
      setNotification("");
    } catch (error) {
      handleError(error);
    }
  }

  const createPractice = async () => {
    if (practiceData.name === "" || practiceData.time === "" || practiceData.description === "") {
      console.log(practiceData)
      setNotification("Введены не все данные.");
    } else {
      try {
        await createPracticeApi(practiceData.workoutId, {
          name: practiceData.name,
          description: practiceData.description, 
          difficulty: practiceData.difficulty,
          time: practiceData.time
        });
        setOpen(false);
        setPracticeData({name: "", description: "", difficulty: "", time: "", workoutId: ""})
        setNotification("");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const redactPractice = async () => {
      if (practiceData.name === "" && practiceData.description === "" && practiceData.time === "" && practiceData.workoutId === "") {
        setNotification("Введены не все данные.");
      } else {
        try {
          await updatePracticeApi(id, {
            name: practiceData.name,
            description: practiceData.description,
            difficulty: practiceData.difficulty,
            time: practiceData.time,
            workoutId: practiceData.workoutId
          });
          setOpen(false);
          setPracticeData({name: "", description: "", difficulty: "", time: "", workoutId: ""})
          setNotification("");
        } catch (error) {
          handleError(error);
        }
      }
  };

  const deletePractice = async () => {
    try {
      await deletePracticeApi(id);
      setOpen(false);
      getWorkouts();
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
      case "Добавить тип тренировки":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                Имя: <Input input={(value) => setExercizeData({ ...exercizeData, name: value })} placeholder={"введите название..."} />
              </div>
              <div>
                Сложность: <NumInput input={(value) => setExercizeData({ ...exercizeData, difficulty: value })} min={1} placeholder={"введите сложность..."} />
              </div>
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => createExercizes()}>подтвердить</Button>
            </div>
          </div>
        );
      case "Создать тренировку":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                название: <Input input={(value) => setWorkoutData({ ...workoutData, name: value })} placeholder={"введите название..."}/>
              </div>
              <div>
                max сложность: <NumInput input={(value) => setWorkoutData({ ...workoutData, difficulty: value })} min={1} placeholder={"введите max сложность..."}/>
              </div>
            </div>
            <div className="platform-bottom">
              описание: <Input input={(value) => setWorkoutData({ ...workoutData, description: value })} placeholder={"введите описание..."} />
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => createWorkouts()}>подтвердить</Button>
            </div>
          </div>
        );
      case "Редактирование тренировки":
        return (
          <div>
            <div className="platform-bottom">
              <div>
                название: <Input input={(value) => setWorkoutData({ ...workoutData, name: value })} placeholder={"введите название..."}/>
              </div>
              <div>
                max сложность: <NumInput input={(value) => setWorkoutData({ ...workoutData, difficulty: value })} min={1} placeholder={"введите max сложность..."}/>
              </div>
            </div>
            <div className="platform-bottom">
              описание: <Input input={(value) => setWorkoutData({ ...workoutData, description: value })} placeholder={"введите описание..."} />
            </div>
            <div className="platform-bottom">
              <div className='notification'>{notification}</div>
              <Button onClick={() => redactWorkout()}>подтвердить</Button>
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
                    <Button onClick={() => deleteWorkout()} type={"danger"}>удалить</Button>
                </div>
            </div>
          );
        case "Создание упражнения":
          return (
            <div>
              <div className="platform-bottom">
                <div>
                  тип <Select onSelect={(value) => setPracticeData({ ...practiceData, name: value.name, difficulty: value.difficulty })} options={exercizes}/>
                </div>
                <div>
                  время (мин.) <NumInput input={(value) => setPracticeData({ ...practiceData, time: value })} min={1} placeholder={"введите время..."}/>
                </div>
              </div>
              <div className="platform-bottom">
                описание <Input input={(value) => setPracticeData({ ...practiceData, description: value })} placeholder={"введите описание..."} />
              </div>
              <div className="platform-bottom">
                <div className='notification'>{notification}</div>
                <Button onClick={() => createPractice()}>подтвердить</Button>
              </div>
            </div>
          );
          case "Редактирование упражнения":
            return (
              <div>
                <div className="platform-bottom">
                  <div>
                    тип <Select onSelect={(value) => setPracticeData({ ...practiceData, name: value.name, difficulty: value.difficulty })} options={exercizes}/>
                  </div>
                  <div>
                    тренировка <Select onSelect={(value) => setPracticeData({ ...practiceData, workoutId: value.id })} options={workouts}/>
                  </div>
                  <div>
                    время (мин.) <NumInput input={(value) => setWorkoutData({ ...practiceData, time: value })} min={1} placeholder={"введите время..."}/>
                  </div>
                </div>
                <div className="platform-bottom">
                  описание <Input input={(value) => setPracticeData({ ...practiceData, description: value })} placeholder={"введите описание..."} />
                </div>
                <div className="platform-bottom">
                  <div className='notification'>{notification}</div>
                  <Button onClick={() => redactPractice()}>подтвердить</Button>
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
                      <Button onClick={() => deletePractice()} type={"danger"}>удалить</Button>
                  </div>
              </div>
            );
      default:
        return (<div>данного модального окна не существует</div>);
    }
  };

  function truncateString(inputString, maxLength = 8) {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.slice(0, maxLength) + '...';
    }
  }

  function findDifficulty(name) {
    const Exercize = exercizes.find(item => item.name === name);
    return Exercize ? Exercize.difficulty : null;
  }

  return (
    <div className="App">
      <Header />
      <div className='App-body'>
        <div className='sidebar'>
          {exercizes.map((exercize) =>
            <Platform
              key={exercize.id}
              id={truncateString(exercize.id)}
              name={exercize.name}
              value={exercize.difficulty}
              notification={notification}
              del={() => deleteExercizes(exercize.id)}
            />
          )}
          <Button onClick={() => (setOpen(true), setCase("Добавить тип тренировки"))}>+ тип</Button>
        </div>
        <div className='main'>
          {workouts.map((workout) =>
            <Accordion
              key={workout.id}
              header={
                <div className='accordion-right'>
                  <div className='accordion-title'>
                    {workout.name}
                  </div>
                  <div className="accordion-id">{"ID: " + truncateString(workout.id)}</div>
                  <div className='accordion-infos'>
                    <div className='accordion-info'><div className="accordion-id">сложность:</div> {workout.difficulty}</div>
                    <div className='accordion-info'><div className="accordion-id">время:</div> {workout.time}</div>
                  </div>
                </div>
              }
              footer={
                <div className="accordion-bottom">
                  <div>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Редактирование тренировки"),
                      setWorkoutData({ ...workoutData, 
                        name: workout.name,
                        description: workout.description,
                        difficulty: workout.difficulty,
                        time: workout.time
                      }),
                      setID(workout.id)
                    )} type={"default"}>
                      редактировать тренировку
                    </Button>
                    <Button onClick={() => (
                      setOpen(true),
                      setCase("Создание упражнения"),
                      setPracticeData({ ...practiceData, workoutId: workout.id }),
                      setID(workout.id)
                    )}>+ упражнение</Button>
                  </div>
                  <Button onClick={() => (
                    setOpen(true),
                    setCase("Удаление тренировки"),
                    setID(workout.id)
                  )} type={"danger"}>
                    <i className="fa fa-remove" style={{color: "white", fontSize: "25px"}}></i>
                  </Button>
                </div>
              }
            >
              <div className='accordion-body'>
                {
                  !workout || !workout.practices || workout.practices.length === 0 ? (
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
                        {workout.practices.map((practice) => (
                          <tr key={practice.id}>
                            <td><div className="accordion-id">{truncateString(practice.id)}</div></td>
                            <td>{practice.name}</td>
                            <td>{practice.description}</td>
                            <td>{findDifficulty(practice.name)}</td>
                            <td>{practice.time}</td>
                            <td className='buttons'>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Редактирование упражнения"),
                                setID(practice.id),
                                setPracticeData({ ...practiceData, 
                                  name: practice.name, 
                                  description: practice.description, 
                                  difficulty: practice.difficulty, 
                                  time: practice.time, 
                                  workoutId: practice.workoutId})
                              )}>
                                <i className="fa fa-edit" style={{color: "white"}}></i>
                              </Button>
                              <Button onClick={() => (
                                setOpen(true),
                                setCase("Удаление упражнения"),
                                setID(practice.id)
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
          <div className='app-button'>
            <Button onClick={() => (setOpen(true), setCase("Создать тренировку"))} type={"danger"}>+ тренировка</Button>
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