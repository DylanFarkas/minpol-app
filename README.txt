================================================================================
                    MINPOL-APP - APLICACIÓN DE OPTIMIZACIÓN
                        Sistema de Resolución con MiniZinc
================================================================================

DESCRIPCIÓN DEL PROYECTO
-------------------------
Esta aplicación es un sistema completo para la resolución de problemas de 
optimización utilizando MiniZinc. Consiste en un backend desarrollado en 
FastAPI (Python) y un frontend desarrollado en React con Vite. La aplicación 
permite cargar archivos de instancias .txt, visualizar los datos parseados y 
resolver los problemas de optimización.


ESTRUCTURA DE ARCHIVOS
-----------------------

1. ARCHIVOS RAÍZ
   ├── docker-compose.yml          - Configuración de Docker Compose para 
   │                                  orquestar backend y frontend
   └── README.txt                   - Este archivo

2. DIRECTORIO: backend/
   Contiene todo el código del servidor API
   
   ├── Dockerfile                   - Imagen Docker del backend
   ├── requirements.txt             - Dependencias Python (FastAPI, uvicorn, etc.)
   ├── Proyecto.mzn                 - Modelo MiniZinc principal
   ├── DatosProyecto.dzn            - Archivo de datos de ejemplo MiniZinc
   │
   └── app/                         - Código fuente de la aplicación
       ├── main.py                  - API FastAPI con endpoints /api/instances
       ├── parser.py                - Parser para archivos .txt a formato DZN
       ├── minizinc_runner.py       - Ejecutor de modelos MiniZinc
       ├── models.py                - Modelos de datos y parser de salida
       └── __pycache__/             - Archivos Python compilados (cache)

3. DIRECTORIO: ProyectoGUIFuentes/
   Contiene el código del frontend React
   
   ├── Dockerfile                   - Imagen Docker del frontend
   ├── package.json                 - Dependencias Node.js (React, Vite, Tailwind)
   ├── vite.config.js               - Configuración de Vite
   ├── eslint.config.js             - Configuración de ESLint
   ├── index.html                   - HTML principal
   ├── README.md                    - Documentación del frontend
   │
   ├── public/                      - Archivos públicos estáticos
   │
   └── src/                         - Código fuente React
       ├── main.jsx                 - Punto de entrada de React
       ├── App.jsx                  - Componente principal
       ├── index.css                - Estilos globales (Tailwind)
       │
       ├── api/
       │   └── api.js               - Cliente API para comunicación con backend
       │
       ├── assets/                  - Recursos (imágenes, iconos)
       │
       ├── components/              - Componentes React
       │   ├── Badge.jsx            - Componente badge para etiquetas
       │   ├── Card.jsx             - Componente card contenedor
       │   ├── InputPreview.jsx     - Vista previa de archivos cargados
       │   ├── ResultView.jsx       - Visualización de resultados
       │   ├── ThemeToggle.jsx      - Toggle para modo claro/oscuro
       │   └── UploadPanel.jsx      - Panel de carga de archivos
       │
       └── hooks/
           └── useTheme.js          - Hook personalizado para temas

4. DIRECTORIOS DE DATOS
   ├── DatosProyecto/               - Directorio para datos del proyecto
   └── MisInstancias/               - Directorio para instancias de usuario


TECNOLOGÍAS UTILIZADAS
-----------------------

Backend:
  - Python 3.x
  - FastAPI (framework web)
  - Uvicorn (servidor ASGI)
  - MiniZinc (solver de optimización)
  - Pydantic (validación de datos)

Frontend:
  - React 19.2.0
  - Vite 7.2.4 (build tool)
  - Tailwind CSS 4.1.18 (estilos)
  - Axios (cliente HTTP)
  - Lucide React (iconos)

DevOps:
  - Docker & Docker Compose
  - ESLint (linting)


REQUISITOS PREVIOS
------------------
Para ejecutar esta aplicación necesitas tener instalado:

1. Docker Desktop (recomendado) - https://www.docker.com/products/docker-desktop
   O alternativamente:
2. Python 3.8 o superior + pip
3. Node.js 18 o superior + npm
4. MiniZinc 2.6 o superior (para ejecución sin Docker)


================================================================================
                        INSTRUCCIONES DE EJECUCIÓN
================================================================================

OPCIÓN 1: EJECUTAR CON DOCKER COMPOSE (RECOMENDADO)
----------------------------------------------------

Esta es la forma más sencilla de ejecutar la aplicación completa.

1. Abrir una terminal en el directorio raíz del proyecto:
   cd c:\Users\Equipo\Desktop\minpol-app

2. Iniciar los contenedores:
   docker-compose up --build

3. Acceder a la aplicación:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Documentación API: http://localhost:8000/docs

4. Para detener la aplicación:
   Presionar Ctrl+C en la terminal
   
5. Para detener y eliminar los contenedores:
   docker-compose down


OPCIÓN 2: EJECUTAR MANUALMENTE (DESARROLLO)
--------------------------------------------

A. INICIAR EL BACKEND

1. Abrir una terminal y navegar al directorio backend:
   cd c:\Users\Equipo\Desktop\minpol-app\backend

2. Crear y activar un entorno virtual (opcional pero recomendado):
   python -m venv venv
   .\venv\Scripts\activate

3. Instalar las dependencias:
   pip install -r requirements.txt

4. Instalar MiniZinc:
   - Descargar desde: https://www.minizinc.org/
   - Agregar al PATH del sistema

5. Iniciar el servidor:
   uvicorn app.main:app --reload --port 8000

6. El backend estará disponible en:
   http://localhost:8000


B. INICIAR EL FRONTEND

1. Abrir una NUEVA terminal y navegar al directorio frontend:
   cd c:\Users\Equipo\Desktop\minpol-app\ProyectoGUIFuentes

2. Instalar las dependencias (solo la primera vez):
   npm install

3. Iniciar el servidor de desarrollo:
   npm run dev

4. El frontend estará disponible en:
   http://localhost:5173


USO DE LA APLICACIÓN
---------------------

1. Abrir el navegador en http://localhost:5173

2. Cargar un archivo de instancia (.txt):
   - Hacer clic en "Cargar Archivo" o arrastrar un archivo
   - Los archivos deben estar en formato .txt con la estructura esperada

3. Vista Previa:
   - Al cargar, se mostrará una vista previa de los datos parseados
   - Verificar que los datos se hayan interpretado correctamente

4. Resolver:
   - Hacer clic en "Resolver" para ejecutar MiniZinc
   - Esperar los resultados de la optimización
   - Los resultados mostrarán la solución encontrada

5. Modo Oscuro/Claro:
   - Usar el toggle en la esquina superior derecha para cambiar el tema


ENDPOINTS DE LA API
--------------------

POST /api/instances/preview
  - Descripción: Vista previa de una instancia sin resolver
  - Body: multipart/form-data con archivo .txt
  - Respuesta: JSON con texto raw y datos parseados

POST /api/instances/solve
  - Descripción: Resolver una instancia de optimización
  - Body: multipart/form-data con archivo .txt
  - Respuesta: JSON con input, DZN generado, y resultado de MiniZinc


FORMATO DE ARCHIVOS DE ENTRADA
-------------------------------

Los archivos .txt deben seguir el formato esperado por el parser.
Ver ejemplos en el directorio DatosProyecto/ o MisInstancias/


NOTAS ADICIONALES
-----------------

- El backend incluye documentación interactiva de la API en /docs (Swagger)
- La aplicación incluye recarga automática en modo desarrollo
- Los archivos de cache de Python (__pycache__) se generan automáticamente
- El directorio node_modules/ del frontend se genera al ejecutar npm install
- Los tiempos de resolución dependen de la complejidad de la instancia


================================================================================
                            FIN DEL DOCUMENTO
================================================================================
