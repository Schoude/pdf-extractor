const pdf = require('pdfjs-dist/es5/build/pdf');
const fs = require('fs');
let csvHeaders = 'meta/de/name;number_of_rooms;area_size;floor;generals\n';

const gardenMatcher = new RegExp(/Garten/, 'g');
const gardenGuid = 'fcddc2ad-3e74-4e8b-8769-d4ebfa037cc4';
const roofTerraceMatcher = new RegExp(/Dachterrasse/, 'g');
const roofTerraceGuid = '0c8dd81e-4403-4435-974d-0e2ec616ea16';
const terraceMatcher = new RegExp(/terrasse/, 'gi');
const terraceGuid = 'f3d1f2d7-9ad7-449a-a738-e275eddbba55';
const loggiaMatcher = new RegExp(/loggia/, 'gi');
const loggiaGuid = '47b2d9fb-14c3-4215-98af-833b2096eabc';

// hard to match because other unit's balconies are marked in the PDF
// const balconyMatcher = new RegExp(/^Balkon$/, 'g');
// const balconyNotMatcher = new RegExp(/erdgeschoss/, 'gi');
// const balconyGuid = '743f940a-907c-44a5-bf28-072d9502d40e';

const setupFloorsMap = (floorGuids) => {
  return new Map(floorGuids.map((value, index) => [index.toString(), value]));
};

const extractFromPDFBlobs = (
  files,
  roomMatcher,
  sizeMatcher,
  projectName,
  floorsMap
) => {
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

        const floorGuid = floorsMap.get(file.originalname.split('_')[1]);

        let unitData = `${
          file.originalname.split('.pdf')[0]
        };${room};${size};${floorGuid};`;

        // unit_attributes
        const unitDataComplete = handleGeneralUnitAttributes(
          unitData,
          txt.items
        );

        csvHeaders = csvHeaders.concat(unitDataComplete);

        saveToCSV(csvHeaders, projectName);
      });
    });
  });
  csvHeaders = 'meta/de/name;number_of_rooms;area_size;floor;generals\n';
};

const saveToCSV = (fileContent, projectName) => {
  if (!fs.existsSync('../export')) {
    fs.mkdirSync('../export');
  }

  fs.writeFile(
    `../export/${projectName}-units.csv`,
    fileContent,
    'utf8',
    (err) => {
      if (err) throw err;
      console.log(`The file "${projectName}-units.csv" has been saved!`);
    }
  );
};

const handleGeneralUnitAttributes = (unitData, items) => {
  // garden
  const hasGarden = items.some((item) => gardenMatcher.test(item.str));
  if (hasGarden) {
    unitData = unitData.concat(`${gardenGuid},`);
  }

  // roofterrace
  const hasRoofTerrace = items.some((item) =>
    roofTerraceMatcher.test(item.str)
  );
  if (hasRoofTerrace) {
    unitData = unitData.concat(`${roofTerraceGuid},`);
  }

  // terrace
  const hasTerrace = items.some((item) => terraceMatcher.test(item.str));
  if (!hasRoofTerrace && hasTerrace) {
    unitData = unitData.concat(`${terraceGuid},`);
  }

  // loggia
  const hasLoggia = items.some((item) => loggiaMatcher.test(item.str));

  if (hasLoggia) {
    unitData = unitData.concat(`${loggiaGuid}\n`);
  } else {
    unitData = unitData.concat('\n');
  }

  // balcony
  // const hasBalcony = items.some(
  //   (item) =>
  //     balconyMatcher.test(item.str) && !balconyNotMatcher.test(item.str)
  // );
  // if (hasBalcony) {
  //   unitData = unitData.concat(`${balconyGuid}\n`);
  // } else {
  //   unitData = unitData.concat('\n');
  // }

  return unitData;
};

module.exports = {
  extractFromPDFBlobs,
  setupFloorsMap,
};
