const TextArea = ({ className = "", error = false, rows = 4, ...props }) => {
  const classes = ["input-field resize-y", error && "input-error", className].filter(Boolean).join(" ")

  return <textarea className={classes} rows={rows} {...props} />
}

export default TextArea
