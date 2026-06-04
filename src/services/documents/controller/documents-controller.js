import fs from "fs";
import path from "path";
import uploadDocument from "../storage/storage-config.js";

const uploadDir = "uploads/documents";

const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    ...(data && { data }),
  });
};

export const uploadDocumentController = (req, res, next) => {
  uploadDocument(req, res, async (err) => {
    if (err) {
      console.error("=== MULTER ERROR DETECTED ===", err);

      if (err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
          status: "failed",
          message: err.message,
        });
      }

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: "failed",
          message: "Ukuran berkas terlalu besar. Maksimal 5 MB.",
        });
      }

      return res.status(400).json({
        status: "failed",
        message: err.message || "Gagal memproses unggahan berkas.",
      });
    }

    if (!req.file) {
      console.log("=== REQ.FILE IS EMPTY ===");
      return res.status(400).json({
        status: "failed",
        message: "File is required",
      });
    }

    const { filename, originalname, size } = req.file;

    const responseData = {
      documentId: filename,
      filename: filename,
      originalName: originalname,
      size: size,
    };

    return sendSuccess(
      res,
      201,
      "Document uploaded successfully",
      responseData,
    );
  });
};

export const getAllDocuments = async (req, res, next) => {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const files = fs.readdirSync(uploadDir);

    const allFiles = files.map((file) => {
      const stat = fs.statSync(path.join(uploadDir, file));
      return {
        documentId: file,
        filename: file,
        originalName: file,
        size: stat.size,
      };
    });

    return sendSuccess(res, 200, "Documents retrieved successfully", {
      documents: allFiles,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  const { id } = req.params;
  const targetPath = path.join(uploadDir, id);

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({
      status: "failed",
      message: "Document not found",
    });
  }

  fs.unlinkSync(targetPath);
  return sendSuccess(res, 200, "Document deleted successfully");
};

export const viewDocumentById = async (req, res, next) => {
  const { id } = req.params;
  const targetPath = path.join(uploadDir, id);

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({
      status: "failed",
      message: "Document not found",
    });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${id}"`);

  const fileStream = fs.createReadStream(targetPath);
  fileStream.pipe(res);
};
