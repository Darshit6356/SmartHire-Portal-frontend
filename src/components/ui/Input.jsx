const Input = ({ type = "text", className = "", error = false, ...props }) => {
  const classes = ["input-field", error && "input-error", className].filter(Boolean).join(" ")

  return <input type={type} className={classes} {...props} />
}

export default Input
