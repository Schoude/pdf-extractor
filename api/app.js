const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfExtraction = require('./pdf-extraction');

const upload = multer();
const app = express();
const port = 4000;

app.use(cors());
app.options('*', cors());

app.use(upload.any());

app.get('/export', (req, res) => {
  fs.readdir('../export', (err, files) => {
    if (err) {
      res.status(500);
    }
    res.status(200);
    res.send({ files });
  });
});

app.post('/pdf', (req, res) => {
  const roomMatcher = new RegExp(req.body.roomMatcher, 'g');
  const sizeMatcher = new RegExp(req.body.sizeMatcher, 'g');
  const projectName = req.body.projectName;
  let csvHeaders = 'meta/de/name;number_of_rooms;area_size\n';

  try {
    pdfExtraction.extractFromPDFBlobs(
      req.files,
      roomMatcher,
      sizeMatcher,
      projectName,
      csvHeaders
    );

    res.status(200);
    res.send();
  } catch (error) {
    res.status(500);
    res.send();
  }

  csvHeaders = 'meta/de/name;number_of_rooms;area_size\n';
});

app.listen(port, () => {
  console.log(`PDF Extractor app listening at http://localhost:${port}`);
});
