import React from 'react';
import { FormGroup, Label, Input, Alert } from 'reactstrap';

const InputField = ({
	id,
	field,
	value,
	handleChange,
	handleBlurEvent,
	errors,
	type,
	disabled
}) => {
	if (type === 'file') {
		return (
			<FormGroup>
				<Label for={id}>{field.title}</Label>
				<input
					type="file"
					id={id}
					name={id}
					onChange={handleChange}
					onBlur={handleBlurEvent}
					disabled={disabled}
					className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
				/>
				{errors[id] && <div className="invalid-feedback">{errors[id]}</div>}
			</FormGroup>
		);
	}

	return (
		<FormGroup>
			<Label for={id}>{field.title}</Label>
			<input
				type={type || 'text'}
				id={id}
				name={id}
				value={value}
				onChange={handleChange}
				onBlur={handleBlurEvent}
				disabled={disabled}
				className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
			/>
			{errors[id] && <div className="invalid-feedback">{errors[id]}</div>}
		</FormGroup>
	);
};

export default InputField;
