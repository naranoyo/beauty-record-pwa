// components/ui/Badge.tsx

type Props = {
  children: React.ReactNode;
};

export function Badge({ children }: Props) {
  return (
    <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
      {children}
    </span>
  );
}
