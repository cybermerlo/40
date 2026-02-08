import { Heart, Mountain, FileDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { openSummaryPrint } from '../../utils/exportSummary';

const Footer = () => {
  const { users, bookings, dayVisits, activities, scheduledActivities } = useApp();

  const handleExport = () => {
    openSummaryPrint({
      users,
      bookings,
      dayVisits,
      activities,
      scheduledActivities,
    });
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Mountain className="w-5 h-5" />
            <span className="text-sm">Compleanno di Manuel • 21 Febbraio 2026</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              title="Apri riepilogo stampabile (A4)"
            >
              <FileDown className="w-4 h-4" />
              <span>Riepilogo stampabile</span>
            </button>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>Fatto con</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>per gli amici. Quei poveracci.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
