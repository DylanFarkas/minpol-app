from typing import List, Dict
import re

def parse_mzn_output(stdout: str) -> Dict:
    # Espera:
    # pol_int
    # 1
    # m líneas
    # 2
    # m líneas
    # 3
    # m líneas
    lines = [ln.strip() for ln in stdout.splitlines() if ln.strip() and ln.strip() != "----------"]
    pol_int = int(lines[0])
    # Encuentra bloques por etiquetas 1,2,3
    idx1 = lines.index("1")
    idx2 = lines.index("2")
    idx3 = lines.index("3")

    def read_matrix(start: int, end: int) -> List[List[int]]:
        mat = []
        for ln in lines[start:end]:
            mat.append([int(x.strip()) for x in ln.split(",")])
        return mat

    m = idx2 - (idx1 + 1)
    x1 = read_matrix(idx1 + 1, idx2)
    x2 = read_matrix(idx2 + 1, idx3)
    x3 = read_matrix(idx3 + 1, idx3 + 1 + m)

    return {
        "pol_int": pol_int,
        "pol_real": pol_int / 1000.0,
        "x_low": x1,
        "x_med": x2,
        "x_high": x3
    }

def extract_solver_stats(stderr: str) -> dict:
    stats = {}
    for line in stderr.splitlines():
        if "%%%mzn-stat:" in line:
            m = re.match(r".*%%%mzn-stat:\s*(\w+)\s*=\s*([0-9.]+)", line)
            if m:
                key, value = m.groups()
                stats[key] = float(value) if "." in value else int(value)
    return stats