require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const tailwindo = require("tailwindo");
const spdy = require('spdy');
const fs = require('fs');


app.set("view engine", "ejs");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(express.static(__dirname + "/assets"));
router.use(function (req, res, next) {
  console.log("/" + req.method);
  next();
});

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/cool-avatar-gif", function (req, res) {

  res.set('location', 'https://avatar-gif.netlify.app');
  res.status(301).send()
  
  // var avatar =  md5(req.query.email || 'riazcool77@gmail.com')
  // res.render("repo",{
  //   avatar: avatar,
  // });
});

router.get("/mining", function (req, res) {
  res.render("mining");
});

router.get("/help-me", function (req, res) {
  res.render("mining");
});

router.get("/contact", function (req, res) {
  res.render("contact", req.query);
});

router.get("/bootstrap-to-tailwind", function (req, res) {
  res.render("bs2tw");
});
router.post("/tailwindo", function (req, res) {
  $input = req.body.html; //BootstrapCSS code
  res.send(tailwindo($input)); // gets converted code
});


router.post("/contact", function (req, res) {
  console.log(JSON.stringify(req.body));

  let txt =
    "<p><strong>Name:</strong> " +
    req.body.name +
    "</p><p><strong>Email:</strong> " +
    req.body.email +
    "</p><p><strong>Phone:</strong> " +
    req.body.phone +
    "</p><p><strong>Query:</strong> " +
    req.body.message +
    "</p>";
  const msg = {
    to: "riazcool77@gmail.com",
    from: req.body.email,
    subject: "riazxrazor.in : website query",
    text: req.body.message,
    html: txt,
  };
  sgMail.send(msg);

  res.redirect("/contact?msg=Thank you, i will get in touch with you soon.");
});

router.get("/arduino-view", function (req, res) {
  res.render("arduino");
});

router.get("/about", function (req, res) {
  res.render("about");
});
//
//266348

router.get("/folding@home", function (req, res) {
  const n = new Date();
  fetch("https://stats.foldingathome.org/api/team/266348?n=" + n, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((r) => r.json())
    .then((r) => {
      res.render("folding", r);
    });
});


router.get("/google035b4f68dd40b02d.html", function (req, res) {
  res.send("google-site-verification: google035b4f68dd40b02d.html");
});

app.use("/", router);

app.use("*", function (req, res) {
  res.render("404");
});
var PORT = 3000;
// app.listen(port,function(){
//   console.log("Live at Port "+port);
//   // bot.start();
// });

/* var io = require("socket.io").listen(
  app.listen(port, function () {
    console.log("Live at Port http://localhost:" + port);
    // bot.start();
  })
);

io.sockets.on("connection", function (socket) {
  router.get("/arduino", function (req, res) {
    if (req.query.cid) io.sockets.emit("update", req.query.cid);

    res.send(JSON.stringify(req.query));
  });
}); */
let keypath =  'keys/privkey3.pem'
let certpath = 'keys/fullchain3.pem'
if(process.env.env === 'PROD'){
 keypath = process.env.keyspath+'/privkey3.pem'
 certpath = process.env.keyspath+'/fullchain3.pem'
}

spdy.createServer({
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath)
}, app).listen(PORT, 'localhost', () => {
  console.log(`HTTP/2 Express running at https://localhost:${PORT}`)
});
