// components/layout/PageContainer.tsx

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function PageContainer({ children }: Props) {
  return <div className="mx-auto w-full max-w-2xl">{children}</div>;
}
