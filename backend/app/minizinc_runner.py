import subprocess
import tempfile
import time
from pathlib import Path

def run_minizinc(model_path: Path, dzn_content: str, timeout_s: int = 30) -> str:
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)
        dzn_path = tmpdir / "DatosProyecto.dzn"
        dzn_path.write_text(dzn_content, encoding="utf-8")

        t0 = time.time()
        proc = subprocess.run(
            ["minizinc", "--solver", "Gecode", str(model_path), str(dzn_path)],
            capture_output=True,
            text=True,
            timeout=timeout_s,
        )
        dt_ms = int((time.time() - t0) * 1000)

        if proc.returncode != 0:
            raise RuntimeError(f"MiniZinc falló ({proc.returncode}).\nSTDERR:\n{proc.stderr}")

        # stdout es el output del modelo
        return proc.stdout, proc.stderr, dt_ms
