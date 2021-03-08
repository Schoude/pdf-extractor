const fs = require('fs')
const pdf = require('pdfjs-dist/es5/build/pdf')
let string = 'meta/de/name;number_of_rooms;area_size\n'

const projectName = 'Kronenhöfe'

function extractFromFile(path, filename) {
  const loadingTask = pdf.getDocument(`../${path}/${filename}`)

  const roomMatcher = new RegExp(/\d Zimmer/g)
  const sizeMatcher = new RegExp(/Wohnfläche/g)

  loadingTask.promise.then(doc => {
    doc.getPage(1).then(async page => {
      const txt = await page.getTextContent()
      const roomData = txt.items.find(item => roomMatcher.test(item.str))
      const room = roomData.str
        .split('|')
        .find(item => roomMatcher.test(item))
        .trim()
        .split(' ')[0]
      const size = txt.items[
        txt.items.findIndex(item => sizeMatcher.test(item.str)) + 1
      ].str.replace(',', '.')
      string = string.concat(`${filename.split('.pdf')[0]};${room};${size}\n`)
      saveToCSC(string)
    })
  })
}

function saveToCSC(string) {
  if (!fs.existsSync('../export')) {
    fs.mkdirSync('../export')
  }

  fs.writeFile(`../export/${projectName}-units.csv`, string, 'utf8', err => {
    if (err) throw err
    console.log('The file has been saved!')
  })
}

fs.readdir('../pdfs', (err, files) => {
  files.forEach(filename => {
    extractFromFile('pdfs', filename)
  })
})
