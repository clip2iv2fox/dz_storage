import React, { useState } from 'react';
import "./accordion.css"
import Button from '../button/button';

const Accordion = ({title="Non", info="", id="", redact, children}) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="accordion">
      <div className={`accordion-header ${isOpen ? 'open' : ''}`} onClick={() => setOpen(!isOpen)}>
        <div className='accordion-right'>
          <div className='accordion-title'>
            {title}
          </div>
          <div className="accordion-id">{id}</div>
          {info}
        </div>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </div>
      {isOpen && (
        <>
          {children}
          <div className="accordion-bottom">
            <div>
              <Button onClick={() => {redact()}} type={"default"}>
                редактировать рейс
              </Button>
              <Button onClick={() => {}}>+ бронь</Button>
            </div>
            <Button onClick={() => {}} type={"danger"}>
              <i className="fa fa-remove" style={{color: "white", fontSize: "25px"}}></i>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Accordion;
