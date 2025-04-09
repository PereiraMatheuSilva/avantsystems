'use client'
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  className?: string;
  disabled?: boolean;
}

export function Input({
  name,
  placeholder,
  register,
  type,
  error,
  rules,
  className = '',
  disabled = false,
}: InputProps) {
  return (
    <>
      <input
        className={`w-full border-1 rounded-md h-11 px-2 ${className}`}
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
        disabled={disabled}
      />
      {error && <p className='text-red-500 my-1'>{error}</p>}
    </>
  );
}
