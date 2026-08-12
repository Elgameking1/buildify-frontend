import Input from './Input'

function Dropdown({ error, id, label, options = [], placeholder = 'Select an option', ...props }) {
  return (
    <Input as="select" error={error} id={id} label={label} {...props}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value ?? option} value={option.value ?? option}>
          {option.label ?? option}
        </option>
      ))}
    </Input>
  )
}

export default Dropdown
