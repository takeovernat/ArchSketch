export default function Header({children}: {children?: React.ReactNode}) {
  return (
    <header className="text-center py-16">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">ArchSketch</h1>
      {children}
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Describe your software architecture in plain English — get a professional diagram instantly.
      </p>
    </header>
  );
}