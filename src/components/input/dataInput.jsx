import React, { useState } from 'react';

const DateInput = ({ placeholder, input, min = null }) => {
    const today = new Date().toISOString().slice(0, 16);
    const [selectedDate, setSelectedDate] = useState(placeholder);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        input(event.target.value);
    };

    return (
        <input
            type="datetime-local"
            id="dateTimeInput"
            value={selectedDate}
            onChange={handleDateChange}
            min={min ? min : today}
        />
    );
};

export default DateInput;