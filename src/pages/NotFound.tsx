import { Player } from '@lottiefiles/react-lottie-player';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
    <Player
      autoplay
      loop
      src="https://lottie.host/f8bdcfe7-53e6-4a6b-ba3c-40811d49e572/JkKfWdLhU1.lottie"
      style={{ height: '300px', width: '300px' }}
    />
    <h1 className="text-4xl font-bold mt-6 mb-2 text-gray-800 dark:text-white">404 - Page Not Found</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">Go Home</Link>
  </div>
);

export default NotFound;
