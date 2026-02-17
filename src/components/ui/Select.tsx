import { cn } from '@/lib/utils'
import { forwardRef, SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs uppercase tracking-wider font-600 text-black mb-3"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-10 py-3 bg-white border-b-2 text-black text-gray-700 tracking-wide leading-relaxed',
            'focus:outline-none focus:border-black',
            'transition-colors duration-200 appearance-none cursor-pointer',
            'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-300',
            'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")] bg-no-repeat bg-[right_0px_center]',
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 text-xs text-red-600 uppercase tracking-wide font-semibold">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-xs text-gray-600 uppercase tracking-wide">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }

