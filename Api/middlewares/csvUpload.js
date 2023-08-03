const multer = require('multer');
const csvParser = require('csv-parser');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const csvUploadMiddleware = (req, res, next) => {
  upload.single('csvFile')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Error uploading CSV file.' });
    } else if (err) {
      return res.status(500).json({ error: 'Something went wrong.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file provided.' });
    }

    const csvData = [];
    const fileBuffer = req.file.buffer.toString();

    // Parse CSV data using csv-parser
    csvParser({ separator: ',' })
      .on('data', (data) => {
        csvData.push(data);
      })
      .on('end', () => {
        req.csvData = csvData;
        next();
      })
      .end(fileBuffer);
  });
};

module.exports = csvUploadMiddleware;