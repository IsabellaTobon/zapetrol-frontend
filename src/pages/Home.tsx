import { useState } from "react";
import {
  getStationDetailsAPI,
  getStationHistoryAPI,
  getStationsByMunicipalityAPI,
  getStationsInRadiusAPI,
} from "../lib/api";

export default function Home() {
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async (testFn: () => Promise<unknown>, testName: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      console.log(`🧪 Probando: ${testName}`);
      const data = await testFn();
      console.log(`✅ ${testName} - Éxito:`, data);
      setResult(data);
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (err as Error).message;
      console.error(`❌ ${testName} - Error:`, errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h1>Pruebas de Endpoints de Estaciones</h1>
      <p>Haz clic en los botones para probar cada endpoint del backend</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
        <button
          onClick={() =>
            handleTest(
              () => getStationDetailsAPI(1234),
              "GET /estaciones/detalles/:id"
            )
          }
          disabled={loading}
        >
          🔍 Obtener Detalles de Estación (ID: 1234)
        </button>

        <button
          onClick={() =>
            handleTest(
              () => getStationHistoryAPI(1234, "2024-01-01", "2024-12-31"),
              "GET /estaciones/historico/:id"
            )
          }
          disabled={loading}
        >
          📊 Obtener Histórico de Estación (ID: 1234)
        </button>

        <button
          onClick={() =>
            handleTest(
              () => getStationsByMunicipalityAPI(1001),
              "GET /estaciones/municipio/:id"
            )
          }
          disabled={loading}
        >
          🏙️ Obtener Estaciones por Municipio (ID: 1001)
        </button>

        <button
          onClick={() =>
            handleTest(
              () => getStationsInRadiusAPI(40.4168, -3.7038, 5000, 1, 10),
              "GET /estaciones/radio"
            )
          }
          disabled={loading}
        >
          📍 Obtener Estaciones en Radio (Madrid, 5km)
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: "2rem", padding: "1rem", background: "#f0f0f0" }}>
          ⏳ Cargando...
        </div>
      )}

      {error && (
        <div style={{ marginTop: "2rem", padding: "1rem", background: "#ffe6e6", color: "#cc0000" }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result !== null && (
        <div style={{ marginTop: "2rem" }}>
          <h2>✅ Resultado:</h2>
          <pre style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
            maxHeight: "500px"
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
