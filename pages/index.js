import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setStatus("Selecione um arquivo PDF primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setStatus(data.message || "Erro");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📄 Envio de Receitas</h1>
        <p style={styles.subtitle}>Farmácia</p>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />
        <button onClick={handleUpload} style={styles.button}>
          Enviar Arquivo
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#eafaf1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "24px",
    color: "#2e7d32",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "30px",
  },
  input: {
    marginBottom: "20px",
    display: "block",
    width: "100%",
  },
  button: {
    backgroundColor: "#43a047",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
  status: {
    marginTop: "20px",
    color: "#2e7d32",
    fontWeight: "bold",
  },
};
