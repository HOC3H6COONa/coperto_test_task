interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className="text-accent text-sm" role="alert">
      {message}
    </p>
  );
}
