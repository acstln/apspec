import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        { 'ui-button--icon-only': !children && icon },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="ui-button__icon">{icon}</span>}
      {children && <span className="ui-button__label">{children}</span>}
      {icon && iconPosition === 'right' && <span className="ui-button__icon">{icon}</span>}
    </button>
  );
}
