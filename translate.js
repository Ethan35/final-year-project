
const translate = require('@vitalets/google-translate-api');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    res.render('index.ejs', {text1: null, text2: null, text3: null, text4: null, error: null});
  })
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })

app.post('/', function (req, res) {
    var input = req.body.input;
    translate(req.body.input, {from: 'en', to: 'ga'}).then(res1 => {
        var t1 = res1.text;
        translate(res1.text, {from: 'ga', to: 'en'}).then(res2 => {
            var t2 = res2.text;
            var text1 = "The text you entered was \"" + input + "\"";  
            var text2 = "The Irish translation, according to google translate, is \"" + t1 + "\"";
            var text3 = "The English translation of the Irish translation of the text you entered, according to google translate, is \"" + t2 + "\"";
            var text4 = "There are no suggested changes to the translation.";
            if(input !== t2)
            {
                text4 = "The English translation of the Irish is not the same as the text you entered.";
            }
            res.render('index.ejs', {text1: text1, text2: text2, text3: text3, text4: text4, error: null});
      })
        
  }).catch(err => {
    res.render('index.ejs', {text1: null, text2: null, text3: null, text4: null, error: 'Error, please try again'});


})
});



