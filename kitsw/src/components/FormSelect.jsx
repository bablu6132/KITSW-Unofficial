export default function FormSelect({
  label,
  name,
  id,
  value,
  onChange,
  options,
  icon: Icon,
  required = false,
  error,
  helper,
}) {
  const inputId = id || name
  const hasValue = value !== undefined && value !== null && String(value).length > 0

  return (
    <div className="space-y-1.5">
      <div className={`input-surface ${error ? 'border-rose-400/70' : ''}`}>
        {Icon ? (
          <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-slate-500 dark:bg-white/10 dark:text-white/70">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={Boolean(error)}
          className={`peer w-full appearance-none bg-transparent pt-4 pb-1 text-sm text-slate-900 outline-none dark:text-white ${
            Icon ? 'pl-12' : 'pl-1'
          } pr-10`}
        >
          <option value="" disabled>
            
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={inputId}
          className={`input-label ${Icon ? 'left-12' : 'left-4'} ${
            hasValue ? 'top-2.5 text-xs text-primary' : ''
          }`}
        >
          {label}
          {required ? <span className="text-rose-400"> *</span> : null}
        </label>
        <span className="pointer-events-none absolute right-4 top-3 flex h-9 w-9 items-center justify-center text-slate-500 dark:text-white/60">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.2l3.71-3.97a.75.75 0 1 1 1.08 1.04l-4.25 4.54a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className={error ? 'text-xs text-rose-400' : 'input-helper'}>
          {error || helper || ' '}
        </span>
      </div>
    </div>
  )
}
