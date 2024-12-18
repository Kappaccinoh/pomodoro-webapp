interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
    {message}
    {onDismiss && (
      <button
        className="absolute top-0 bottom-0 right-0 px-4"
        onClick={onDismiss}
      >
        ×
      </button>
    )}
  </div>
); 