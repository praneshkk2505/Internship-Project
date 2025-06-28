import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - Crunchy Tamizhan',
  description: 'View and manage your profile information',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
