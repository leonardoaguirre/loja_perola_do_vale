interface ToggleSwitchProps {
  name: string;
  checked: boolean;
  onChange: (newValue: boolean) => void;
  small?: boolean;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = (props) => {
  return (
    <div className={`toggle-switch ${props.small ? 'small-switch' : ''}`}>
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        name={props.name}
        id={props.name}
        checked={props.checked}
        onChange={e => props.onChange(e.target.checked)}
        disabled={props.disabled}
      />
      <label className="toggle-switch-label" htmlFor={props.name}>
        <span className="toggle-switch-inner" data-yes="Yes" data-no="No" />
        <span className="toggle-switch-switch" />
      </label>
    </div>
  );
}

export default ToggleSwitch;