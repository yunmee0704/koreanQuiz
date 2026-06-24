interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
      <h1 className="text-2xl font-bold text-emerald-900 md:text-3xl">{title}</h1>
      <p className="mt-2 text-base text-emerald-800">{subtitle}</p>
    </header>
  );
}
