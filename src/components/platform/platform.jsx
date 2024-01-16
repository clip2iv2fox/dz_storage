import React, { useState } from 'react'
import "./platform.css"
import Button from '../button/button'
import Modal from '../modal/modal'

const Platform = ({id="", name="", value="", notification="", del}) => {
    const [isOpen, setOpen] = useState(false)

    return (
        <div className='platform'>
            <div className='platform-data'>
                <div>
                    {name}
                </div>
                <div>
                    мест: {value}
                    <Button onClick={() => (
                        setOpen(true)
                    )} type={"danger"}>
                        <i className="fa fa-remove" style={{color: "white"}}></i>
                    </Button>
                </div>
            </div>
            <div className='platform-id'>
                ID: {id}
            </div>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)} title={"Удаление самолёта из бд"}>
                <div className="accordion-bottom">
                    Удаление самолёта приведёт к удалению его данных и рейсов с бронями.
                </div>
                <div className="accordion-bottom">
                    <Button onClick={() => setOpen(false)}>отмена</Button>
                    <div className='notification'>{notification}</div>
                    <Button onClick={() => del(id)} type={"danger"}>удалить</Button>
                </div>
            </Modal>
        </div>
    )
}

export default Platform
