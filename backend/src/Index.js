import empRoute from './Routers/EmployeeRoute.js';
import proRoute from './Routers/ProjectRoute.js'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './Routers/UserRoute.js';
import TaskRoute from './Routers/TaskRoute.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import auth from './middleware/auth.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express()
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ProDb")
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

app.use(cors({
    origin: 'http://localhost:3000', // allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed methods
  credentials: true
}))

app.use(express.json());
app.use('/api/emp',empRoute)
app.use('/api/project',auth,proRoute)
app.use('/api/user',userRoute)
app.use('/api/task',auth,TaskRoute);
// Serve static files from the sibling folder `upload_Documents`
// The uploads folder used previously was inside backend; user wants sibling directory to backend
const uploadsSiblingDir = path.join(__dirname, '..', '..', 'upload_Documents');
// Ensure the directory exists (server will create on first upload if needed)
if (!fs.existsSync(uploadsSiblingDir)) {
  try {
    fs.mkdirSync(uploadsSiblingDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create upload_Documents folder:', err);
  }
}
// Expose the sibling folder at /api/upload (so frontend can fetch files at /api/upload/<filename>)
app.use('/api/upload', express.static(uploadsSiblingDir));
app.use(fileUpload({
  createParentPath: true
}));
app.post('/api/upload', (req, res) => {
  if (!req.files || !req.files.file) return res.status(400).send('No file uploaded.');

  const file = req.files.file;
  // Save uploaded files into the sibling upload_Documents directory
  const uploadDir = uploadsSiblingDir;
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  // Prevent path traversal by using basename
  const safeName = path.basename(file.name);
  const uploadPath = path.join(uploadDir, safeName);

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);
    // Return a URL that points to the static route exposed above
    // Note: the frontend should prefix with the server origin, e.g. http://localhost:3001/api/upload/<filename>
    res.json({ url: `/api/upload/${encodeURIComponent(safeName)}` });
  });
});
app.listen(process.env.PORT || 3001,()=>{
  console.info(`server started at ${process.env.PORT || 3001}`);
});