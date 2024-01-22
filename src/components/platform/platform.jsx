import React, { useState } from 'react'
import "./platform.css"
import Button from '../button/button'
import Modal from '../modal/modal'

const Platform = ({id="", name="", value="", notification="", del}) => {
    const [isOpen, setOpen] = useState(false)

    return (
        <div className='platform'>
            <div className='platform-data'>
                <div className='platform-title'>
                    {name}
                </div>
                <div className='platform-accent'>
                    {value}
                </div>
            </div>
            <div className='platform-data'>
                <div className='platform-id'>
                    ID: {id}
                </div>
                <div>
                    <i onClick={() => (setOpen(true))} className="fa fa-remove platform-del"></i>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)} title={"Удаление типа упражнения из бд"}>
                <div className="platform-bottom">
                    Удаление типа упражнения приведёт к удалению всех данных упражнений, и больше никто не сломает себе спину.
                </div>
                <div className="platform-bottom">
                    <Button onClick={() => setOpen(false)}>отмена</Button>
                    <div className='notification'>{notification}</div>
                    <Button onClick={() => del()} type={"danger"}>удалить</Button>
                </div>
            </Modal>
        </div>
    )
}

export default Platform
