const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const File = require("./models/file.model");

const app = express();
app.use(cors());
app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

mongoose.connect(
  "mongodb+srv://ashritha04:chinki%402004@cluster0.jbqlq.mongodb.net/ashritha",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" MongoDB Connection Error:", err));

app.use("/uploads", express.static("uploads"));

app.post("/file", upload.single("file"), async (req, res) => {
  try {
    
    

    const { username, filename } = req.body;
    const { originalname, path, size, mimetype } = req.file;

    

    const file = new File({
      username,
      filename,
      originalName: originalname,
      path,
      size,
      mimetype,
    });

    await file.save();
    res.json({ message: "File uploaded successfully!", file });
  } catch (err) {
    console.error(" Error uploading file:", err);
    res.status(500).json({ error: " Failed to upload file." });
  }
});

app.get("/getfile", async (req, res) => {
  try {
    const files = await File.find();
   
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files." });
  }
});


app.listen(7778, () => console.log(" Server running on port 7778"));
