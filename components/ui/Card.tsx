// components/ui/Card.tsx

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-3xl border border-rose-100 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
