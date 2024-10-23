import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const analyzeResumes = async (files: File[], jobDescription: string) => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('resumes', file);
  });
  
  formData.append('jobDescription', jobDescription);

  try {
    const response = await axios.post(`${API_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing resumes:', error);
    throw new Error('Failed to analyze resumes');
  }
};