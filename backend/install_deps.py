# Quick installation script for missing dependencies
import subprocess
import sys

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

if __name__ == "__main__":
    dependencies = {
        "reportlab": "reportlab==4.0.7",
        "dotenv": "python-dotenv==1.0.0",
        "jinja2": "Jinja2==3.1.3",
        "weasyprint": "WeasyPrint==62.1"
    }

    for lib, package in dependencies.items():
        try:
            __import__(lib)
            print(f"✅ {lib} already installed")
        except ImportError:
            print(f"📦 Installing {lib}...")
            install_package(package)
            print(f"✅ {lib} installed successfully")
    
    print("\n🎉 All dependencies ready!")
    print("Now run: uvicorn main:app --reload")