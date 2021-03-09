const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { setupFloorsMap, extractFromPDFBlobs } = require('./pdf-extraction');

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

  const floorGuids = [
    'f07d83ac-4cb3-4dba-8e6d-68111609ae2f',
    'd4656ce9-3137-46c7-b386-b2b67f4c673e',
    '74e9cf9b-9ec6-4d57-a26a-580dd1562d52',
    'b18e2bf6-0559-404a-ab11-155c6d30d278',
    '2140f5e6-8dfc-430a-ab75-b2f858a3c2f7',
    'be1d7218-1e3d-432e-9567-dcb69fb2150b',
  ];

  const floorsMap = setupFloorsMap(floorGuids);

  try {
    extractFromPDFBlobs(
      req.files,
      roomMatcher,
      sizeMatcher,
      projectName,
      floorsMap
    );

    setTimeout(() => {
      const file = fs.readFileSync(`../export/${projectName}-units.csv`);
      res.status(200);
      res.send({ file });
    }, 5000);
  } catch (error) {
    res.status(500);
    res.send();
  }

  csvHeaders = 'meta/de/name;number_of_rooms;area_size\n';
});

app.post('/export/delete-all', (req, res) => {
  fs.readdir('../export', (err, files) => {
    if (err) {
      res.status(500);
      res.send();
    }

    files.forEach((file) => {
      // Node 12.x fs.unlink
      // Node 14.x fs.rm
      if (process.version.includes('v12')) {
        fs.unlink(`../export/${file}`, (err) => {
          if (err) {
            res.status(500);
            res.send();
          }
          res.status(200);
          res.send();
        });
      } else {
        fs.rm(`../export/${file}`, (err) => {
          if (err) {
            res.status(500);
            res.send();
          }
          res.status(200);
          res.send();
        });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`PDF Extractor app listening at http://localhost:${port}`);
});
