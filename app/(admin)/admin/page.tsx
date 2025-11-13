const AdminPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold">Admin Section</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Admin Dashboard
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="/admin/measures"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Go to Measures
          </a>
          <a
            href="/admin/products"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Go to Products
          </a>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
