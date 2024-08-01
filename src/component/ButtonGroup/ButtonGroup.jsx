import React from 'react';
import styles from './ButtonGroup.module.css';
import cn from 'classnames';
import trash from "../../icon/trash.svg";
import diagonal from "../../icon/diagonal-line.svg";
import horizontal from "../../icon/horizontal-line.svg";

export function ButtonGroup({ options, selectedValue, onChange, left }) {
    return (
        <div className={cn(styles.buttonGroup, { [styles.left]: left })}>
            {options.map(option => (
                <button
                    key={option.value}
                    className={cn(styles.button, {
                        [styles.active]: selectedValue === option.value,
                    })}
                    onClick={() => onChange(option.value)}
                >
                    {option.label && option.label}
                    {option.icon && <img src={option.icon === "trash" ? trash : option.icon === "diagonal" ? diagonal : horizontal} alt="" className={styles.icon}/>}
                </button>
            ))}
        </div>
    );
}
