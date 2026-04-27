// components/layout/PageContainer.tsx

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function PageContainer({ children, title, description }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6">
      {(title || description) && (
        <div className="mb-6 space-y-2">
          {title && (
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          )}
          {description && (
            <p className="text-sm text-slate-600">{description}</p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
