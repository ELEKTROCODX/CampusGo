import React from 'react';
import './FormInput.css';

function FormInput({ label, type = 'text', name, placeholder, value, onChange, required }) {
  return (
    <div className="FormInput">
      <label className="FormInput__label" htmlFor={name}>{label}</label>
      <input
        className="FormInput__input"
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default FormInput;