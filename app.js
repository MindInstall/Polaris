const express = require('express');
const multer = require('multer');
const bodyparser = require('body-parser');
const ejs = require("ejs");
const path = require('path');
const indexRoute = require("./routes/indexroute");
const port = process.env.PORT || 4000;

// Multer storage stats
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

// Processing after upload
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
})

// Check if file uploaded is valid
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const app = express();

// Uncomment this line when the model is uploaded
// Testing of models are to be done
//const model = await tf.models.modelFromJSON("file://model/model.json");

app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

// Receiving uploads and storing them locally
app.post('/upload', upload.fields([
    { name: 'photo1', maxCount: 1 },
    { name: 'photo2', maxCount: 1}
]), (req, res, next) => {
    res.render('result', {
        file1: `uploads/${req.files.photo1[0].filename}`,
        file2: `uploads/${req.files.photo2[0].filename}`
    });
  })

app.listen(port, () => {
    console.log(`Server listening for requests at ${port}`)
});
