% =========================
% Proyecto.mzn - MinPol
% =========================
include "globals.mzn";

int: n;
int: m;

array[1..m] of int: p;                  % opcional (derivable), pero lo aceptamos
array[1..m] of float: v;                % valores de opiniones
array[1..m, 1..3] of int: s;            % s[i,k] = personas en opinion i con resistencia k

int: ct;                                % costo max (asumimos entero)
int: maxMovs;                           % movimientos max (entero)

% -------------------------
% Factores de resistencia (escalados *2): baja=2, media=3, alta=4
% costo_real = costo_scaled / 2
% -------------------------
array[1..3] of int: alpha2 = [2,3,4];

% -------------------------
% Decisión: x[k,i,j]
% -------------------------
array[1..3, 1..m, 1..m] of var 0..n: x;

% -------------------------
% Conservación por i,k
% -------------------------
constraint
  forall(i in 1..m, k in 1..3) (
    sum(j in 1..m)(x[k,i,j]) = s[i,k]
  );

% -------------------------
% Distribución final pFinal[j]
% -------------------------
array[1..m] of var 0..n: pFinal;
constraint
  forall(j in 1..m)(
    pFinal[j] = sum(i in 1..m, k in 1..3)(x[k,i,j])
  );

% (Opcional) consistencia con p de entrada
constraint forall(i in 1..m)( p[i] = sum(k in 1..3)(s[i,k]) );
constraint sum(j in 1..m)(pFinal[j]) = n;

% -------------------------
% Movimientos (distancia total)
% -------------------------
var 0..(n*m*m): movs;
constraint
  movs = sum(k in 1..3, i in 1..m, j in 1..m)(
    x[k,i,j] * abs(i-j)
  );
constraint movs <= maxMovs;

% -------------------------
% Costo (escalado *2)
% -------------------------
var 0..(n*m*m*10): cost2;
constraint
  cost2 = sum(k in 1..3, i in 1..m, j in 1..m)(
    x[k,i,j] * abs(i-j) * alpha2[k]
  );
constraint cost2 <= 2*ct;

% -------------------------
% Mediana (asumimos v no-decreciente por índice)
% -------------------------
int: half = (n+1) div 2; % ceil(n/2)

array[1..m] of var 0..n: pref;
constraint pref[1] = pFinal[1];
constraint forall(t in 2..m)( pref[t] = pref[t-1] + pFinal[t] );

var 1..m: medIdx;
constraint pref[medIdx] >= half;
constraint (medIdx = 1) \/ (pref[medIdx-1] < half);

var float: medVal;
constraint medVal = v[medIdx];

% -------------------------
% Polarización (escalada x1000 para imprimir entero)
% -------------------------
int: SCALE = 1000;

array[1..m] of var float: dist;
constraint forall(j in 1..m)(
  dist[j] = abs(v[j] - medVal)
);

var float: pol;
constraint pol = sum(j in 1..m)( int2float(pFinal[j]) * dist[j] );

var int: pol_int;
constraint pol_int = round(pol * SCALE);

solve minimize pol_int;

% -------------------------
% Output 
% -------------------------
output [
  show(pol_int), "\n",
  "1\n",
  % resistencia baja (k=1)
  concat([ concat([ show(fix(x[1,i,j])) ++ if j<m then "," else "" endif | j in 1..m ]) ++ "\n" | i in 1..m ]),
  "2\n",
  concat([ concat([ show(fix(x[2,i,j])) ++ if j<m then "," else "" endif | j in 1..m ]) ++ "\n" | i in 1..m ]),
  "3\n",
  concat([ concat([ show(fix(x[3,i,j])) ++ if j<m then "," else "" endif | j in 1..m ]) ++ "\n" | i in 1..m ])
];