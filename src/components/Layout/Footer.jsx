import { Heart, Mountain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Mountain className="w-5 h-5" />
            <span className="text-sm">Compleanno di Manuel • 21 Febbraio 2026</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>Fatto con</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>per gli amici. Quei poveracci.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
