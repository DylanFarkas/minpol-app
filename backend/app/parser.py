from dataclasses import dataclass
from typing import List

@dataclass
class Instance:
    n: int
    m: int
    p: List[int]
    v: List[float]
    s: List[List[int]]  # m x 3
    ct: int
    maxMovs: int

def parse_instance_txt(text: str) -> Instance:
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    if len(lines) < 7:
        raise ValueError("Archivo inválido: faltan líneas.")

    n = int(lines[0])
    m = int(lines[1])

    p = [int(x.strip()) for x in lines[2].split(",")]
    v = [float(x.strip()) for x in lines[3].split(",")]

    s = []
    for i in range(m):
        row = [int(x.strip()) for x in lines[4+i].split(",")]
        if len(row) != 3:
            raise ValueError(f"Fila s[{i}] inválida: debe tener 3 valores.")
        s.append(row)

    ct = int(float(lines[4+m]))
    maxMovs = int(float(lines[5+m]))

    # Validaciones útiles
    if len(p) != m or len(v) != m:
        raise ValueError("p o v no tiene longitud m.")
    if sum(p) != n:
        raise ValueError(f"sum(p)={sum(p)} no coincide con n={n}.")
    for i in range(m):
        if sum(s[i]) != p[i]:
            raise ValueError(f"En opinión {i+1}: sum(s[i])={sum(s[i])} != p[i]={p[i]}")

    return Instance(n=n, m=m, p=p, v=v, s=s, ct=ct, maxMovs=maxMovs)

def to_dzn(inst: Instance) -> str:
    # s como array2d(1..m,1..3,[...]) en orden por filas
    flat = []
    for row in inst.s:
        flat.extend(row)

    flat_lines = ",\n  ".join(str(x) for x in flat)

    return f"""n = {inst.n};
m = {inst.m};
p = {inst.p};
v = {inst.v};
s = array2d(1..{inst.m}, 1..3, [
  {flat_lines}
]);
ct = {inst.ct};
maxMovs = {inst.maxMovs};
"""
