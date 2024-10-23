import React, { useState } from 'react';
import { Upload, FileText, Briefcase, Search, Award } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import ResumeList from './components/ResumeList';
import JobDescription from './components/JobDescription';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeResumes } from './api';
import { Result } from './types';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    toast.success(`${acceptedFiles.length} files uploaded successfully`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const handleScreening = async () => {
    if (files.length === 0) {
      toast.error('Please upload some resumes first');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setIsProcessing(true);
    try {
      const analysisResults = await analyzeResumes(files, jobDescription);
      setResults(analysisResults);
      toast.success('Resume screening completed!');
    } catch (error) {
      toast.error('Failed to analyze resumes. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Resume Screener</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{files.length} resumes uploaded</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column - Upload and Job Description */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag & drop resumes here, or click to select files
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PDF, DOC, DOCX
              </p>
            </div>

            {/* Job Description Input */}
            <JobDescription
              value={jobDescription}
              onChange={setJobDescription}
            />

            {/* Action Button */}
            <button
              onClick={handleScreening}
              disabled={isProcessing}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <Search className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Search className="mr-2 h-5 w-5" />
                  Screen Resumes
                </span>
              )}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {results.length > 0 ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Award className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Results Yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload resumes and add a job description to start screening
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resume List */}
        {files.length > 0 && (
          <div className="mt-8">
            <ResumeList files={files} onRemove={(index) => {
              setFiles(files.filter((_, i) => i !== index));
              toast.success('Resume removed');
            }} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;