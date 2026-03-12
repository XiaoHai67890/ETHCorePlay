import { useState, useRef, useEffect, useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  ariaLabel?: string;
  fullWidth?: boolean;
  className?: string;
}

export function CustomSelect({ value, onChange, options, ariaLabel, fullWidth = false, className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className={`custom-select-container ${fullWidth ? 'full-width' : ''} ${className}`.trim()} ref={containerRef}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
      >
        <span className="custom-select-copy">
          <span className="custom-select-value">{selectedOption.label}</span>
          {selectedOption.hint ? <span className="custom-select-hint">{selectedOption.hint}</span> : null}
        </span>
        <span className="custom-select-icon-wrap" aria-hidden="true">
          <ChevronDown size={16} className={`custom-select-icon ${isOpen ? 'open' : ''}`} />
        </span>
      </button>
      
      {isOpen && (
        <div className="custom-select-dropdown" role="listbox" id={listboxId} aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span className="custom-select-option-copy">
                <span>{option.label}</span>
                {option.hint ? <small>{option.hint}</small> : null}
              </span>
              <span className="custom-select-check" aria-hidden="true">
                {option.value === value ? <Check size={14} /> : null}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
