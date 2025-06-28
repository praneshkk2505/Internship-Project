import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart - Crunchy Tamizhan',
  description: 'Review your order and proceed to checkout',
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
