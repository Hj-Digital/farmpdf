import fs from "fs";
import path from "path";
import { useState } from "react";

export async function getServerSideProps() {
  const dir = path.resolve("./public/uploads");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];

  const metaPath = path.resolve("./public/uploads/meta.json");
  let metadata = {};

  if (fs.existsSync(metaPath)) {
    metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  }

  const sortedFiles = files.sort((a, b) => {
    const dateA = new Date(metadata[a] || 0);
    const dateB = new Date(metadata[b] || 0);
    return dateB - dateA; // mais recente primeiro
  });

  return { props: { files: sortedFiles, metadata } };
}

export default function Admin({ files, metadata }) {
  const [senha, setSenha] = useState("");
  const [acesso, setAcesso] = useState(false);

  const senhaCorreta = "hellen123";

  const formatarData = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {!acesso ? (
          <>
            <h1 style={styles.title}>🔒 Área Restrita</h1>
            <p style={styles.subtitle}>Acesso exclusivo para administradores</p>
            <input
              type="password"
              placeholder="Digite a senha"
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={() => setAcesso(senha === senhaCorreta)}
              style={styles.button}
            >
              Entrar
            </button>
          </>
        ) : (
          <>
            <h1 style={styles.title}>📂 Arquivos Enviados</h1>
            <ul style={styles.list}>
              {files.map((file) => (
                <li key={file} style={styles.listItem}>
                  <a
                    href={`/uploads/${file}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                  >
                    {file}
                  </a>
                  <span style={styles.date}>
                    {metadata[file] ? ` - ${formatarData(metadata[file])}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
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
    maxWidth: "500px",
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
    padding: "10px",
    width: "100%",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
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
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "20px",
    textAlign: "left",
  },
  listItem: {
    marginBottom: "10px",
  },
  link: {
    color: "#2e7d32",
    textDecoration: "none",
    fontWeight: "bold",
  },
  date: {
    marginLeft: "6px",
    color: "#666",
    fontSize: "14px",
  },
};
