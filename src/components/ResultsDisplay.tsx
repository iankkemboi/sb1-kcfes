import React from 'react';
import { Award, CheckCircle } from 'lucide-react';

interface Result {
  id: number;
  name: string;
  match: number;
  skills: string[];
}

interface ResultsDisplayProps {
  results: Result[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">Top Matches</h2>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {results.map((result) => (
          <li key={result.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${result.match >= 90 ? 'bg-green-100' : 'bg-blue-100'}
                `}>
                  <span className={`
                    text-lg font-semibold
                    ${result.match >= 90 ? 'text-green-600' : 'text-blue-600'}
                  `}>
                    {result.match}%
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{result.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {result.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {result.match >= 90 && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsDisplay;