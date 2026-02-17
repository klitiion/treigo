import { cn } from '@/lib/utils'
import { forwardRef, TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs uppercase tracking-wider font-600 text-black mb-3"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-10 py-3 bg-white border-b-2 text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed',
            'focus:outline-none focus:border-black',
            'transition-colors duration-200 resize-y min-h-[100px]',
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

Textarea.displayName = 'Textarea'

export { Textarea }
