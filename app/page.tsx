import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          Cardiology Edge Engage
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Edge Engage Execution Method applied to cardiology work at Gundersen Health System.
        </p>
        <div className="mt-8">
          <Link 
            href="/engage-method-v2"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Edge Engage Method v2
          </Link>
        </div>
      </div>
    </main>
  );
}
