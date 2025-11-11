import Link from "next/link";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-4xl font-bold mb-8">Simple Food App</h1>
        <div className="flex gap-4">
          <Link
            href="/client"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Client Section
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Admin Section
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
