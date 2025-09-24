import io
from typing import Dict, Any
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML, CSS
from app.utils.logger import setup_logger

logger = setup_logger('pdf_service')

class PDFService:
    def __init__(self):
        """Initialize PDF service with Jinja2 and WeasyPrint."""
        try:
            self.env = Environment(loader=FileSystemLoader('templates'))
            logger.info("📄 PDF service initialized with Jinja2 and WeasyPrint")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Jinja2 environment: {e}")
            raise

    async def generate_resume_pdf(self, resume_data: Dict[str, Any]) -> bytes:
        """
        Generate a professional PDF from structured resume data using an HTML template.
        """
        logger.info("🔄 Starting PDF generation from template...")
        try:
            template = self.env.get_template('resume_template.html')
            html_out = template.render(data=resume_data)
            
            # WeasyPrint converts the rendered HTML to PDF bytes in memory
            pdf_bytes = HTML(string=html_out).write_pdf()
            
            if not pdf_bytes:
                raise ValueError("Generated PDF is empty.")

            logger.info(f"✅ PDF generated successfully: {len(pdf_bytes)} bytes")
            return pdf_bytes
            
        except Exception as e:
            logger.error(f"❌ PDF generation failed: {str(e)}")
            raise ValueError(f"Failed to generate PDF: {e}")