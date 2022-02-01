const express = require('express');
const mysql = require('mysql');
const jwt= require('jsonwebtoken');
const bodyParser = require("body-parser");


const app = express();
const {SECRET} = require("./keys"); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

//connecting database

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"nemisis"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    else
    console.log("Connected!");
  });



app.get('/', function (req, res) {
       res.render(__dirname+"/views/Login.ejs");
})
app.get('/Login', function (req, res) {
  res.render(__dirname+"/views/Login.ejs"); 
})
app.get('/Signup',function(req,res){
    var sql='SELECT * FROM info';
  con.query(sql, function (err, data, fields) {
  if (err) throw err;
  res.render('Signup', { title: 'Signup', info: data});
})
})
     
     
app.post('/login_server', function(req, res) {
        console.log(req.body);
        if (!(req.body.username === 'admin@namasys.co' && req.body.password === 'admin123')) {
          res.status(401).send('Wrong user or password');
          console.log('failed login');
        
          return;
        }
        else if ((req.body.username === 'admin@namasys.co' && req.body.password === 'admin123')){

        const token = jwt.sign({username: req.body.username},SECRET,{
          expiresIn:'5s'
        })
        console.log(token);
        console.log('successful login');
         return res.json({token});
      }
      else 
      jwt.destroy(token);
      res.redirect('Login')
    })

    app.post('/Signup', function(req,res,next){
        var name = req.body.name;
        var number = req.body.number;
        var email= req.body.email;
        var address= req.body.address;

        var sql= `insert into info values ("${name}","${number}","${email}","${address}")`;
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log('record inserted');
            res.redirect('Signup');
          });
    })

app.listen(3000, () => {
    console.log("Server is running on port 3000");
  })