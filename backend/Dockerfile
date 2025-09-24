# Stage 1: Build stage with system dependencies
FROM python:3.11-slim as builder

# Install system dependencies required by WeasyPrint
# This now uses the correct, updated package names for the Debian OS
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libffi-dev \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libgdk-pixbuf-2.0-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up a virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Stage 2: Final production stage
FROM python:3.11-slim as final

# Copy system libraries from the builder stage
COPY --from=builder /usr/lib/ /usr/lib/
COPY --from=builder /lib/ /lib/

# Copy the virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Set the working directory
WORKDIR /app

# Set up path to use the virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Set the start command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]