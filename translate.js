
const translate = require('@vitalets/google-translate-api');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    res.render('index', {translation: null, input: null, error: null});
  })
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })

app.post('/', function (req, res) {
    //input = req.body.input;
    translate(req.body.input, {from: 'en', to: 'ga'}).then(res1 => {
        res.render('index', {translation: res1.text, input: req.body.input, error: null});
  })
.catch(err => {
    res.render('index', {translation: null, error: 'Error, please try again'});
});

app.post('/1', function (req, res) {
    //input = req.body.input;
    translate(req.body.input, {from: 'ga', to: 'en'}).then(res1 => {
        res.render('index', {translation1: res1.text, input: req.body.input, error: null});
  })
.catch(err => {
    res.render('index', {translation1: null, error: 'Error, please try again'});
});



});
});

