
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

var shortNounList = [ 
    ["man","fear"],
    ["woman","bean"],
    ["cat","cat"],
    ["dog","madra"],
    ["bird","éan"],
    ["sandwich","ceapaire"],
    ["shop","siopa"],
    ["school","scoil"],
    ["road","bóthar"],
    ["window","fuinneog"],
    ["story","scéal"],
    ["food","bia"],
    ["cake","cáca"],
    ["cake","císte"],
    ["apple","úll"],
    ["sentence","abairt"],
    ["Irish","Gaeilge"],
    ["English","Béarla"],
    ["bed","leaba"],
    ["house","teach"]
];

var shortAdjList = [

    ["big","mór"],
    ["small","beag"],
    ["tall","ard"],
    ["short","gearr"],
    ["long","fada"],
    ["red","dearg"],
    ["early","luath"],
    ["late","déanach"],
    ["blue","gorm"],
    ["green","glas"],
    ["yellow","buí"],
    ["purple","corcra"],
    ["brown","donn"],
    ["expensive","costasach"],
    ["free","saor"],
    ["quiet","ciúin"],
    ["cold","fuar"],
    ["hot","te"],
    ["old","sean"],
    ["young","óg"],
    ["cheap","saor"]
]
  
var shortVerbList = [ 
    ["be","bí"],
    ["do","déan"],
    ["say","abair"],
    ["eat", "ith"],
    ["go","téigh"],
    ["get","faigh"],
    ["make","déan"],
    ["think","ceap"],
    ["take","tóg"],
    ["see","feic"],
    ["come","tar"],
    ["look","féach"],
    ["use","úsáid"],
    ["find","aimsigh"],
    ["give","tabhair"],
    ["tell","inis"],
    ["work","obair"],
    ["call","glaoch"],
    ["ask","fiafraigh"],
    ["feel","mothaigh"],
    ["become","éirigh"],
    ["leave","fág"],
    ["put","cuir"],
    ["keep","coinnigh"],
    ["let","lig"],
    ["begin","tosaigh"],
    ["help","cuidigh"],
    ["talk","labhair"],
    ["turn","cas"],
    ["start","tosaigh"],
    ["show","taispeáin"],
    ["hear","clois"],
    ["play","imir"],
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
    ["succeed", "éirigh"],
    ["buy", "ceannaigh"],
    ["meet", "buail"],
    ["add", "cuir"],
    ["put", "cuir"],
    ["spend","caith"],
    ["throw","caith"],
    ["wear","caith"],
    ["smoke","caith"],
    ["grow","fás"],
    ["break", "bris"],
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
    ["clean", "glan"],
    ["raise","ardaigh"],
    ["sell","díol"],
    ["decide","socraigh"],
    ["catch","beir"],
    ["pull","tarraing"]
  ]; //this list contains 84 verbs


app.get('/', function (req, res) {
    res.render('index.ejs', {text1: null, text2: null, text3: null, text4: null, text5: null, text6: null, text7: null, error: null});
  })
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })

app.post('/', function (req, res) {
    var input = req.body.input;
    

    var tagged = tagger.tagSentence(input);

    var verb = "";
    var englishVerbs = [];
    var englishNouns = [];
    var irishNouns = [];
    var englishAdjs = [];
    var irishAdjs = [];
    var irishVerbResult = [];

    var q = 0;
    var z = 0;
    var y = 0;

    var englishVerb = "";
    var irishVerb = "";
    var irishPos = "";

    var englishNoun = "";
    var irishNoun = "";

    var englishAdj = "";
    var irishAdj = "";
    
    var irishVerbResult1 = "";
    var go = false;
    

    for(i=0; i<tagged.length; i++)
    {
            console.log(tagged[i]);

            if(tagged[i].pos == "NN")
            {
                englishNoun = tagged[i].value;

                for(j=0; j<shortNounList.length; j++)
                {
                    if(shortNounList[j][0]==englishNoun)
                    {
                        irishNoun = shortNounList[j][1];
                    }
                }

                englishNouns[z] = englishNoun;
                irishNouns[z] = irishNoun;

                z++;

            }

            if(tagged[i].pos == "JJ")
            {
                englishAdj = tagged[i].value;

                for(j=0; j<shortAdjList.length; j++)
                {
                    if(shortAdjList[j][0]==englishAdj)
                    {
                        irishAdj = shortAdjList[j][1];
                    }
                }

                englishAdjs[y] = englishAdj;
                irishAdjs[y] = irishAdj;

                y++;

            }
           

            if(tagged[i].pos == "VBD")
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;

                console.log(englishVerb+"past"+i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                console.log(irishVerb);

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+PastInd+Len";
                }
                else
                {
                    irishPos = "+Verb+PastInd+Len";
                }
            }

            if(tagged[i].pos == "VBP")
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"present" +i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+PresInd";
                }
                else
                {
                    irishPos = "+Verb+PresInd";
                }

            }


            if(tagged[i].pos == "VBZ")
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"present"+i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+PresInd";
                }
                else
                {
                    irishPos = "+Verb+PresInd";
                }
            }

         if(i>0&&tagged[i].pos == "VBP" && tagged[i-1].value=="I")
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"present1"+i);

                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+PresInd+1P+Sg";
                }
                else
                {
                    irishPos = "+Verb+PresInd+1P+Sg";
                }
            }

            if(i>0&&tagged[i].pos == "VBD" && (tagged[i-1].value=="we" || tagged[i-1].value=="We"))
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"past2" +i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+PastInd+1P+Pl+Len";
                }
                else
                {
                    irishPos = "+Verb+PastInd+1P+Pl+Len";
                }
            }

            if(i>0&&tagged[i].pos == "VBP" && (tagged[i-1].value=="we" || tagged[i-1].value=="We"))
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"present2"+i);

                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+PresInd+1P+Pl";
                }
                else
                {
                    irishPos = "+Verb+PresInd+1P+Pl";
                }
            } 

            if(tagged[i].pos == "VBG")
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                irishPos = "Verbal+Noun";

                console.log(englishVerb+"verbalnoun"+i);
                
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

                console.log(englishVerb+"infinitive"+i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+Imper+2P+Sg";
                }
                else
                {
                    irishPos = "+Verb+Imper+2P+Sg";
                }
            }

            if(i>0 && tagged[i].pos == "VB" && tagged[i-1].value == "will")
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"future"+i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+FutInd";
                }
                else
                {
                    irishPos = "+Verb+FutInd";
                }
            }

          if(i>1 && tagged[i].pos == "VB" && tagged[i-1].value == "will" && (tagged[i-2].value=="we" || tagged[i-2].value=="We"))
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"future2"+i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+FutInd+1P+Pl";
                }
                else
                {
                    irishPos = "+Verb+FutInd+1P+Pl";
                }
            } 

            if(i>0&&tagged[i].pos == "VB" && tagged[i-1].value == "would")
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"conditional"+i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+Cond+Len";
                }
                else
                {
                    irishPos = "+Verb+Cond+Len";
                }
            }

          if(i>1&&tagged[i].pos == "VB" && tagged[i-1].value == "would" && tagged[i-2].value=="I")
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;
                
                console.log(englishVerb+"conditional1"+i);
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+Cond+1P+Sg+Len";
                }
                else
                {
                    irishPos = "+Verb+Cond+1P+Sg+Len";
                }
            }

            if(i>1&&tagged[i].pos == "VB" && tagged[i-1].value == "would" && (tagged[i-2].value=="we" || tagged[i-2].value=="We"))
            {
                verb = tagged[i].value;
                englishVerb = tagged[i].lemma;

                console.log(englishVerb+"conditional2"+i);
                
                
                for(j=0; j<shortVerbList.length; j++)
                {
                    if(shortVerbList[j][0]==englishVerb)
                    {
                        irishVerb = shortVerbList[j][1];
                    }
                }

                if((irishVerb.indexOf("a")==0)||(irishVerb.indexOf("e")==0)||(irishVerb.indexOf("i")==0)||(irishVerb.indexOf("o")==0)||(irishVerb.indexOf("u")==0)||(irishVerb.indexOf("á")==0)||(irishVerb.indexOf("é")==0)||(irishVerb.indexOf("í")==0)||(irishVerb.indexOf("ó")==0)||(irishVerb.indexOf("ú")==0))
                {
                    irishPos = "+Verb+Vow+Cond+1P+Pl+Len";
                }
                else
                {
                    irishPos = "+Verb+Cond+1P+Pl+Len";
                }
            } 

            if(tagged[i].lemma == "go")
            {
                go = true;

                if(tagged[i].pos == "VBD")
                {
                    irishVerbResult1 = "chuaigh";
                }
                if(tagged[i].pos == "VBZ")
                {
                    irishVerbResult1 = "téann";
                }

                if(tagged[i].pos == "VBP")
                {
                    irishVerbResult1 = "téann";
                }
             if(i>0&&tagged[i].pos == "VBP" && tagged[i-1].value == "I")
                {
                    irishVerbResult1 = "téim";
                } 
                if(i>0&&tagged[i].pos == "VBP" && (tagged[i-1].value == "we" || tagged[i-1].value == "We"))
                {
                    irishVerbResult1 = "téimid";
                } 
                if(tagged[i].pos == "VB")
                {
                    irishVerbResult1 = "téigh";
                }
                if(i>0&&tagged[i].pos == "VB" && tagged[i-1].value == "will")
                {
                    irishVerbResult1 = "rachaidh";
                }
                if(i>0&&tagged[i].pos == "VB" && tagged[i-1].value == "would")
                {
                    irishVerbResult1 = "rachadh";
                }
             if(i>1&&tagged[i].pos == "VB" && tagged[i-1].value == "would" && tagged[i-2].value == "I")
                {
                    irishVerbResult1 = "rachainn";
                } 
                if(tagged[i].pos == "VBG")
                {
                    irishVerbResult1 = "ag dul";
                }
            }

            
        
        if(tagged[i].pos=="VB"||tagged[i].pos=="VBG"||tagged[i].pos=="VBD"||tagged[i].pos=="VBP"||tagged[i].pos=="VBZ")
        {
            var command = "echo " + irishVerb + irishPos + " | flookup -a -x irishfst-min/allgenmin.fst";
            var test = child_process.execSync(command);
            var result = test.toString().trim();

            englishVerbs[q] = tagged[i].value;

            if(i>0 && tagged[i-1].value=="will")
            {
                englishVerbs[q] = "will "+ tagged[i].value;
            }

            if(i>0 && tagged[i-1].value=="would")
            {
                englishVerbs[q] = "would "+ tagged[i].value;
            }

            if(tagged[i].pos=="VBD"&&((result.indexOf("f")==0)||(result.indexOf("a")==0)||(result.indexOf("e")==0)||(result.indexOf("i")==0)||(result.indexOf("o")==0)||(result.indexOf("u")==0)||(result.indexOf("á")==0)||(result.indexOf("é")==0)||(result.indexOf("í")==0)||(result.indexOf("ó")==0)||(result.indexOf("ú")==0)))
            {
                irishVerbResult[q] = "d'"+result;
            }
            else
            {
                irishVerbResult[q] = result;
            }
            

            console.log(irishVerbResult[q]);

            if(go)
            {
                irishVerbResult[q] = irishVerbResult1;
            }
            q++;
        }

        
    }

    translate(req.body.input, {from: 'en', to: 'ga'}).then(res1 => {
        var t1 = res1.text;
        var t1LowerCase = t1.toLowerCase();

        translate(res1.text, {from: 'ga', to: 'en'}).then(res2 => {
            var t2 = res2.text;
            var text1 = input;  
            var text2 = t1;
            var text3 = t2;
            var text4 = "The English translation of the Irish is the same as the original text.";
            var text5 = "";
            var text6 = "";
            var text7 = "";
            if(input !== t2)
            { 
                text4 = "The English translation of the Irish is not the same as the text you entered.";
            }

            for(j=0;j<irishVerbResult.length;j++)
            {
                console.log(irishVerbResult[j]);
                if(t1LowerCase.indexOf(irishVerbResult[j])==-1)
                {
                
                text5 += "The text you entered contained the verb \"" + englishVerbs[j] + "\", which, in this context, could be translated as \"" + irishVerbResult[j] + "\". ";
                
                }
            }

            for(j=0;j<irishNouns.length;j++)
            {
                if(t1LowerCase.indexOf(irishNouns[j])==-1)
                {
                
                text6 += "The text you entered contained the noun \"" + englishNouns[j] + "\", which could be translated as \"" + irishNouns[j] + "\". ";
                
                }
            }

            for(j=0;j<irishAdjs.length;j++)
            {
                if(t1LowerCase.indexOf(irishAdjs[j])==-1)
                {
                
                text7 += "The text you entered contained the adjective \"" + englishAdjs[j] + "\", which could be translated as \"" + irishAdjs[j] + "\". ";
                
                }
            }

            res.render('index.ejs', {text1: text1, text2: text2, text3: text3, text4: text4, text5: text5, text6: text6, text7: text7, error: null});
      })
    }).catch(err => {
        res.render('index.ejs', {text1: null, text2: null, text3: null, text4: null, text5: null, text6: null, text7: null, error: 'Error, please try again'});
    })


});



