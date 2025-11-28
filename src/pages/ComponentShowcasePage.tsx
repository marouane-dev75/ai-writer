export const ComponentShowcasePage = () => {
  return (
    <>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">1</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Responsive Design
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Tailwind makes it easy to build responsive layouts with mobile-first utilities.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">2</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Utility-First
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Build complex components from a constrained set of primitive utilities.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">3</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Fast Development
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Rapidly build modern websites without leaving your HTML.
          </p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
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
          <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
            Outline Button
          </button>
        </div>
      </div>

      {/* Typography Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Typography Examples
        </h2>
        <div className="space-y-4">
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            Extra Large Heading
          </p>
          <p className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
            Large Heading
          </p>
          <p className="text-2xl font-medium text-gray-700 dark:text-gray-200">
            Medium Heading
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Regular text with some content
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Small text for captions or footnotes
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Extra small text
          </p>
        </div>
      </div>

      {/* Badges and Tags */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Badges & Tags
        </h2>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            Primary Badge
          </span>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            Success Badge
          </span>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            Warning Badge
          </span>
          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            Danger Badge
          </span>
          <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold">
            Info Badge
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            Secondary Badge
          </span>
        </div>
      </div>
    </>
  );
};