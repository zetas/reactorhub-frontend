export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Platform Features</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Smart Organization</h3>
            <p className="text-gray-400">Automatically organized content into series, seasons, and episodes for easy browsing.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Cross-Device Sync</h3>
            <p className="text-gray-400">Continue watching where you left off on any device.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Creator Analytics</h3>
            <p className="text-gray-400">Detailed insights for creators to understand their audience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}