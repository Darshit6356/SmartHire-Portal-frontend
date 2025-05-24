"use client"
import Select from "./Select"

const Filter = ({ placeholder = "Filter...", options = [], value, onChange, className = "" }) => {
  const selectOptions = [
    { value: "", label: placeholder },
    ...options.map((option) => ({
      value: option,
      label: option,
    })),
  ]

  return (
    <div className={className}>
      <Select options={selectOptions} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export default Filter
