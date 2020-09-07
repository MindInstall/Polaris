const express = require('express');
const multer = require('multer');
const bodyparser = require('body-parser');
const ejs = require("ejs");
const path = require('path');
const indexRoute = require("./routes/indexroute");
const port = process.env.PORT || 4000;

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
})

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

//Uncomment this line when the model is uploaded
//const model = await tf.models.modelFromJSON("file://model/model.json");

app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', upload.fields([
    { name: 'photo1', maxCount: 1 },
    { name: 'photo2', maxCount: 1}
]), (req, res, next) => {
    console.log(req.files);
    res.render('index');
  })

app.listen(port, () => {
    console.log(`Server listening for requests at ${port}`)
});
