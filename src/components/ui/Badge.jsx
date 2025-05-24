const Badge = ({ children, variant = "primary", className = "" }) => {
  const baseClasses = "badge"
  const variantClasses = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    info: "badge-info",
  }

  const classes = [baseClasses, variantClasses[variant], className].filter(Boolean).join(" ")

  return <span className={classes}>{children}</span>
}

export default Badge
