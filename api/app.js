const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { setupFloorsMap, extractFromPDFBlobs } = require('./pdf-extraction');

const mulipart = multer();
const app = express();
const port = 4000;

app.use(cors());
app.use(mulipart.any());

// website static files
app.use(express.static(__dirname + '/dist', { index: 'index.html' }));

app.get('/export', (req, res) => {
  fs.readdir('../export', (err, files) => {
    if (err) {
      res.status(500);
    }
    res.status(200);
    res.send({ files });
  });
});

app.get('/download/:fileName', (req, res) => {
  try {
    const file = fs.readFileSync(`../export/${req.params.fileName}`);
    res.status(200);
    res.send({ file });
  } catch (error) {
    res.status(404);
    res.send({ message: 'File not found' });
  }
});

app.get('/csv-preview/:fileName', async (req, res) => {
  try {
    const file = fs.readFileSync(`../export/${req.params.fileName}`, {
      encoding: 'utf8',
    });
    const partsRaw = file.split('\n').filter((row) => row !== '');
    const headers = partsRaw.shift().split(';');
    const rows = partsRaw.map((rowRaw) => rowRaw.split(';'));

    res.status(200);
    res.send({ headers, rows });
  } catch (error) {
    res.status(404);
    res.send({ message: 'File not found' });
  }
});

app.post('/pdf', async (req, res) => {
  let status;
  const roomMatcher = new RegExp(req.body.roomMatcher, 'g'),
    sizeMatcher = new RegExp(req.body.sizeMatcher, 'g'),
    projectName = req.body.projectName,
    floorGuids = req.body.floorGuidString.split('\n'),
    floorsMap = setupFloorsMap(floorGuids);

  try {
    await extractFromPDFBlobs(
      req.files,
      roomMatcher,
      sizeMatcher,
      projectName,
      floorsMap
    );

    status = 200;
  } catch (error) {
    status = 500;
  } finally {
    res.status(status);
    res.send();
  }
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

app.delete('/delete/:filename', (req, res) => {
  if (process.version.includes('v12')) {
    fs.unlink(`../export/${req.params.filename}`, (err) => {
      if (err) {
        res.status(500);
        res.send();
      }
      res.status(200);
      res.send();
    });
  } else {
    fs.rm(`../export/${req.params.filename}`, (err) => {
      if (err) {
        res.status(500);
        res.send();
      }
      res.status(200);
      res.send();
    });
  }
});

// SPA routing
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, () => {
  console.log(`PDF Extractor app listening at http://localhost:${port}`);
});
