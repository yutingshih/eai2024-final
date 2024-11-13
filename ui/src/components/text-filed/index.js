import './index.css';

function TextField({ value, setValue, placeholder, isReadOnly = false }) {
  return (
    <div className="textfiled-wrapper">
      <textarea placeholder={placeholder} disabled={isReadOnly} value={value} onChange={setValue}></textarea>
    </div>
  );
}

export default TextField;
