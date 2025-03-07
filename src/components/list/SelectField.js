import React from 'react';
import { FormGroup, Label, Input, Alert } from 'reactstrap';

const SelectField = ({
	id,
	field,
	options,
	optionLabel = null,
	value,
	handleChange,
	handleBlurEvent,
	errors
}) => (
	<div key={id}>
		<FormGroup>
			<Label>{field.title}:</Label>
			<Input
				id={id}
				name={id}
				value={value}
				onChange={(e) => {
					const selectedOption = options.find((option) => option.id === parseInt(e.target.value));
					handleChange({
						target: { id, value: selectedOption ? selectedOption.id : e.target.value }
					});
				}}
				onBlur={handleBlurEvent}
				type="select"
			>
				<option value="">Select an option</option>
				{options.map((option) => (
					<option key={option.id} value={option.id}>
						{optionLabel ? option[optionLabel] : option}
					</option>
				))}
			</Input>
			{errors && errors[id] ? (
				<Alert color="danger" className="error">
					{errors[id]}
				</Alert>
			) : (
				''
			)}
		</FormGroup>
	</div>
);

export default SelectField;
