// components/ComboBox.tsx
import { useState, useRef, useEffect } from 'react';

interface Option {
  id: number;
  name: string;
}

interface ComboBoxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = '-- Select --',
  hasError = false,
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(o =>
    o.name.includes(query) || query === value
  );

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery(value);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value]);

  const handleSelect = (name: string) => {
    onChange(name);
    setQuery(name);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    if (e.target.value === '') onChange('');
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500
            focus:border-transparent bg-white text-start ps-10
            ${hasError ? 'border-red-400' : 'border-gray-200'}
          `}
        />
        <span className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
{isOpen && (
  <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
    {filtered.length > 0 ? (
      <>
        {filtered.map(option => (
          <li
            key={option.id}
            onMouseDown={() => handleSelect(option.name)}
            className={`
              px-4 py-2.5 text-sm text-start cursor-pointer transition-colors
              hover:bg-blue-50 hover:text-blue-700
              ${value === option.name ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
            `}
          >
            {option.name}
          </li>
        ))}
        <li
          onMouseDown={() => handleSelect('Other')}
          className={`
            px-4 py-2.5 text-sm text-start cursor-pointer transition-colors border-t border-gray-100
            hover:bg-blue-50 hover:text-blue-700
            ${value === 'Other' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 italic'}
          `}
        >
          Other
        </li>
      </>
    ) : (
      <li className="px-4 py-3 text-sm text-gray-400 text-center">No results found</li>
    )}
  </ul>
)}
    </div>
  );
};

export default ComboBox;
