export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}