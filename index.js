const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer')
const pdf = require('html-pdf')
const fs = require('fs')
const path = require('path')

const port = 5000;

// middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public/uploads'))

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    },
  });


  
var upload = multer({ storage: storage }).single('file');


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


app.post('/htmltopdf', (req, res) => {

    output = Date.now() + "output.pdf"
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(req.file.path)

            var html = fs.readFileSync(req.file.path, "utf8");
            var options = { format: "Letter" };

            pdf
              .create(html, options)
              .toFile("public/pdf/"+output, function (err, response) {
                if (err) return console.log(err);
                  
                  res.download(response.filename, () => {
                      
                  })
              });
        }
    })
})


app.listen(port, ()=>{
    console.log("server is running on port "+port);
})