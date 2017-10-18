var express = require('express');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(fileUpload());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index', { images: getAllImages(function() {
        return fs.readdirSync('./public').filter(filename => ['.png', '.jpg'].some(ext => filename.endsWith(ext)));
    }) });
});
app.get('/display', function (request, response) {
    response.render('pages/display', { image: getImage(request.query.i) });
});
app.post('/display', function (req, res) {
    if  (!req.files)
        return  res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let  sampleFile  =  req.files.samplefile;
    if(sampleFile == undefined)
        return res.status(400).send('Please select a file');

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('public/' + sampleFile.name,  function (err)  {
        if  (err)
            return  res.status(500).send(err);
    });
    
    res.render('pages/index', { images: getAllImages(function() {
        return fs.readdirSync('./public').filter(filename => ['.png', '.jpg'].some(ext => filename.endsWith(ext)));
    })});
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

function getAllImages(callback) {
    return callback();
}
function getImage(imageName) {
    var path = './' + imageName.substr(0, imageName.lastIndexOf('.')) + '.psd';
    if(!fs.existsSync('./public/' + imageName.substr(0, imageName.lastIndexOf('.')) + '.psd'))
        path = undefined;

    return {
        name: imageName,
        src: './' + imageName,
        psdSrc: path
    };
}
