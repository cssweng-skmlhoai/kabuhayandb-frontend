import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ReportDropdown = ({ onSelectReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Select Due Report');

  const reports = ['Monthly Due Report', 'Unpaid Due Report'];

  const handleSelect = (report) => {
    setSelected(report);
    setIsOpen(false);
    onSelectReport(report);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-700 text-white px-4 py-3 rounded flex items-center justify-between hover:bg-slate-600 transition-colors"
      >
        <span className="text-sm">{selected}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10">
          {reports.map((report) => (
            <button
              key={report}
              onClick={() => handleSelect(report)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
            >
              {report}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportDropdown;