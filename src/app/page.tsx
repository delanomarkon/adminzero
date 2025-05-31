export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Welkom bij AdminZero 👋</h1>
      <p className="text-gray-600 text-center max-w-md">
        Start met het maken van een nieuwe factuur of bekijk je dashboard.
      </p>

      <div className="mt-6 flex gap-4">
        <a
          href="/facturen/nieuw"
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          ➕ Nieuwe factuur
        </a>
        <a
          href="/dashboard"
          className="bg-white text-black border px-5 py-2 rounded hover:bg-gray-100 transition"
        >
          📊 Dashboard
        </a>
      </div>
    </main>
  )
}
