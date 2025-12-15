FROM python:3.11-slim

# Dependencias del sistema + MiniZinc
RUN apt-get update && apt-get install -y --no-install-recommends \
    minizinc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala deps Python
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código
COPY . /app

# Exponer API
EXPOSE 8000

# Ajusta el módulo si tu app no se llama "app"
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
