import React from 'react';
import "./header.css"

const Header = () => {
  return (
    <div className="header">
      <div className="title">
        <i class='fa fa-paper-plane' style={{fontSize: '35px', color:'white', marginRight: '15px'}}></i>
        AVIA.reg
      </div>
      <div className="icon">
        <i class='fa fa-paper-plane' style={{fontSize: '25px', color:'white', opacity: '70%'}}></i>
      </div>
    </div>
  );
};

export default Header;
