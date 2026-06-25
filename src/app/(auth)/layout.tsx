export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-gray-50 p-4 dark:from-background dark:to-background">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
