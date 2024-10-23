import express from 'express';
import multer from 'multer';
import { OpenAI } from 'openai';
import pdf from 'pdf-parse';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const upload = multer({ dest: 'uploads/' });
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

// Parse resume content
async function parseResume(file) {
  try {
    const dataBuffer = await fs.readFile(file.path);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume');
  }
}

// Analyze resume with GPT
async function analyzeResume(resumeText, jobDescription) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert HR professional analyzing resumes against job descriptions. Provide detailed analysis with a match percentage and key skills identified."
        },
        {
          role: "user",
          content: `Please analyze this resume against the job description. Resume: ${resumeText}\n\nJob Description: ${jobDescription}\n\nProvide: 1. Match percentage (0-100) 2. Key skills identified 3. Brief explanation of match`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = response.choices[0].message.content;
    return parseAnalysis(analysis);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
}

// Parse GPT response into structured format
function parseAnalysis(analysis) {
  // Extract match percentage using regex
  const matchPercentage = analysis.match(/\d{1,3}%/) || ['0%'];
  const percentage = parseInt(matchPercentage[0]);

  // Extract skills (assuming they're listed with bullets or in a list)
  const skillsMatch = analysis.match(/skills identified:.*?((?:\n|$))/i);
  const skills = skillsMatch ? 
    skillsMatch[0]
      .toLowerCase()
      .replace(/skills identified:/i, '')
      .split(/[,.]/)
      .map(skill => skill.trim())
      .filter(Boolean) : 
    [];

  return {
    match: percentage,
    skills,
    analysis: analysis
  };
}

// Upload and analyze resumes endpoint
app.post('/api/analyze', upload.array('resumes'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: 'No job description provided' });
    }

    const results = [];
    for (const file of files) {
      const resumeText = await parseResume(file);
      const analysis = await analyzeResume(resumeText, jobDescription);
      
      results.push({
        id: file.filename,
        name: file.originalname,
        ...analysis
      });

      // Clean up uploaded file
      await fs.unlink(file.path);
    }

    // Sort results by match percentage
    results.sort((a, b) => b.match - a.match);

    // Return top 5 matches
    res.json(results.slice(0, 5));
  } catch (error) {
    console.error('Error processing resumes:', error);
    res.status(500).json({ error: 'Failed to process resumes' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});