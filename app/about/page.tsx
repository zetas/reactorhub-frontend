export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About ReactorHub</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            ReactorHub is the premier platform for organizing and viewing creator reaction content
            with a premium streaming experience.
          </p>
          <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
          <p className="text-gray-300 mb-6">
            We believe creator content deserves a premium viewing experience. Our mission is to
            transform how patrons consume reaction content by providing a streaming-quality platform
            that organizes, tracks, and enhances the viewing experience.
          </p>
          <h2 className="text-2xl font-semibold mb-4 text-white">Built for the Community</h2>
          <p className="text-gray-300">
            ReactorHub was built by creators and patrons who wanted a better way to experience
            reaction content. We're committed to continuously improving the platform based on
            community feedback.
          </p>
        </div>
      </div>
    </div>
  );
}