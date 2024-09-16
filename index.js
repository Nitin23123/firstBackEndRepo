
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res) {
  fs.readdir('./files', function(err, files) {
    res.render("index", { files: files });
  });
}); 

// creating one more root to read the read more link 
app.get('/file/:filename', function(req, res) {
  fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
    res.render('show',{filename: req.params.filename, filedata: filedata});
  })
}); 
// creating a route for txt edit filename options 
app.get('/edit/:filename', function(req, res){
  res.render('edit',{filename: req.params.filename});
})

// creating a post route that edits the previous name and add new name to the files
app.post('/edit', function(req,res){
  fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`, function(err){
    res.redirect("/");
  })
})

// creates a text file 
app.post('/create', function(req, res) {
  const filename = `./files/${req.body.title.split(' ').join('')}.txt`;
  const data = req.body.details;
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating file');
    } else {
      res.redirect("/");
    }
  });
})
// Server startup
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
