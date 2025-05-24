const Button = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses = "btn"
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    danger: "btn-danger",
  }
  const sizeClasses = {
    small: "btn-sm",
    medium: "btn-md",
    large: "btn-lg",
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading && "opacity-75",
    disabled && "opacity-60 cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
