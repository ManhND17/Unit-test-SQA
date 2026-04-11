type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'outline'
  | 'disabled'
  | 'purple'
  | 'blue'
  | 'teal'
  | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = 'success' }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',

    info: 'bg-cyan-100 text-cyan-700',
    primary: 'bg-blue-100 text-blue-700',
    secondary: 'bg-gray-100 text-gray-700',

    neutral: 'bg-slate-100 text-slate-700',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
    disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed',

    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-sky-100 text-sky-700',
    teal: 'bg-teal-100 text-teal-700',
    default: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
