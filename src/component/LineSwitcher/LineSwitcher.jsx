import React from 'react';
import { LINE } from '../../constants/line';
import { ButtonGroup } from '../index';

export function LineSwitcher({handleAddLineButtonClick, handleAddTrendLineButtonClick, handleRemoveLinesButtonClick, selectedValue}) {

	const handleButtonGroupChange = (value) => {
        if (value === 'addLine') {
            handleAddLineButtonClick();
        } else if (value === 'addTrendLine') {
            handleAddTrendLineButtonClick();
        } else if (value === 'removeLines') {
            handleRemoveLinesButtonClick();
        }
    };

	return (
		  <ButtonGroup 
        options={LINE} 
        selectedValue={selectedValue} 
        onChange={handleButtonGroupChange} 
				left
      /> 
	);
}
