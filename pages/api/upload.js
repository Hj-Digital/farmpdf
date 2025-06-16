import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const uploadDir = path.resolve("./public/uploads");
  const metaPath = path.resolve("./public/uploads/meta.json");

  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      return part.originalFilename || `${Date.now()}${ext}`;
    },
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Erro no upload" });

    const fileData = files.file;

    const oldPath = fileData.filepath;
    const originalName = fileData.originalFilename || fileData.newFilename;
    const newPath = path.join(uploadDir, originalName);

    fs.renameSync(oldPath, newPath);

    let metadata = {};
    if (fs.existsSync(metaPath)) {
      metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    }

    metadata[originalName] = new Date().toISOString();
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

    res.status(200).json({ message: "Upload realizado com sucesso!" });
  });
}
