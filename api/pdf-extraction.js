const pdf = require('pdfjs-dist/es5/build/pdf');
const fs = require('fs');
let csvHeaders = 'meta/de/name;number_of_rooms;area_size\n';

const extractFromPDFBlobs = (files, roomMatcher, sizeMatcher, projectName) => {
  files.forEach((file) => {
    const loadingTask = pdf.getDocument(file.buffer);
    loadingTask.promise.then((doc) => {
      doc.getPage(1).then(async (page) => {
        const txt = await page.getTextContent();
        const roomData = txt.items.find((item) => roomMatcher.test(item.str));
        const room = roomData.str
          .split('|')
          .find((item) => roomMatcher.test(item))
          .trim()
          .split(' ')[0];
        const size = txt.items[
          txt.items.findIndex((item) => sizeMatcher.test(item.str)) + 1
        ].str.replace(',', '.');
        csvHeaders = csvHeaders.concat(
          `${file.originalname.split('.pdf')[0]};${room};${size}\n`
        );
        saveToCSC(csvHeaders, projectName);
      });
    });
  });
  csvHeaders = 'meta/de/name;number_of_rooms;area_size\n';
};

const saveToCSC = (csvHeaders, projectName) => {
  if (!fs.existsSync('../export')) {
    fs.mkdirSync('../export');
  }

  fs.writeFile(
    `../export/${projectName}-units.csv`,
    csvHeaders,
    'utf8',
    (err) => {
      if (err) throw err;
      console.log(`The file "${projectName}-units.csv" has been saved!`);
    }
  );
};

module.exports = {
  extractFromPDFBlobs,
};
