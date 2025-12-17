import subprocess
import tempfile
import time
import platform
from pathlib import Path
from shutil import which
from .models import extract_solver_stats

# =========================================================
# MiniZinc binary resolution (Windows / macOS / Linux)
# =========================================================

def get_minizinc_bin() -> str:
    system = platform.system()

    if system == "Darwin":  # macOS
        bin_path = "/Applications/MiniZincIDE.app/Contents/Resources/minizinc"
        if not Path(bin_path).exists():
            raise RuntimeError(
                "MiniZinc IDE no encontrado en macOS. "
                "Instala el bundle oficial (minizincide)."
            )
        return bin_path

    if system == "Windows":
        # En Windows el instalador oficial deja minizinc en PATH
        if which("minizinc") is None:
            raise RuntimeError(
                "MiniZinc no está en PATH en Windows. "
                "Verifica la instalación."
            )
        return "minizinc"

    if system == "Linux":
        if which("minizinc") is None:
            raise RuntimeError(
                "MiniZinc no está en PATH en Linux."
            )
        return "minizinc"

    raise RuntimeError(f"Sistema operativo no soportado: {system}")


MINIZINC_BIN = get_minizinc_bin()


# =========================================================
# MiniZinc runner
# =========================================================

def run_minizinc(
    model_path: Path,
    dzn_content: str,
    timeout_s: int = 1200,
):
    """
    Ejecuta MiniZinc de forma portable (Windows / macOS / Linux)
    usando Gecode cuando está disponible.

    Returns:
        stdout, stderr, elapsed_ms, stats
    """

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)

        # dzn_path = tmpdir / "DatosProyecto.dzn"
        # dzn_path.write_text(dzn_content, encoding="utf-8")

        dzn_path = Path("DatosProyecto.dzn")
        dzn_path.write_text(dzn_content, encoding="utf-8")

        t0 = time.time()

        proc = subprocess.run(
            [
                MINIZINC_BIN,
                "--solver", "gecode",
                "--solver-statistics",
                str(model_path),
                str(dzn_path),
            ],
            capture_output=True,
            text=True,
            timeout=timeout_s,
        )

        elapsed_ms = int((time.time() - t0) * 1000)

        if proc.returncode != 0:
            raise RuntimeError(
                f"MiniZinc falló (code {proc.returncode})\n"
                f"STDERR:\n{proc.stderr}"
            )

        stats = extract_solver_stats(proc.stdout + "\n" + proc.stderr)

        return proc.stdout, proc.stderr, elapsed_ms, stats