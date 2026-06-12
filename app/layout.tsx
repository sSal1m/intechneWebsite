export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The [locale]/layout.tsx handles the actual html/body structure.
  // This root layout is required by Next.js but delegated to locale layout.
  return children;
}
