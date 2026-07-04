# Hugging Face Spaces (Docker SDK) deployment for the Mandhodhini FastAPI backend.
# Spaces require the app to listen on port 7860 and run as a non-root user.
FROM python:3.11-slim

RUN useradd -m -u 1000 user
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY --chown=user . /app
USER user

ENV PATH="/home/user/.local/bin:$PATH"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
