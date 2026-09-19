# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements.txt .

# Increase pip timeout and add retries for unstable network connections
RUN pip install --no-cache-dir \
    --default-timeout=1000 \
    --retries=10 \
    --user -r requirements.txt

# Stage 2: Minimal runtime
FROM python:3.11-slim

WORKDIR /app

# Copy only the installed Python packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]