
import React from "react";
import { FormGroup, Label, Input, Alert } from "reactstrap";

const SelectField = ({ id, field, options, optionLabel = null, value, handleChange, handleBlurEvent, errors }) => (
  <div key={id}>
    <FormGroup>
      <Label>{field.title}:</Label>
      <Input
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlurEvent}
        type="select"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabel ? option[optionLabel] : option}
          </option>
        ))}
      </Input>
      {errors[id] ? <Alert color="danger" className="error">{errors[id]}</Alert> : "" }
    </FormGroup>
  </div>
);

export default SelectField;