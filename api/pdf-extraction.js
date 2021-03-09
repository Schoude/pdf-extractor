const pdf = require('pdfjs-dist/es5/build/pdf');
const fs = require('fs');
let csvHeaders = 'meta/de/name;number_of_rooms;area_size\n';

const extractFromPDFBlobs = (files, roomMatcher, sizeMatcher, projectName) => {
  files.forEach((file) => {
    const loadingTask = pdf.getDocument(file.buffer);
    loadingTask.promise.then((doc) => {
      doc.getPage(1).then(async (page) => {
        const txt = await page.getTextContent();

        // Adjust room and size matching in regards to the PDF layout
        // and the provided RegExp from the frontend request.
        // txt.items lists all strings present in the PDF
        const room = txt.items
          .find((item) => roomMatcher.test(item.str))
          .str.split('-')[0];

        let size = '';
        if (
          txt.items[
            txt.items.findIndex((item) => sizeMatcher.test(item.str)) + 1
          ].str.includes('SNR')
        ) {
          size = txt.items[
            txt.items.findIndex((item) => sizeMatcher.test(item.str)) + 3
          ].str
            .replace(',', '.')
            .replace(/\s/g, '')
            .replace('m', '');
        } else {
          size = txt.items[
            txt.items.findIndex((item) => sizeMatcher.test(item.str)) + 1
          ].str
            .replace(',', '.')
            .replace(/\s/g, '')
            .replace('m', '');
        }

        csvHeaders = csvHeaders.concat(
          `${file.originalname.split('.pdf')[0]};${room};${size}\n`
        );
        saveToCSV(csvHeaders, projectName);
      });
    });
  });
  csvHeaders = 'meta/de/name;number_of_rooms;area_size\n';
};

const saveToCSV = (csvHeaders, projectName) => {
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
