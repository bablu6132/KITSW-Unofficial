import { useEffect, useRef } from 'react'

export default function FormTextarea({
  label,
  name,
  id,
  value,
  onChange,
  icon: Icon,
  required = false,
  error,
  helper,
  maxLength,
  rows = 3,
  autoResize = true,
}) {
  const textareaRef = useRef(null)
  const inputId = id || name
  const hasValue = value !== undefined && value !== null && String(value).length > 0
  const counter =
    typeof maxLength === 'number' ? `${String(value || '').length}/${maxLength}` : null

  const resize = () => {
    if (!autoResize || !textareaRef.current) {
      return
    }
    const element = textareaRef.current
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }

  useEffect(() => {
    resize()
  }, [value])

  return (
    <div className="space-y-1.5">
      <div className={`input-surface ${error ? 'border-rose-400/70' : ''}`}>
        {Icon ? (
          <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-slate-500 dark:bg-white/10 dark:text-white/70">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <textarea
          ref={textareaRef}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onInput={resize}
          placeholder=" "
          rows={rows}
          maxLength={maxLength}
          required={required}
          aria-invalid={Boolean(error)}
          className={`peer w-full resize-none bg-transparent pt-4 pb-1 text-sm text-slate-900 outline-none placeholder:text-transparent dark:text-white ${
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
