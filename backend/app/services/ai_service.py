import google.generativeai as genai
import os
import json
import asyncio
import fitz  # PyMuPDF
from typing import Any, Dict, List
from app.utils.logger import setup_logger

logger = setup_logger('ai_service')

class AIService:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def analyze_resume(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """
        Parses the resume, optimizes it for the job description, and returns structured JSON.
        """
        logger.info("🔍 Analyzing resume and job description with ADVANCED structured output...")

        if not self.model:
            raise ValueError("AI model not available.")

        try:
            prompt = f"""
            You are an expert resume parser and career coach. Your task is to intelligently transform a raw resume text, which may have OCR errors or inconsistent formatting, into a structured, optimized JSON object tailored for a specific job description.

            **Core Instructions:**

            1.  **INTELLIGENT PARSING:**
                *   Read the entire `RESUME` text. Act like a human expert to deduce the structure.
                *   Differentiate between professional `experience` (jobs at companies) and `projects` (personal, freelance, or academic work). A GitHub link often indicates a project.
                *   Correctly group all bullet points under their respective job or project.
                *   Ignore OCR artifacts and placeholder text like "Unspecified".

            2.  **ANALYZE & OPTIMIZE:**
                *   Scrutinize the `JOB DESCRIPTION` for key skills, technologies, and qualifications.
                *   Rewrite the content for each section to align with the job description. Emphasize quantifiable achievements (e.g., "reduced workflow to 5-7 minutes") and use strong action verbs. Weave in keywords from the job description naturally.
                *   Ensure every bullet point from the original resume is represented and optimized in the final output.

            3.  **FORMAT OUTPUT:**
                *   You MUST provide a single, valid JSON object as your response.
                *   Do NOT include markdown formatting (e.g., ```json), comments, or any text outside of the JSON structure.

            **RESUME TEXT:**
            ---
            {resume_text}
            ---

            **JOB DESCRIPTION:**
            ---
            {job_description}
            ---

            **JSON OUTPUT STRUCTURE (Strictly follow this):**
            {{
                "analysis": "A brief, 2-3 sentence analysis of the original resume's strengths and weaknesses against the job description.",
                "overall_match_score": "An integer score from 0-100 representing how well the optimized resume matches the job.",
                "key_improvement_areas": ["A list of the most critical improvements you made."],
                "optimized_resume_data": {{
                    "name": "Full Name",
                    "contact_info": {{
                        "location": "City, Country",
                        "email": "email@address.com",
                        "phone": "+123456789",
                        "linkedin": "linkedin.com/in/username",
                        "github": "github.com/username"
                    }},
                    "summary": "The rewritten, optimized summary.",
                    "experience": [
                        {{
                            "title": "Job Title",
                            "company": "Company Name",
                            "location": "City, USA",
                            "dates": "Month Year - Month Year or Present",
                            "description": ["Optimized bullet point 1.", "Optimized bullet point 2."]
                        }}
                    ],
                    "projects": [
                        {{
                            "name": "Project Name | Technologies Used",
                            "dates": "Month Year - Month Year",
                            "link": "github.com/link/to/project",
                            "description": ["Optimized bullet point 1.", "Optimized bullet point 2."]
                        }}
                    ],
                    "skills": {{
                        "AI & ML": ["Skill 1", "Skill 2"],
                        "Programming": ["Python", "JavaScript"],
                        "APIs & DBs": ["Stripe API", "PostgreSQL"]
                    }},
                    "education": [
                        {{
                            "degree": "Degree or Diploma Name",
                            "institution": "School or University Name",
                            "year": "Year of Completion"
                        }}
                    ],
                    "certifications": [
                        {{
                            "name": "Certification Name",
                            "issuer": "Issuing Body",
                            "year": "Year of Completion"
                        }}
                    ]
                }}
            }}
            """

            logger.info("📊 Generating structured optimization from AI (timeout: 300s)...")
            
            ai_task = self.model.generate_content_async(prompt)
            response = await asyncio.wait_for(ai_task, timeout=300.0)
            
            analysis = self._parse_analysis_response(response.text)
            logger.info(f"✅ Analysis complete - Match Score: {analysis.get('overall_match_score', 0)}%")
            return analysis
        
        except asyncio.TimeoutError:
            logger.error("❌ AI generation timed out after 300 seconds.")
            raise ValueError("The AI model took too long to respond. Please try again later.")
        except Exception as e:
            logger.error(f"❌ Analysis failed: {str(e)}")
            raise ValueError(f"AI analysis failed: {e}")

    def _extract_text_from_pdf(self, pdf_content: bytes) -> str:
        """Extract text from PDF content."""
        try:
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")

    def _parse_analysis_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse the AI analysis response into a structured format
        """
        cleaned_response = response_text.strip().strip('`').strip('json').strip()

        try:
            result = json.loads(cleaned_response)
            required_fields = ['analysis', 'overall_match_score', 'key_improvement_areas', 'optimized_resume_data']
            for field in required_fields:
                if field not in result:
                    raise ValueError(f"Missing required field in analysis: {field}")
            return result
        except Exception as e:
            logger.error(f"Error parsing analysis JSON: {str(e)}")
            raise ValueError(f"Could not parse AI response: {e}")