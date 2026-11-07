
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/**
 * سوییچ فعال/غیرفعال.
 * موقعیت دایره‌ی سفید با left/top مطلق تعیین می‌شه (نه translate)
 * تا مطمئن باشیم همیشه داخل نوار می‌مونه و بیرون نمی‌زنه.
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, disabled = false }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1B6F63]/50 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-wait ${
      checked ? "bg-[#1B6F63]" : "bg-[#DAD5C7]"
    }`}
  >
    <span
      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out ${
        checked ? "end-6" : "end-1"
      }`}
    />
  </button>
);

export default ToggleSwitch;
