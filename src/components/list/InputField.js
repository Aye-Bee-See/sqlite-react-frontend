import React from "react";
import { FormGroup, Label, Input, Alert } from "reactstrap";

const InputField = ({ id, field, value, handleChange, handleBlurEvent, errors, disabled = false }) => (
  <div key={id}>
    <FormGroup>
      <Label>{field.title}:</Label>
      <Input
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlurEvent}
        type={field.type}
        disabled={disabled}
        data-attribute-name={field.title}
      />
      {errors[id] ? <Alert color="danger" className="error">{errors[id]}</Alert> : "" }
    </FormGroup>
  </div>
);

export default InputField;