import React, { useState } from 'react'
import "./platform.css"

const Platform = ({name="", value=""}) => {

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
        </div>
    )
}

export default Platform
