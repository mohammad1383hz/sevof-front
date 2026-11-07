import React from 'react';

interface PersianDatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
}

const persianCalendar = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', {
  calendar: 'persian',
  numberingSystem: 'latn',
  timeZone: 'UTC',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

function getPersianParts(date: Date) {
  const parts = Object.fromEntries(
    persianCalendar.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

function formatGregorianDate(date: Date): string {
  return `${date.getUTCFullYear().toString().padStart(4, '0')}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
}

function toPersianDateString(date: Date): string {
  const { year, month, day } = getPersianParts(date);
  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

function parseLegacyPersianDate(value: string): string | undefined {
  const match = value.trim().match(/^(\d{3,4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) return undefined;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year < 1000 || year > 1700 || month < 1 || month > 12 || day < 1 || day > 31) {
    return undefined;
  }

  // Persian New Year falls around March 20. Search a small window around
  // the expected Gregorian date so leap years and equinox shifts stay exact.
  const dayOffset = month <= 6 ? (month - 1) * 31 : 6 * 31 + (month - 7) * 30;
  const approximate = new Date(Date.UTC(year + 621, 2, 20 + dayOffset + day - 1));
  for (let offset = -3; offset <= 3; offset += 1) {
    const candidate = new Date(approximate.getTime() + offset * 86_400_000);
    const parts = getPersianParts(candidate);
    if (parts.year === year && parts.month === month && parts.day === day) {
      return formatGregorianDate(candidate);
    }
  }
  return undefined;
}

function normalizeDateValue(value?: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  const isoDate = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;

  const persianDate = parseLegacyPersianDate(trimmed);
  if (persianDate) return persianDate;

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? '' : formatGregorianDate(parsed);
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select a date',
  disabled = false,
  className = '',
  hasError = false,
}) => {
  const inputClassName = [
    'block w-full rounded-xl border bg-white px-3 py-2.5 text-start text-sm text-gray-900 shadow-sm outline-none transition',
    'focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
    hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      type="date"
      dir="ltr"
      value={normalizeDateValue(value)}
      onChange={(event) => {
        const selected = event.target.value;
        if (!selected) {
          onChange('');
          return;
        }
        const date = new Date(`${selected}T00:00:00.000Z`);
        onChange(toPersianDateString(date));
      }}
      disabled={disabled}
      className={inputClassName}
      aria-label={placeholder}
      aria-invalid={hasError || undefined}
      title={placeholder}
    />
  );
};

export default PersianDatePicker;
