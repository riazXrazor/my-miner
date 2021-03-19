require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const tailwindo = require("tailwindo");
const spdy = require('spdy');
const fs = require('fs');
const path = require('path');
const url = require('url')
const logger = require('morgan')

app.set("view engine", "ejs");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(express.static(__dirname + "/assets"));
app.use(logger('dev'))
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.join(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};
const files = {}
walk('views',(err,data) => {
    data.forEach(name=>{
      if(!name.includes('partials')) return;
      files[`${name}`]=fs
        .readFileSync(name, {encoding: 'utf8'})
        .split('\n')
        .filter(line=>line.match(/src *?= *?"(.*)"/)!=null)
        .map(line=>line.match(/src *?= *?"(.*)"/)[1])
    })

})





app.get('/pushy', (req, res) => {
  var stream = res.push('/main.js', {
    status: 200, // optional
    method: 'GET', // optional
    request: {
      accept: '*/*'
    },
    response: {
      'content-type': 'application/javascript'
    }
  })
  stream.on('error', function() {
  })
  stream.end('alert("hello from push stream!");')
  res.render("index");
})

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
var PORT = process.env.PORT || 3000;
app.listen(PORT,function(){
  console.log("Live at Port "+PORT);
  // bot.start();
});

/* var io = require("socket.io").listen(
  app.listen(port, function () {
    console.log("Live at Port https://localhost:" + port);
    // bot.start();
  })
);

io.sockets.on("connection", function (socket) {
  router.get("/arduino", function (req, res) {
    if (req.query.cid) io.sockets.emit("update", req.query.cid);

    res.send(JSON.stringify(req.query));
  });
}); */
//  let keypath =  'keys/privkey3.pem'
//  let certpath = 'keys/fullchain3.pem'
// if(process.env.ENV === 'PROD'){
//  keypath = process.env.keyspath+'/privkey3.pem'
//  certpath = process.env.keyspath+'/fullchain3.pem'
// }


// spdy.createServer({
//   key: fs.readFileSync(keypath),
//   cert: fs.readFileSync(certpath)
// }, app).listen(PORT, 'localhost', () => {
//   console.log(`HTTP/2 Express running at https://localhost:${PORT}`)
// });
