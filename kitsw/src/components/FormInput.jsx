export default function FormInput({
  label,
  name,
  id,
  value,
  onChange,
  type = 'text',
  icon: Icon,
  required = false,
  error,
  helper,
  maxLength,
  inputMode,
  autoComplete,
}) {
  const inputId = id || name
  const hasValue = value !== undefined && value !== null && String(value).length > 0
  const counter =
    typeof maxLength === 'number' ? `${String(value || '').length}/${maxLength}` : null

  return (
    <div className="space-y-1.5">
      <div className={`input-surface ${error ? 'border-rose-400/70' : ''}`}>
        {Icon ? (
          <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-slate-500 dark:bg-white/10 dark:text-white/70">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          required={required}
          aria-invalid={Boolean(error)}
          className={`peer w-full bg-transparent pt-4 pb-1 text-sm text-slate-900 outline-none placeholder:text-transparent dark:text-white ${
            Icon ? 'pl-12' : 'pl-1'
          } pr-3`}
        />
        <label
          htmlFor={inputId}
          className={`input-label ${Icon ? 'left-12' : 'left-4'} ${
            hasValue ? 'top-2.5 text-xs text-primary' : ''
          }`}
        >
          {label}
          {required ? <span className="text-rose-400"> *</span> : null}
        </label>
      </div>
      <div className="flex items-center justify-between">
        <span className={error ? 'text-xs text-rose-400' : 'input-helper'}>
          {error || helper || ' '}
        </span>
        {counter ? (
          <span className="text-xs text-slate-400 dark:text-white/40">
            {counter}
          </span>
        ) : null}
      </div>
    </div>
  )
}
