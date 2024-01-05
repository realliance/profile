import { Label, TextInput } from 'flowbite-react';

interface TextInputWithLabelProps {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: string) => void;
  helperText?: React.ReactNode;
}

export function TextInputWithLabel({
  id,
  name,
  placeholder,
  required,
  disabled,
  value,
  helperText,
  onChange,
}: TextInputWithLabelProps) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={id} value={name} />
      </div>
      <TextInput
        id={id}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        helperText={helperText}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
    </div>
  );
}
