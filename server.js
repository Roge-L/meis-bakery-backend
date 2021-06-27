// require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');

// Use EJS as template engine
app.set('view engine', 'ejs');

// Parse incoming requests with JSON payloads
app.use(express.json());

// Use query string when we create our form to make a delete request
app.use(methodOverride('_method'));

// File upload modules
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// Prevent cross-origin problems
app.use(cors());

// Connect to database and fetch the database connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

// Notify whether the connection was successful
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to DB!'));

// Initialize MongoDB GridFS stream
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('cakes');
})

// Create a storage engine object with a given configuration
const storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'cakes'
          };
          resolve(fileInfo);
        });
      });
    }
  });

// Set multer storage engine to the newly created object
const upload = multer({ storage });

// Render landing page
app.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    res.render('index', {files: files});
    });
})

// File upload to cake DB
// 'file' corresponds to the file given in index.html
app.post('/upload', upload.single('file'), (req, res) => {
    // res.json({file: req.file});
    res.redirect('/');
})

// Get all files
app.get('/cakes', (req, res) => {
  gfs.files.find().toArray((err, files) => {
      if (!files || files.length === 0) {
          return res.status(404).json({message: 'no cakes exist'})
      }

      return res.json(files);
  });
})

// Get single file
app.get('/cakes/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({message: 'no cake exists'})
    }

    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  })
})

// Delete a file
app.delete('/delete/:filename', (req, res) => {
  gfs.remove({filename: req.params.filename, root: 'cakes'}, (err, gridStore) => {
    if (err) return res.status(404).json({message: 'no cake exists'});
    res.redirect('/');
  });
})

// // Fetch and use the cakes Router object (instance of middleware and routes)
// const cakesRouter = require('./routes/cakes');
// app.use('/cakes', cakesRouter);

// Begin listening for requests
app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));