const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:10000',
  'https://secure-file-tranfer.onrender.com'
];

// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Define allowed file types and their MIME types
const allowedFileTypes = {
  // Images
  'image/jpeg': { ext: '.jpg', mime: 'image/jpeg' },
  'image/png': { ext: '.png', mime: 'image/png' },
  'image/gif': { ext: '.gif', mime: 'image/gif' },
  // Documents
  'application/pdf': { ext: '.pdf', mime: 'application/pdf' },
  'application/msword': { ext: '.doc', mime: 'application/msword' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    ext: '.docx',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  'text/plain': { ext: '.txt', mime: 'text/plain' },
  // Audio
  'audio/mpeg': { ext: '.mp3', mime: 'audio/mpeg' },
  'audio/wav': { ext: '.wav', mime: 'audio/wav' },
  // Video
  'video/mp4': { ext: '.mp4', mime: 'video/mp4' },
  'video/quicktime': { ext: '.mov', mime: 'video/quicktime' },
  'video/x-msvideo': { ext: '.avi', mime: 'video/x-msvideo' }
};

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueCode = nanoid(8);
    // Get file extension from mime type or original filename
    const fileType = allowedFileTypes[file.mimetype];
    const fileExtension = fileType ? fileType.ext : path.extname(file.originalname);
    const filename = `${uniqueCode}${fileExtension}`;
    console.log('Generated filename:', filename, 'Mime type:', file.mimetype);
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  console.log('Checking file type:', file.mimetype);
  // Check if the file type is allowed
  if (allowedFileTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Supported types: Images, Videos, Audio, PDF, and Documents'), false);
  }
};

// Configure multer with file size limits and filters
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Store file codes and their details in memory
const fileStore = new Map();

// Dosyanın ömrü (1 saat = 60 * 60 * 1000 milisaniye)
const FILE_LIFETIME = 1 * 60 * 60 * 1000;

// Her 1 dakikada bir kontrol et
setInterval(() => {
  const now = Date.now();
  console.log('🧹 Temizlik kontrolü yapılıyor...');

  fileStore.forEach((value, key) => {
    // Eğer dosya süresi dolmuşsa
    if (now - new Date(value.uploadDate).getTime() > FILE_LIFETIME) {
      console.log(`🗑️ Süresi dolan dosya siliniyor: ${value.filename} (${key})`);

      // 1. Dosyayı diskten sil
      if (fs.existsSync(value.path)) {
        fs.unlink(value.path, (err) => {
          if (err) console.error(`Dosya silinemedi: ${err}`);
          else console.log('Dosya diskten silindi.');
        });
      }

      // 2. Dosyayı hafıza kaydından (Map) sil
      fileStore.delete(key);
    }
  });
}, 60 * 1000); // 60 saniyede bir çalışır

// Upload endpoint
app.post('/upload', (req, res) => {
  upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum size is 100MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const code = path.parse(req.file.filename).name;
      const filePath = path.join(uploadsDir, req.file.filename);

      if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: 'File not saved correctly' });
      }

      const fileType = allowedFileTypes[req.file.mimetype];
      fileStore.set(code, {
        filename: req.file.originalname,
        path: filePath,
        uploadDate: new Date(),
        mimetype: fileType ? fileType.mime : req.file.mimetype,
        size: req.file.size
      });

      console.log('File stored:', {
        code,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: `${(req.file.size / (1024 * 1024)).toFixed(2)}MB`
      });

      res.json({ code });
    } catch (error) {
      console.error('Error in upload:', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  });
});

// Download endpoint
app.get('/download/:code', (req, res) => {
  try {
    const { code } = req.params;
    console.log('Download requested for code:', code);

    const fileInfo = fileStore.get(code);
    if (!fileInfo) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (!fs.existsSync(fileInfo.path)) {
      fileStore.delete(code);
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Ensure we have the correct mime type
    const contentType = fileInfo.mimetype || 'application/octet-stream';
    console.log('File info:', {
      filename: fileInfo.filename,
      mimetype: contentType,
      size: fileInfo.size
    });

    // Set headers for proper file download
    res.setHeader('Content-Type', contentType);
    // Use encodeURIComponent to handle special characters in filename
    const safeFilename = encodeURIComponent(fileInfo.filename);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${safeFilename}; filename="${fileInfo.filename}"`
    );
    res.setHeader('Content-Length', fileInfo.size);

    // Stream the file
    const fileStream = fs.createReadStream(fileInfo.path);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Delete file after successful download
      fs.unlink(fileInfo.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        } else {
          console.log('File deleted successfully:', fileInfo.path);
        }
      });
      fileStore.delete(code);
      console.log('Download completed and file cleaned up');
    });

    fileStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ error: 'Error downloading file' });
    });
  } catch (error) {
    console.error('Error in download:', error);
    res.status(500).json({ error: 'Error downloading file' });
  }
});

// Statik dosyaları serve et
app.use(express.static(path.join(__dirname, '../client/dist')));

// Tüm route'ları client app'e yönlendir
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// --- SERVER KEEPER (UYANIK TUTUCU) ---
const https = require('https');

// Kendi Render URL'ini buraya yazmalısın!
// ÖRNEK: const RENDER_URL = 'https://secure-file-transfer.onrender.com';
const RENDER_URL = 'https://file-tranfer-web-interface.onrender.com/';

function keepAlive() {
  if (RENDER_URL.includes('localhost')) return; // Localde çalışmasın

  https.get(RENDER_URL, (res) => {
    console.log(`☕ Keep-Alive Ping gönderildi. Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`Keep-Alive Hatası: ${e.message}`);
  });
}

// 14 dakikada bir ping at (Render 15 dk'da uyutuyor)
// 14 * 60 * 1000 = 840000 ms
setInterval(keepAlive, 840000);