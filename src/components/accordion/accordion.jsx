import React, { useState } from 'react';
import "./accordion.css"

const Accordion = ({title="Non", info="", id="", children}) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="accordion">
      <div className={`accordion-header ${isOpen ? 'open' : ''}`} onClick={() => setOpen(!isOpen)}>
        <h3>
          {title}
          <div className="avia-id">{info}</div>
        </h3>
        <div className='avia-right'>
          <div className="avia-id">{id}</div>
          <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
        </div>
      </div>
      {isOpen && (
        {children}
      )}
    </div>
  );
};

export default Accordion;
