import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { IconSearch } from '../icons';
import './SearchInput.css';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export default function SearchInput({ className, value, onClear, ...props }: SearchInputProps) {
  return (
    <div className={clsx('search-input', className)}>
      <IconSearch className="search-input__icon" size={16} />
      <input
        type="search"
        className="search-input__field"
        value={value}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          className="search-input__clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
