import NavBar from "./navbar/page";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed NavBar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md">
        <NavBar  />
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-[32px] items-center sm:items-start mt-[80px] px-4 w-full pt-5">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <p className="text-gray-600">
          Your content goes here. The NavBar stays fixed on top.
        </p>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center p-4 bg-gray-100 w-full mt-auto">
        <p className="text-gray-500 text-sm">© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
