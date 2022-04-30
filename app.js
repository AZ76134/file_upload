const express = require('express');
const multer = require('multer');
const fs =  require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

if (fs.existsSync('upload') == false) {
  fs.mkdirSync('upload')
  fs.mkdirSync('upload/files')
}


const append = fs.existsSync('upload/record.csv')

const csvWriter = createCsvWriter({
  path: 'upload/record.csv',
  append: append,
  header: [
    {id: 'name', title: 'Name'},
    {id: 'type', title: 'Type'},
    {id: 'time', title: 'Time'},
    {id: 'file', title: 'File'},
  ]
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));

// SET STORAGE

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/files')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +  file.originalname)
  }
})
 
var upload = multer({ storage: storage })

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/assets/index.html');
});

app.post('/file', upload.single('file'), uploadFile);

function uploadFile(req, res) {
  const data = [{
    name: req.body.name,
    type: req.body.type,
    time: new Date().toLocaleString().replace(',',''),
    file: req.file.filename
  }]
  csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));
  res.json({ message: "Successfully uploaded files" });
}

app.listen(3000, () => console.log('Server started on port 3000'));