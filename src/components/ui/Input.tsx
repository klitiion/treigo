import { cn } from '@/lib/utils'
import { forwardRef, InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs uppercase tracking-wider font-600 text-black mb-3"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-10 py-3 bg-white border-b-2 text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed',
            'focus:outline-none focus:border-black',
            'transition-colors duration-200',
            'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-300',
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        />
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

Input.displayName = 'Input'

export { Input }
