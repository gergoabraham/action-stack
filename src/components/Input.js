import React from 'react';

function Input({ name, value, referenceValue, onChange }) {
  let typeProps, valueSelector;

  switch (typeof value) {
    case 'boolean':
      typeProps = { type: 'checkbox', checked: value };
      valueSelector = (event) => event.target.checked;
      break;
    case 'string':
      typeProps = { type: 'text', value: value };
      valueSelector = (event) => event.target.value;
      break;
    case 'number':
      typeProps = { type: 'number', value: value };
      valueSelector = (event) => {
        const parsedValue = parseInt(event.target.value);
        if (isNaN(parsedValue)) {
          return 0;
        } else {
          return parsedValue;
        }
      };
      break;
    default:
      throw new TypeError(`Input component: unsupported type: ${typeof value}`);
  }

  return (
    <div>
      <label
        htmlFor={name}
        style={{
          fontWeight: value !== referenceValue ? 'bold' : 'normal',
        }}
      >
        {name}:
      </label>

      <input
        {...typeProps}
        id={name}
        onChange={(event) => onChange(valueSelector(event))}
      />
    </div>
  );
}

export default Input;
