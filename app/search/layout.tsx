import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search - Crunchy Tamizhan',
  description: 'Search for your favorite snacks and products',
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
