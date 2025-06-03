import "@/app/globals.css";

export const metadata = {
  title: "GitHub User Search",
  description: "Search GitHub users and repositories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}