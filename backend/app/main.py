from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from .parser import parse_instance_txt, to_dzn
from .minizinc_runner import run_minizinc
from .models import parse_mzn_output

app = FastAPI(title="MinPol API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = Path(__file__).resolve().parent.parent / "Proyecto.mzn"

@app.post("/api/instances/preview")
async def preview_instance(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".txt"):
        raise HTTPException(status_code=400, detail="Debe subir un archivo .txt")
    text = (await file.read()).decode("utf-8", errors="replace")
    try:
        inst = parse_instance_txt(text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"raw_text": text, "parsed": inst.__dict__}

@app.post("/api/instances/solve")
async def solve_instance(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".txt"):
        raise HTTPException(status_code=400, detail="Debe subir un archivo .txt")
    text = (await file.read()).decode("utf-8", errors="replace")
    try:
        inst = parse_instance_txt(text)
        dzn = to_dzn(inst)
        stdout, stderr, time_ms = run_minizinc(MODEL_PATH, dzn, timeout_s=30)
        result = parse_mzn_output(stdout)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "input": inst.__dict__,
        "dzn": dzn,
        "result": result,
        "time_ms": time_ms,
        "stderr": stderr,
    }
