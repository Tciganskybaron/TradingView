import React from 'react';
import styles from './ButtonGroup.module.css';
import cn from 'classnames';

export function ButtonGroup({ options, selectedValue, onChange }) {
	return (
		<div className={styles.buttonGroup}>
			{options.map(option => (
				<button
					key={option.value}
					className={cn(styles.button, {
						[styles.active]: selectedValue === option.value,
					})}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}
