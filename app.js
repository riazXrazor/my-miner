require('dotenv').config();
const express = require("express");
const axios = require('axios');
const app = express();
const router = express.Router();
const bodyParser     = require('body-parser');
const sgMail = require('@sendgrid/mail');
const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function getCryptoPrices() {
   return axios.get('https://koinex.in/api/ticker');
}

bot.on(['/start'], (msg) => {
    return bot.sendMessage(msg.from.id, `Welcome, <b>${msg.from.first_name}!</b>
    I am a telegram bot which can provide you with updated on the popular crypto currency prices in INR and keep you up to date with the latest as crypto currency informations as and when required.
    Here is a list of commands you can run on me.
    /prices - get the latest prices of the popular crypto currencies.
    /stats@ETH - ETHEREUM stats
    /stats@BTC - BITCOIN stats
    /stats@LTC - LITECOIN stats
    /stats@XRP - RIPPLE stats
    /stats@BCH - BITCOIN CASH stats
    
    All data are from the popular crypto currency exchange <a href="https://koinex.in">KOINX</a>
    
    - Made by <a href="http://riazxrazor.in">Riaz Laskar</a>
    `,{parseMode : 'HTML'});
});

bot.on(['/prices'], (msg) => {
    return getCryptoPrices()
        .then(({ data }) => {
            return bot.sendMessage(msg.from.id,
                `BTC : INR ${data.prices['BTC']}
                ETH : INR ${data.prices['ETH']}
                XRP : INR ${data.prices['XRP']}
                BCH : INR ${data.prices['BCH']}
                LTC : INR ${data.prices['LTC']}`);
        })
        .catch(e => {
            return bot.sendMessage(msg.from.id, e.message);
        })

});

bot.on(['/hello'], (msg) => {
    return bot.sendMessage(msg.from.id, `Hello, ${ msg.from.first_name }!`);
});

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

router.get("/about",function(req,res){
   res.render("about");
});

router.get("/test",function(req,res){
   res.render("test");
});

router.get("/celeberate",function(req,res){
   res.render("celeberate");
});


app.use("/",router);

app.use("*",function(req,res){
  res.render("404");
});
var port = 8080;
app.listen(port,function(){
  console.log("Live at Port "+port);
  bot.start();
});
