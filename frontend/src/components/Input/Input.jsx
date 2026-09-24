import "./Input.css";

function Input({ type = "text", placeholder, value, onChange, min, max }) {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
    />
  );
}

export default Input;
