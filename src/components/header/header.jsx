import React, { useState } from 'react';
import "./header.css"

const Header = () => {
  const [dark, setDark] = useState(true);

  const toggleDarkMode = () => {
    setDark(!dark);
    document.body.classList.toggle('dark-theme', dark);
  };

  return (
    <div className="header">
      <div className="title">
        <i className='fa fa-paper-plane' style={{fontSize: '35px', color:'white', marginRight: '15px'}}></i>
        AVIA.reg
      </div>
      <div className='header-right'>
        <i onClick={() => toggleDarkMode()} className={dark ? 'fa fa-moon-o darktheme' : 'fa fa-sun-o darktheme'}></i>
        <div className="icon">
          <i className='fa fa-paper-plane' style={{fontSize: '25px', color:'white', opacity: '70%'}}></i>
        </div>
      </div>
    </div>
  );
};

export default Header;
