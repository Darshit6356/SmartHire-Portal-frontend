const Select = ({ options = [], className = "", error = false, ...props }) => {
  const classes = ["input-field", error && "input-error", className].filter(Boolean).join(" ")

  return (
    <select className={classes} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select
