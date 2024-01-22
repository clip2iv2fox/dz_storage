import React, { useEffect, useState } from 'react';
import "./select.css"

const Select = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(options.length !== 0 ? options[0] : null);

    useEffect(() => {
        onSelect(selectedOption);
    }, []);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        const selectedOption = options.find(option => option.id === selectedValue);
        setSelectedOption(selectedOption);
        onSelect(selectedOption);
    };

    return (
        <select className="custom-select" value={selectedOption ? selectedOption.id : ''} onChange={handleSelectChange}>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

export default Select;
