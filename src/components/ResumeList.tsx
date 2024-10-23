import React from 'react';
import { FileText, X } from 'lucide-react';

interface ResumeListProps {
  files: File[];
  onRemove: (index: number) => void;
}

const ResumeList: React.FC<ResumeListProps> = ({ files, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Uploaded Resumes</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {files.map((file, index) => (
          <li key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeList;