import React, { useEffect, useState } from 'react';
import "./select.css"

const Select = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(options.length !== 0 ? options[0].id : null);

    useEffect(() => {
        onSelect(selectedOption)
    }, [])

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        onSelect(selectedValue);
    };

    return (
        <select className="custom-select" value={selectedOption} onChange={handleSelectChange}>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

export default Select;
