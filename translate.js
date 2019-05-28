
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
    ["atomize", "adamhaigh"],
    ["bury", "adhlaic"],
    ["aerate", "aeraigh"],
    ["air-condition", "aeroiriúnaigh"],
    ["classify", "aicmigh"],
    ["align", "ailínigh"],
    ["amplify", "aimpligh"],
    ["ensure", "áirithigh"],
    ["inhabit", "áitrigh"],
    ["import", "allmhairigh"],
    ["bully", "ansmachtaigh"],
    ["isolate", "aonraigh"],
    ["insure", "árachaigh"],
    ["harmonize", "armónaigh"],
    ["dislodge", "asáitigh"],
    ["exhale", "asanálaigh"],
    ["evacuate", "aslonnaigh"],
    ["reproduce", "atáirg"],
    ["reunite", "athaontaigh"],
    ["brand", "brandáil"],
    ["load", "lódáil"],
    ["mortgage", "morgáistigh"],
    ["motorize", "mótaraigh"],
    ["rake", "rácáil"],
    ["ossify", "cnámhaigh"],
    ["wound", "cneáigh"],
    ["stabilize", "cobhsaigh"],
    ["cook", "cócaráil"],
    ["codify", "códaigh"],
    ["export", "easpórtáil"],
    ["acquit", "éigiontaigh"],
    ["rain", "báistigh"],
    ["batter", "batráil"],
    ["blast", "bleaisteáil"],
    ["impoverish", "bochtaigh"],
    ["vulcanize", "bolcáinigh"],
    ["bolt", "boltáil"],
    ["adjudge", "breithnigh"],
    ["fuel", "breoslaigh"],
    ["embroider", "bróidnigh"],
    ["broach", "bróitseáil"],
    ["smelt", "bruithnigh"],
    ["bomb", "buamáil"],
    ["buckle", "búcláil"],
    ["bottle", "buidéalaigh"],
    ["standardize", "caighdeánaigh"],
    ["calcify", "cailcigh"],
    ["qualify", "cáiligh"],
    ["charter", "cairtfhostaigh"],
    ["camp", "campáil"],
    ["can", "cannaigh"],
    ["canonize", "canónaigh"],
    ["license", "ceadúnaigh"],
    ["square", "cearnaigh"],
    ["paddle", "céaslaigh"],
    ["wax", "ciar"],
    ["kick", "ciceáil"],
    ["apportion", "cionroinn"],
    ["queue", "ciúáil"],
    ["cube", "ciúbaigh"],
    ["clout", "clabhtáil"],
    ["clamp", "clampaigh"],
    ["acclimatize", "clíomaigh"],
    ["print", "clóbhuail"],
    ["petrify", "clochraigh"],
    ["print", "clóigh"],
    ["hear", "clois"],
    ["parboil", "cnagbheirigh"],
    ["confiscate", "coigistigh"],
    ["colonize", "coilínigh"],
    ["excommunicate", "coinnealbháigh"],
    ["consign", "coinsínigh"],
    ["equate", "comardaigh"],
    ["reciprocate", "cómhalartaigh"],
    ["recriminate", "comhchoirigh"],
    ["condense", "comhdhlúthaigh"],
    ["coerce", "comhéignigh"],
    ["cohere", "comhghreamaigh"],
    ["co-ordinate", "comhordaigh"],
    ["assimilate", "comhshamhlaigh"],
    ["countersign", "comhshínigh"],
    ["coincide", "comhtharlaigh"],
    ["co-opt", "comhthogh"],
    ["cork", "corcáil"],
    ["crown", "corónaigh"],
    ["incorporate", "corpraigh"],
    ["cost", "costáil"],
    ["gargle", "craosfholc"],
    ["cremate", "créam"],
    ["accredit", "creidiúnaigh"],
    ["demarcate", "críochaigh"],
    ["crystallize", "criostalaigh"],
    ["back-fire", "cúltort"],
    ["empower", "cumhachtaigh"],
    ["count", "cuntais"],
    ["dam", "dambáil"],
    ["sculpture", "dealbhaigh"],
    ["smoke", "deataigh"],
    ["bisect", "déroinn"],
    ["dial", "diailigh"],
    ["glean", "diasraigh"],
    ["disqualify", "dícháiligh"],
    ["depopulate", "dídhaoinigh"],
    ["disinfect", "díghalraigh"],
    ["dehydrate", "díhiodráitigh"],
    ["decentralize", "díláraigh"],
    ["derive", "díorthaigh"],
    ["dissect", "diosc"],
    ["arraign", "díotchúisigh"],
    ["bespatter", "draoibeáil"],
    ["draft", "dréachtaigh"],
    ["climb", "dreap"],
    ["dredge", "dreideáil"],
    ["drug", "drugáil"],
    ["dump", "dumpáil"],
    ["murder", "dúnmharaigh"],
    ["coo", "durdáil"],
    ["naturalize", "eadóirsigh"],
    ["issue", "eisigh"],
    ["welcome", "fáiltigh"],
    ["bend", "feac"],
    ["debit", "féichiúnaigh"],
    ["inquire", "fiosraigh"],
    ["orbit", "fithisigh"],
    ["boil", "fiuch"],
    ["whip", "fuipeáil"],
    ["galvanize", "galbhánaigh"],
    ["braise", "galstobh"],
    ["guard", "gardáil"],
    ["gaff", "gathaigh"],
    ["gaff", "geafáil"],
    ["pawn", "geallearb"],
    ["shorten", "giorraigh"],
    ["humour", "giúmaráil"],
    ["lock", "glasáil"],
    ["activate", "gníomhachtaigh"],
    ["act", "gníomhaigh"],
    ["counterfeit", "góchum"],
    ["love", "gráigh"],
    ["scrutinize", "grinnigh"],
    ["brew", "grúdaigh"],
    ["sound", "grúntáil"],
    ["group", "grúpáil"],
    ["pray", "guigh"],
    ["hypnotize", "hiopnóisigh"],
    ["oil", "íligh"],
    ["immunize", "imdhíon"],
    ["outline", "imlínigh"],
    ["react", "imoibrigh"],
    ["revolve", "imrothlaigh"],
    ["circumscribe", "imscríobh"],
    ["intern", "imtheorannaigh"],
    ["purify", "íonaigh"],
    ["incriminate", "ionchoirigh"],
    ["incorporate", "ionchorpraigh"],
    ["fossilize", "iontaisigh"],
    ["enter", "iontráil"],
    ["foster", "altramaigh"],
    ["analyse", "anailísigh"],
    ["reiterate", "athluaigh"],
    ["refract", "athraon"],
    ["bowl", "babhláil"],
    ["bud", "bachlaigh"],
    ["boycott", "baghcatáil"],
    ["back", "baiceáil"],
    ["bag", "baig"],
    ["bruise", "ballbhrúigh"],
    ["embalm", "balsamaigh"],
    ["bank", "bancáil"],
    ["bait", "baoiteáil"],
    ["taper", "barrchaolaigh"],
    ["crochet", "cróiseáil"],
    ["cross", "crosáil"],
    ["strengthen", "láidrigh"],
    ["launch", "lainseáil"],
    ["lance", "lansaigh"],
    ["centralize", "láraigh"],
    ["map", "léarscáiligh"],
    ["electrify", "leictrigh"],
    ["spread", "leitheadaigh"],
    ["spell", "litrigh"],
    ["accelerate", "luasghéaraigh"],
    ["magnetize", "maighnéadaigh"],
    ["churn", "maistrigh"],
    ["curse", "mallaigh"],
    ["kill", "maraigh"],
    ["note", "nótáil"],
    ["enrol", "rollaigh"],
    ["roast", "róst"],
    ["cycle", "rothaigh"],
    ["enrich", "saibhrigh"],
    ["sign", "saighneáil"],
    ["harden", "cruaigh"],
    ["milk", "crúigh"],
    ["pelt", "crústaigh"],
    ["ride", "marcaigh"],
    ["market", "margaigh"],
    ["finger", "méaraigh"],
    ["mechanize", "meicnigh"],
    ["prostitute", "meirdrigh"],
    ["misappropriate", "mídhílsigh"],
    ["sweeten", "milsigh"],
    ["swear", "mionnaigh"],
    ["menstruate", "míostraigh"],
    ["vow", "móidigh"],
    ["delay", "moilligh"],
    ["monopolize", "monaplaigh"],
    ["manufacture", "monaraigh"],
    ["canonize", "naomhainmnigh"],
    ["invalidate", "neamhbhailigh"],
    ["burnish", "niamhghlan"],
    ["wash", "nigh"],
    ["mass-produce", "olltáirg"],
    ["export", "onnmhairigh"],
    ["honour", "onóraigh"],
    ["gild", "óraigh"],
    ["ornament", "ornáidigh"],
    ["pollinate", "pailnigh"],
    ["park", "páirceáil"],
    ["pasteurize", "paistéar"],
    ["patent", "paitinnigh"],
    ["pawn", "pánáil"],
    ["pare", "páráil"],
    ["parse", "parsáil"],
    ["sin", "peacaigh"],
    ["personify", "pearsantaigh"],
    ["pair", "péireáil"],
    ["picket", "picéadaigh"],
    ["peek", "píceáil"],
    ["pilot", "píolótaigh"],
    ["pitch", "pitseáil"],
    ["plane", "plánáil"],
    ["plant", "plandaigh"],
    ["plaster", "plástráil"],
    ["pleat", "pléatáil"],
    ["police", "póilínigh"],
    ["polarize", "polaraigh"],
    ["steep", "portaigh"],
    ["marry", "pós"],
    ["braze", "prásáil"],
    ["prime", "prímeáil"],
    ["print", "priontáil"],
    ["process", "próiseáil"],
    ["pulverize", "púdraigh"],
    ["powder", "púdráil"],
    ["pump", "pumpáil"],
    ["purge", "purgaigh"],
    ["raffle", "raifleáil"],
    ["row", "rámhaigh"],
    ["rap", "rapáil"],
    ["rasp", "raspáil"],
    ["rate", "rátáil"],
    ["guarantee", "ráthaigh"],
    ["dance", "rinc"],
    ["assign", "sann"],
    ["scan", "scan"],
    ["scandalize", "scannalaigh"],
    ["skate", "scátáil"],
    ["sketch", "sceitseáil"],
    ["ski", "sciáil"],
    ["skim", "scimeáil"],
    ["snatch", "sciob"],
    ["skip", "scipeáil"],
    ["screw", "scriúáil"],
    ["examine", "scrúdaigh"],
    ["seal", "séalaigh"],
    ["rivet", "seamaigh"],
    ["spit", "seiligh"],
    ["galvanize", "sincigh"],
    ["syndicate", "sindeacáitigh"],
    ["sign", "sínigh"],
    ["synchronize", "sioncrónaigh"],
    ["pacify", "síothaigh"],
    ["sugar", "siúcraigh"],
    ["shunt", "siúnt"],
    ["joint", "siúntaigh"],
    ["bat", "slac"],
    ["isolate", "leithlisigh"],
    ["appropriate", "leithreasaigh"],
    ["tar", "tarráil"],
    ["mobilize", "slóg"],
    ["smock", "smocáil"],
    ["smuggle", "smuigleáil"],
    ["sniff", "smúr"],
    ["polish", "snasaigh"],
    ["date", "dátaigh"],
    ["decimate", "deachaigh"],
    ["decimalize", "deachúlaigh"],
    ["deepen", "doimhnigh"],
    ["magnify", "formhéadaigh"],
    ["approve", "formheas"],
    ["endorse", "formhuinigh"],
    ["fry", "frioch"],
    ["counteract", "frithbheartaigh"],
    ["glue", "gliúáil"],
    ["glorify", "glóirigh"],
    ["glaze", "glónraigh"],
    ["gel", "glóthaigh"],
    ["invest", "infheistigh"],
    ["index", "innéacsaigh"],
    ["inseminate", "inseamhnaigh"],
    ["infiltrate", "insíothlaigh"],
    ["insulate", "insligh"],
    ["inject", "insteall"],
    ["libel", "leabhlaigh"],
    ["scorch", "ruadhóigh"],
    ["redden", "ruaigh"],
    ["solder", "sádráil"],
    ["simplify", "simpligh"],
    ["circumcise", "timpeallghearr"],
    ["specialize", "speisialaigh"],
    ["splice", "spladhsáil"],
    ["spray", "spraeáil"],
    ["sponge", "spúinseáil"],
    ["wire", "sreangaigh"],
    ["starch", "stáirseáil"],
    ["stage", "stáitsigh"],
    ["stamp", "stampáil"],
    ["stare", "stán"],
    ["staple", "stápláil"],
    ["sterilize", "steiriligh"],
    ["stew", "stobh"],
    ["cement", "stroighnigh"],
    ["strip", "struipeáil"],
    ["add", "suimigh"],
    ["suck", "súraic"],
    ["tabulate", "táblaigh"],
    ["nail", "tairneáil"],
    ["televise", "teilifísigh"],
    ["industrialize", "tionsclaigh"],
    ["wind", "tochrais"],
    ["toast", "tóstáil"],
    ["transpose", "trasuigh"],
    ["characterize", "tréithrigh"],
    ["dry", "triomaigh"],
    ["adulterate", "truaillmheasc"],
    ["report", "tuairiscigh"],
    ["laicize", "tuathaigh"],
    ["flood-light", "tuilsoilsigh"],
    ["adopt", "uchtaigh"],
    ["number", "uimhrigh"],
    ["anoint", "ung"],
    ["eclipse", "uraigh"],
    ["discharge", "urscaoil"],
    ["vaccinate", "vacsaínigh"],
    ["waltz", "válsáil"],
    ["waste", "vástáil"],
    ["x-ray", "x-ghathaigh"],
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
  ]; 


app.get('/', function (req, res) {
    res.render('index.ejs', {text1: null, text2: null, text3: null, text4: null, text5: null, error: null});
  })
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })

app.post('/', function (req, res) {
    var input = req.body.input;
    

    var tagged = tagger.tagSentence(input);

    var verb = "";
    var englishVerbs = [];

    var irishVerbResult = [];

    var q = 0;

    var englishVerb = "";
    var irishVerb = "";
    var irishPos = "";

    
    var irishVerbResult1 = "";
    var go = false;
    

    for(i=0; i<tagged.length; i++)
    {
            console.log(tagged[i]);
           

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
            
            if(input !== t2)
            { 
                text4 = "The English translation of the Irish is not the same as the text you entered.";
            }

            for(j=0;j<irishVerbResult.length;j++)
            {
                console.log(irishVerbResult[j]);
                if(t1LowerCase.indexOf(irishVerbResult[j])==-1&&(irishVerbResult[j].indexOf("?")==-1))
                {
                
                text5 += "The text you entered contained the verb \"" + englishVerbs[j] + "\", which, in this context, could be translated as \"" + irishVerbResult[j] + "\". ";
                
                }
            }


            res.render('index.ejs', {text1: text1, text2: text2, text3: text3, text4: text4, text5: text5, error: null});
      })
    }).catch(err => {
        res.render('index.ejs', {text1: null, text2: null, text3: null, text4: null, text5: null, error: 'Error, please try again'});
    })


});



