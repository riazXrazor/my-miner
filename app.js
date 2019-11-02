require('dotenv').config();
const express = require("express");
const axios = require('axios');
const app = express();
const router = express.Router();
const bodyParser     = require('body-parser');
const sgMail = require('@sendgrid/mail');
const humanizeString = require('humanize-string');
const tailwindo = require('tailwindo');

// const TeleBot = require('telebot');
// const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/*function getCryptoPrices() {
   return axios.get('https://koinex.in/api/ticker');
}

bot.on(['/start','/help'], (msg) => {
    return bot.sendMessage(msg.from.id, `Welcome, <b>${msg.from.first_name}!</b>
    I am a telegram bot which can provide you with updated on the popular crypto currency prices in INR and keep you up to date with the latest crypto currency informations as and when required.
    Here is a list of commands you can run on me.
    /prices - All currency prices
    /ETH - ETHEREUM stats
    /BTC - BITCOIN stats
    /LTC - LITECOIN stats
    /XRP - RIPPLE stats
    /BCH - BITCOIN CASH stats
    
    All data are from the popular crypto currency exchange <a href="https://koinex.in">KOINEX</a>
    
    - Made by <a href="http://riazxrazor.in">Riaz Laskar</a>
    `,{parseMode : 'HTML'});
});

bot.on(['/prices'], (msg) => {
    return getCryptoPrices()
        .then(({ data }) => {
            let prices = data.prices;
            let response = '';
            for(coin in prices)
            {
                response+= '<a href="/'+coin+'">'+coin + '</a> : INR '+prices[coin]+'\n';
            }
            return bot.sendMessage(msg.from.id, response,{parseMode : 'HTML'});
    })
        .catch(e => {
            return bot.sendMessage(msg.from.id, e.message);
        })

});

bot.on(['/ETH','/BTC','/XRP','/BCH','/LTC','/GNT','/OMG','/MIOTA'], (msg) => {

    let txt = msg.text.replace('/','');
    return getCryptoPrices()
        .then(({ data }) => {
            let stats = data.stats[txt];
            let response = '';
            for(stat in stats)
            {
                response+= humanizeString(stat) + ' : INR '+stats[stat]+'\n';
            }
            return bot.sendMessage(msg.from.id, response);
        })
        .catch(e => {
            return bot.sendMessage(msg.from.id, e.message);
        })
});

bot.on(['/hello'], (msg) => {
    return bot.sendMessage(msg.from.id, `Hello, ${ msg.from.first_name }!`);
});*/

app.set('view engine', 'ejs');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(__dirname + '/assets'))
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.render("index");
});

router.get("/mining",function(req,res){
  res.render("mining");
});

router.get("/help-me",function(req,res){
  res.render("mining");
});

router.get("/contact",function(req,res){
  res.render("contact",req.query);
});

router.get("/bootstrap-to-tailwind",function(req,res){
  res.render("bs2tw");
});
router.post("/tailwindo",function(req,res){
  $input = req.body.html; //BootstrapCSS code
  res.send(tailwindo($input)) // gets converted code
});

router.get("/binod",function(req,res){
   res.render("hbd");
});


router.post("/contact",function(req,res){
  console.log(JSON.stringify(req.body));
  
let txt = '<p><strong>Name:</strong> '+req.body.name+'</p><p><strong>Email:</strong> '+req.body.email+'</p><p><strong>Phone:</strong> '+req.body.phone+'</p><p><strong>Query:</strong> '+req.body.message+'</p>';
const msg = {
  to: 'riazcool77@gmail.com',
  from: req.body.email,
  subject: 'riazxrazor.in : website query',
  text: req.body.message,
  html: txt,
};
sgMail.send(msg);
  
  res.redirect('/contact?msg=Thank you, i will get in touch with you soon.');
});

router.get("/arduino-view",function(req,res){
  res.render("arduino");
});



router.get("/about",function(req,res){
   res.render("about");
});

router.get("/test",function(req,res){
   res.render("test");
});

router.get("/celeberate",function(req,res){
   res.render("celeberate");
});

router.get("/zuchamo",function(req,res){
  res.render("zuch");
});

router.get("/google035b4f68dd40b02d.html",function(req,res){
  res.send("google-site-verification: google035b4f68dd40b02d.html")
});


app.use("/",router);

app.use("*",function(req,res){
  res.render("404");
});
var port = 8080;
// app.listen(port,function(){
//   console.log("Live at Port "+port);
//   // bot.start();
// });

var io = require('socket.io').listen(app.listen(port,function(){
  console.log("Live at Port "+port);
  // bot.start();
}));

io.sockets.on('connection', function (socket) {
  router.get("/arduino",function(req,res){
    if(req.query.cid)
      io.sockets.emit('update', req.query.cid);

      res.send(JSON.stringify(req.query));
  });
});


