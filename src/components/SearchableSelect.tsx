import { useState, useEffect, useRef } from 'react';

interface Option { code: string; name: string; }
interface SearchableSelectProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: Option | null;
  onChange: (opt: Option | null) => void;
  disabled?: boolean;
  loading?: boolean;
  isAdded?: (code: string) => boolean;
  onSelect?: (opt: Option) => void; // برای رشته (بدون ذخیره value)
  multiAdd?: boolean; // اگر true باشه بعد از انتخاب value پاک میشه
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label, placeholder, options, value, onChange,
  disabled = false, loading = false, isAdded, onSelect, multiAdd = false,
}) => {
  const [query, setQuery]     = useState('');
  const [open, setOpen]       = useState(false);
  const wrapRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!multiAdd) setQuery(value ? value.name : '');
  }, [value, multiAdd]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!multiAdd) setQuery(value ? value.name : '');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value, multiAdd]);

  const filtered = options.filter(o =>
    !query || o.name.includes(query)
  );

  const handleSelect = (opt: Option) => {
    if (isAdded?.(opt.code)) return;
    if (multiAdd) {
      onSelect?.(opt);
      setQuery('');
    } else {
      onChange(opt);
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
  };

  const inputClass = `
    w-full h-9 px-3 flex items-center gap-2 rounded-lg border text-sm
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
    transition-all duration-150 bg-white
    ${disabled ? 'border-slate-200 bg-slate-50 cursor-not-allowed' : 'border-slate-200 cursor-text'}
  `;

  return (
    <div className="flex-1 min-w-[150px] relative" ref={wrapRef}>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
        {label}
        {loading && <span className="text-blue-400 font-normal ms-1">Loading...</span>}
      </label>

      {/* Input Row */}
      <div className={inputClass} onClick={() => !disabled && setOpen(true)}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => !disabled && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm min-w-0 disabled:cursor-not-allowed"
          dir="ltr"
        />
        {/* Clear */}
        {value && !disabled && (
          <button onClick={handleClear} className="text-slate-400 hover:text-slate-600 shrink-0">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16" fill="none"
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute top-full mt-1 start-0 end-0 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-3 text-sm text-blue-500 text-center">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-400 text-center">No results found</div>
          ) : (
            filtered.map(opt => {
              const added = isAdded?.(opt.code) ?? false;
              return (
                <div
                  key={opt.code}
                  onClick={() => handleSelect(opt)}
                  className={`
                    flex items-center justify-between px-3 py-2 text-sm cursor-pointer
                    ${added
                      ? 'text-slate-400 cursor-default'
                      : value?.code === opt.code
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    }
                  `}
                >
                  <span>{opt.name}</span>
                  {added && (
                    <span className="text-[11px] text-emerald-600">✓ Added</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
export default SearchableSelect;
