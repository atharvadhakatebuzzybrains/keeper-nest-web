import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  [key: string]: any;
}

interface CustomDropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  className = '',
  disabled = false
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
        }
        break;
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
     <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2.5
          text-sm text-left bg-white border rounded-lg
          transition-all duration-200
          ${disabled
            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            : isOpen
            ? 'border-blue-500 ring-2 ring-blue-100'
            : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
          }
          ${selectedOption ? 'text-gray-900' : 'text-gray-500'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedOption ? (
            <>
              <span className="truncate">{selectedOption.label}</span>
              {value && !disabled && (
                <button
                  onClick={clearSelection}
                  className="p-0.5 hover:bg-gray-100 rounded"
                  aria-label="Clear selection"
                >
                  <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </>
          ) : (
            <span>{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg
          overflow-hidden max-h-80 animate-in fade-in-0 zoom-in-95"
          role="listbox"
        >
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-64 py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    px-3 py-2.5 text-sm cursor-pointer transition-colors duration-150
                    flex items-center justify-between
                    ${highlightedIndex === index
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                    }
                    ${option.value === value
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700'
                    }
                  `}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No options found
                {searchTerm && (
                  <div className="mt-1">
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            {filteredOptions.length} of {options.length} options
            {searchTerm && ` • Searching: "${searchTerm}"`}
          </div>
        </div>
      )}
    </div>
  );
}