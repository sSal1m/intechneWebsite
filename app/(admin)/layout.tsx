import '../globals.css';

export const metadata = {
  title: 'Intechne | Admin Paneli',
  description: 'Intechne içerik yönetim sistemi.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="admin-body bg-black text-white font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
