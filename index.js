var express = require('express');
var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index', { images: getAllImages() });
});
app.get('/display', function (request, response) {
    response.render('pages/display', { image: getImage(request.query.i) });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function getAllImages() {
    return fs.readdirSync('./public').filter(filename => ['.png', '.jpg'].some(ext => filename.endsWith(ext)));
}
function getImage(imageName) {
    return {
        name: imageName,
        src: './' + imageName,
        psdSrc: './' + imageName.substr(0, imageName.lastIndexOf('.')) + '.psd'
    };
}
