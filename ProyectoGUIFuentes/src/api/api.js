import axios from "axios";

// Creamos una instancia para centralizar config
const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Manejo de errores consistente
function extractError(error) {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return "Error desconocido en la API";
}

// ---------- PREVIEW ----------
export async function previewTxt(file) {
  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await api.post("/instances/preview", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
}

// ---------- SOLVE ----------
export async function solveTxt(file) {
  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await api.post("/instances/solve", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
}
