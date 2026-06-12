import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="text-center space-y-6">
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 drop-shadow-sm">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="pt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 dark:text-gray-900 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20"
          >
            Return to Home
          </Link>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/10 dark:bg-yellow-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    </div>
  );
}
