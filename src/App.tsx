import "./App.css";

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Tailwind CSS Example
          </h1>
          <p className="text-gray-600 mt-2">
            A showcase of Tailwind utility classes
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">1</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Responsive Design
            </h2>
            <p className="text-gray-600">
              Tailwind makes it easy to build responsive layouts with mobile-first utilities.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">2</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Utility-First
            </h2>
            <p className="text-gray-600">
              Build complex components from a constrained set of primitive utilities.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">3</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Fast Development
            </h2>
            <p className="text-gray-600">
              Rapidly build modern websites without leaving your HTML.
            </p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Button Styles
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Primary Button
            </button>
            <button className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200">
              Secondary Button
            </button>
            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200">
              Success Button
            </button>
            <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200">
              Danger Button
            </button>
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200">
              Outline Button
            </button>
          </div>
        </div>

        {/* Typography Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Typography Examples
          </h2>
          <div className="space-y-4">
            <p className="text-4xl font-bold text-gray-900">
              Extra Large Heading
            </p>
            <p className="text-3xl font-semibold text-gray-800">
              Large Heading
            </p>
            <p className="text-2xl font-medium text-gray-700">
              Medium Heading
            </p>
            <p className="text-xl text-gray-600">
              Regular text with some content
            </p>
            <p className="text-sm text-gray-500">
              Small text for captions or footnotes
            </p>
            <p className="text-xs text-gray-400">
              Extra small text
            </p>
          </div>
        </div>

        {/* Badges and Tags */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Badges & Tags
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              Blue Badge
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Green Badge
            </span>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              Yellow Badge
            </span>
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              Red Badge
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              Purple Badge
            </span>
            <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-semibold">
              Pink Badge
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-300">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;
