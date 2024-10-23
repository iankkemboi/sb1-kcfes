import React from 'react';
import { Briefcase } from 'lucide-react';

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Briefcase className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-medium text-gray-900">Job Description</h2>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter the job description here..."
        className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};

export default JobDescription;