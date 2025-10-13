# ResumeAI Backend - Production Ready
# FastAPI + Python backend for resume optimization

import os
import logging
import base64
import json
import time
from datetime import datetime
from dotenv import load_dotenv
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Depends, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.services.ai_service import AIService
from app.utils.rate_limiter import rate_limit
from app.services.pdf_service import PDFService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

# Load environment variables
load_dotenv()

# Rate limiting configuration
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "3600"))  # 1 hour

# Initialize services
ai_service = AIService()
pdf_service = PDFService()

# FastAPI app
app = FastAPI(
    title="TailorHire AI API", # Updated brand name
    description="AI-powered resume optimization service",
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Enhanced configuration for production
allowed_origins_str = os.getenv(
    "ALLOWED_ORIGINS", 
    "https://www.tailoredhireresume.com,https://tailoredhireresume.com,http://localhost:3000"
)
origins = [origin.strip() for origin in allowed_origins_str.split(",")]
logger.info(f"🌐 CORS Origins configured: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"🔵 {request.method} {request.url.path} - Origin: {request.headers.get('origin', 'N/A')}")
    response = await call_next(request)
    logger.info(f"🟢 Response: {response.status_code}")
    return response

# ----------------------
# Pydantic Models
# ----------------------
class ResumeOptimizeRequest(BaseModel):
    resume_text: str
    job_description: str
    user_id: Optional[str] = None

class ResumeOptimizeResponse(BaseModel):
    optimized_resume_pdf_base64: str = Field(..., description="Base64 encoded string of the optimized PDF resume.")
    original_resume_text: str
    optimized_resume_json: Dict[str, Any]
    match_score: int
    key_changes: List[str]
    suggestions: List[str] = []
    processing_time: float

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str

# ----------------------
# Endpoints
# ----------------------

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.1.0"
    )

# Explicit OPTIONS handler for CORS preflight
@app.options("/api/{full_path:path}")
async def options_handler():
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.post("/api/optimize", response_model=ResumeOptimizeResponse)
async def optimize_resume(
    request: ResumeOptimizeRequest,
    user_ip: str = Depends(rate_limit)
):
    start_time = time.time()
    logger.info("🔵 Optimizing resume with template-based generation...")

    try:
        if not request.resume_text.strip() or not request.job_description.strip():
            raise HTTPException(status_code=400, detail="Resume text and job description cannot be empty.")

        # 1. Get structured analysis and optimized data from AI Service
        analysis = await ai_service.analyze_resume(request.resume_text, request.job_description)
        
        optimized_data = analysis.get("optimized_resume_data")
        if not optimized_data:
            raise HTTPException(status_code=500, detail="AI service failed to return optimized resume data.")

        # 2. Generate a new PDF using the template and the optimized data
        pdf_bytes = await pdf_service.generate_resume_pdf(optimized_data)

        # 3. Encode the PDF to base64 to send in JSON response
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')

        return ResumeOptimizeResponse(
            optimized_resume_pdf_base64=pdf_base64,
            original_resume_text=request.resume_text,
            optimized_resume_json=optimized_data,
            match_score=analysis.get("overall_match_score", 0),
            key_changes=analysis.get("key_improvement_areas", []),
            suggestions=analysis.get("suggestions", []),
            processing_time=time.time() - start_time
        )
    except HTTPException as he:
        # Re-raise known HTTP exceptions
        raise he
    except Exception as e:
        logger.error(f"❌ Optimization failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to optimize resume: {str(e)}")


@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...), user_ip: str = Depends(rate_limit)):
    try:
        logger.info(f"📤 Upload started: {file.filename} ({file.content_type})")

        if not file.filename:
            logger.warning("⚠️ No filename provided")
            raise HTTPException(status_code=400, detail="No file provided")

        if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
            logger.warning(f"⚠️ Invalid content type: {file.content_type}")
            raise HTTPException(status_code=400, detail="Only PDF and DOCX supported")

        resume_bytes = await file.read()
        logger.info(f"📄 File read successfully: {len(resume_bytes)} bytes")
        
        extracted_text = ai_service._extract_text_from_pdf(resume_bytes)
        logger.info(f"✅ Text extraction successful: {len(extracted_text)} characters")

        return {"text": extracted_text, "filename": file.filename, "length": len(extracted_text)}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"❌ Upload failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")

# ----------------------
# Startup
# ----------------------
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 TailorHire AI Backend starting up...") # Updated brand name
    logger.info(f"📊 Rate limiting: {RATE_LIMIT_REQUESTS} requests / {RATE_LIMIT_WINDOW}s")
    logger.info("✅ Backend ready to accept requests")
    logger.info("✅ PDF Service initialized")
    logger.info("✅ CORS configured")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")