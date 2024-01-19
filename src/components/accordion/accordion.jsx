import React, { useState } from 'react';
import "./accordion.css"

const Accordion = ({children, header, footer}) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="accordion">
      <div className={`accordion-header ${isOpen ? 'open' : ''}`} onClick={() => setOpen(!isOpen)}>
        {header}
        <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </div>
      {isOpen && (
        <>
          {children}
          {footer}
        </>
      )}
    </div>
  );
};

export default Accordion;
