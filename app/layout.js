import '@/styles/globals.css';

export const metadata = {
  title: 'CreatorRank',
  description: 'Rank and connect with YouTube creators',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
