import "./Select.css";

function Select({ options = [], value, onChange }) {
  return (
    <select className="select" value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default Select;
