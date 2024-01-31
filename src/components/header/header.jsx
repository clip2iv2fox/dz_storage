import React, { useState } from 'react';
import "./header.css"

const Header = ({name, middle}) => {
  const [dark, setDark] = useState(true);

  const toggleDarkMode = () => {
    setDark(!dark);
    document.body.classList.toggle('dark-theme', dark);
  };

  return (
    <div className="header">
      <div className="title">
        <i className='fa fa-dropbox icon'></i>
        {name}
      </div>
      {middle}
      <div className='header-right'>
        <i onClick={() => toggleDarkMode()} className={dark ? 'fa fa-moon-o darktheme' : 'fa fa-sun-o darktheme'}></i>
      </div>
    </div>
  );
};

export default Header;
