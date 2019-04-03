
const translate = require('@vitalets/google-translate-api');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const posTagger = require('wink-pos-tagger');
const child_process = require('child_process');

app.set('view engine', 'ejs');
app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: true }));

var tagger = posTagger();

var shortVerbList = [ 
    ["be","bí"],
    ["do","déan"],
    ["say","abair"],
    ["go","téigh"],
    ["get","faigh"],
    ["make","déan"],
    ["think","ceap"],
    ["take","tóg"],
    ["see","feic"],
    ["come","tar"],
    ["look","féach"],
    ["use","úsáid"],
    ["find","aims"],
    ["give","tabhair"],
    ["tell","inis"],
    ["tell","ins"],
    ["work","obair"],
    ["call","glaoch"],
    ["ask","fiafr"],
    ["feel","moth"],
    ["become","éir"],
    ["leave","fág"],
    ["put","cuir"],
    ["keep","coinn"],
    ["let","lig"],
    ["begin","tos"],
    ["help","cuid"],
    ["talk","labhair"],
    ["talk","labhr"],
    ["turn","cas"],
    ["start","tos"],
    ["show","taispeáin"],
    ["hear","clois"],
    ["play","imir"],
    ["play","imr"],
    ["run","rith"],
    ["move","bog"],
    ["believe","creid"],
    ["bring","tóg"],
    ["happen","tarla"],
    ["write","scríobh"],
    ["sit","suigh"],
    ["stand","seas"],
    ["lose","caill"],
    ["pay","íoc"],
    ["learn","foghlaim"],
    ["change","athraigh"],
    ["understand","tuig"],
    ["watch","féach"],
    ["follow","lean"],
    ["continue","lean"],
    ["stop","stop"],
    ["create","cruth"],
    ["speak","labhair"],
    ["read","léigh"],
    ["allow","lig"],
    ["spend","caith"],
    ["throw","caith"],
    ["wear","caith"],
    ["smoke","caith"],
    ["grow","fás"],
    ["open","oscail"],
    ["close","dún"],
    ["walk","siúl"],
    ["remember","cuimhnigh"],
    ["buy","ceannaigh"],
    ["wait","fan"],
    ["send","seol"],
    ["stay","fan"],
    ["fall","tit"],
    ["cut","gearr"],
    ["reach","sroich"],
    ["kill","máraigh"],
    ["remain","fan"],
    ["suggest","mol"],
    ["drink","ól"],
    ["raise","arda"],
    ["sell","díol"],
    ["decide","socra"],
    ["catch","beir"],
    ["pull","tarraing"]
  ];


app.get('/', function (req, res) {
    res.render('index.ejs', {text1: null, text2: null, text3: null, text4: null, text5: null, error: null});
  })
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })

app.post('/', function (req, res) {
    var input = req.body.input;
    var verb = "";
    var englishVerb = "";
    var irishVerb = "";
    var irishPos = "";
    var irishVerbResult = "";

    var tagged = tagger.tagSentence(input);

    for(i=0; i<tagged.length; i++)
    {

        console.log(tagged[i]);

        if(tagged[i].pos == "VBD")
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+PastInd+Len";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VBZ")
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+PresInd";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VBP" && tagged[i-1].value=="I")
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+PresInd+1P+Sg";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VBD" && (tagged[i-1].value=="we" || tagged[i-1].value=="We"))
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+PastInd+1P+Pl+Len";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VBP" && (tagged[i-1].value=="we" || tagged[i-1].value=="We"))
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+PresInd+1P+Pl";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VB")
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+Imper+2P+Sg";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VB" && tagged[i-1].value == "will")
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+FutInd";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VB" && tagged[i-1].value == "will" && (tagged[i-2].value=="we" || tagged[i-2].value=="We"))
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+FutInd+1P+Pl";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VB" && tagged[i-1].value == "would")
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+Cond+Len";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VB" && tagged[i-1].value == "would" && tagged[i-2].value=="I")
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+Cond+1P+Sg+Len";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        if(tagged[i].pos == "VB" && tagged[i-1].value == "would" && (tagged[i-2].value=="we" || tagged[i-2].value=="We"))
        {
            verb = tagged[i].value;
            englishVerb = tagged[i].lemma;
            irishPos = "+Verb+VTI+Cond+1P+Pl+Len";
            
            for(j=0; j<shortVerbList.length; j++)
            {
                if(shortVerbList[j][0]==englishVerb)
                {
                    irishVerb = shortVerbList[j][1];
                }
            }
        }

        
    }
    var c1 = child_process.execSync("cd irishfst-min");
    var c2 = child_process.execSync("ls");
    //console.log(c2.toString());
    var command = "echo " + irishVerb + irishPos + " | flookup -a -x irishfst-min/allgen.fst";
    var test = child_process.execSync(command);
    console.log("|"+test.toString()+"|");
    if(irishVerbResult.indexOf("chuaigh")!==-1)
    {
        console.log("Irish verb has two results");
    }
    irishVerbResult = test.toString().trim();
    console.log("|"+irishVerbResult+"|");
    

    translate(req.body.input, {from: 'en', to: 'ga'}).then(res1 => {
        var t1 = res1.text;
        var t1LowerCase = t1.toLowerCase();
        //console.log(t1LowerCase);
        translate(res1.text, {from: 'ga', to: 'en'}).then(res2 => {
            var t2 = res2.text;
            var text1 = input;  
            var text2 = t1;
            var text3 = t2;
            var text4 = "There are no suggested changes to the translation.";
            var text5 = "";
            if(input !== t2)
            { 
                text4 = "The English translation of the Irish is not the same as the text you entered.";
            }
            if(t1LowerCase.indexOf(irishVerbResult)==-1)
            {
                
                text5 += "The Irish translation might not contain the correct verb. The text you entered contained the verb \"" + verb + "\", which, in this context, could be translated as \"" + irishVerbResult + "\".";
                
            }
           /* var c = "would like";
            if(input.indexOf(c)==-1 && t2.indexOf(c)!== -1)
            {
                text4 += "\n";
                text4 += "It seems that a conditional verb form was not translated correctly."
            } */

            res.render('index.ejs', {text1: text1, text2: text2, text3: text3, text4: text4, text5: text5, error: null});
      })
        
  }).catch(err => {
    res.render('index.ejs', {text1: null, text2: null, text3: null, text4: null, text5: null, error: 'Error, please try again'});


})
});



