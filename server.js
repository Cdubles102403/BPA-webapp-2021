/**
 * @constant express    imports Express to do all the work
 * @constant chalk      imports Chalk, which lets colors be applied to text in the server's console
 */
const express = require("express");
const chalk = require("chalk");
const https = require("https");
const fs = require("fs");
const sql = require("sqlite3");
const bcrypt = require("bcrypt");
const sanitize = require("./resuables/sanitize.js");
const JWT = require("./resuables/JWTFunctions.js");
const credentials = {
  key: fs.readFileSync("SSLCerts/key.pem"),
  cert: fs.readFileSync("SSLCerts/cert.pem"),
};
/**
 * @constant app    runs express and actually makes the server work
 * @constant PORT   defines the port to run the server on
 */
const app = express();
const PORT = 443;
const saltRounds = 10;
const db = new sql.Database("database.db");

/**
 * Allows app to look at the ./public and ./views folders, which should contain everything neede client side
 */
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());
/**
 * Sends index.html when someone connects on the default root.
 */
app.get("/", (req, res) => {
  res.send("index.html");
});

function addParticipants(name,event){
//check if user is in event
let sql_findEventPartcipant = 'SELECT * FROM EventParticipantBridge WHERE name = ? AND event = ?'
let sql_addParticipant = 'INSERT INTO EventParticipantBridge (name,event) values(?,?)'
db.all(sql_findEventPartcipant,[name,event],(err,results)=>{
  if(err){console.error(err)}
  console.log(results)
  if(results.length==0){
    db.run(sql_addParticipant,[name,event],(err)=>{
      if(err){console.error(err)}
      return 'added'
    })
  }
  else{
    return 'notAdded'
  }

})
}

app.post("/login", (req, res) => {
  let username = sanitize.sanitize(req.body.Username);
  let password = sanitize.sanitize(req.body.Password);

  console.log(chalk.red(username) + " : " + chalk.blue(password));

  let sqlFindAccount = "SELECT * FROM accounts WHERE username = ?";
  db.all(sqlFindAccount, [username], (err, results) => {
    if (err) console.error(err);

    if (results.length >= 1) {
      console.log(results);
      //found user
      //check password
      bcrypt.compare(password, results[0].password, function (err2, result) {
        if (err2) console.error(err2);
        console.log(result);
        if (result) {
          let JWtoken = JWT.makeJWT(
            results[0].password,
            results[0].email,
            results[0].username
          );
          console.log(JWtoken);
          //succesful login
          console.log("good login");
          res.send({
            message: "successful-login",
            redirect: "home",
            token: JWtoken,
          });
        } else {
          //unsuccesful login
          console.log("bad login");
          res.send({ message: "check-username-and-password" });
        }
      });
    } else {
      //user not found
      console.log("bad login");
      res.send({ message: "check-username-and-password" });
    }
  });
});

//post request for signing up
app.post("/signup", (req, res) => {
  let insertUserSQL =
    "INSERT INTO accounts(username,Fname,Lname,email,password) values(?,?,?,?,?)";
  let checkUserSQL = "SELECT * FROM accounts WHERE username =?";
  //get all user data
  let username = sanitize.sanitize(req.body.username);
  let Fname = sanitize.sanitize(req.body.Fname);
  let Lname = sanitize.sanitize(req.body.Lname);
  let password = sanitize.sanitize(req.body.password);
  let email = sanitize.sanitize(req.body.email);

  db.all(checkUserSQL, [username], (err, results) => {
    if (err) console.error(err);
    console.log(results);
    if (results[0] != undefined) {
      //username already exists
      res.send({ message: "account-taken" });
    } else {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          //save data
          db.run(
            insertUserSQL,
            [username, Fname, Lname, email, hash],
            (err) => {
              if (err) console.error(err);
              let JWtoken = JWT.makeJWT(password, email, username);
              res.send({
                message: "account-made",
                redirect: "home",
                token: JWtoken,
              });
            }
          );
        });
      });
    }
  });
});

app.post("/makeEvent", (req, res) => {
  //fill variables
  let token = req.body.token;
  let decoded = JWT.verifyJWT(token)
  console.log(decoded)
  let maker = decoded.data.username;
  console.log(maker)
  let name = req.body.eventName;
  let place = req.body.eventPlace;
  let time = req.body.eventTime;
  let participantTable = `${name}Participants`;

  console.log(`${name}: ${time}: ${place}`);
  //check if event name is taken
  sql_checkEvent = "SELECT * FROM events WHERE name = ?";
  db.all(sql_checkEvent, [name], (err, results) => {
    if (err) {console.error(err);}
    console.log(results.length);
    if (results.length < 1) {
      //fill in event data
      sql_makeEvent = "INSERT INTO events(name,time,place,partipantsTable) values(?,?,?,?)";
      db.run(sql_makeEvent, [name, time, place, participantTable], (err) => {
        if (err) console.error(err);
        console.log(`made ${name} event`);
        //make event participant table
        let addResults = addParticipants(maker,name)
      });
    } else {
      console.log(`event ${name} already exists`);
    }
  });

  //make event participants table
  res.send("event made");
});
//get a list of all events
app.get('/getAllEvents',(req,res)=>{

})

//get person specific events
app.post('/getMyEvents',(req,res)=>{
  let token = req.body.token
  let decoded = JWT.verifyJWT(token)
  let name = decoded.data.username

  let sql_getMyEvents = 'SELECT * FROM EventParticipantBridge WHERE name = ? '
  //get all of a persons events
  db.all(sql_getMyEvents,[name],(err,results)=>{
    if(err){console.error(err)}

    console.log(results)
    //get event data
    let data =''
    //collect all events
    for(let i = 0; i<results.length;i++){
      data += `"${results[i].event}", `
    }
    data = data.substring(0, data.length - 2);
    console.log(data)
    let sql_getEventData = `SELECT name,place,time FROM events WHERE name IN (${data})`
    db.all(sql_getEventData,[],(err2,results2)=>{
      if(err2){console.error(err2)}
      console.log(results2)

      res.send({message:'myEvents',eventNames:results,eventData:results2})
    })
    
  })
})
//join an event
app.post('/joinEvent',(req,res)=>{
  //mak variables
  let token = req.body.token;
  let event = req.body.event;
  let decodedToken = JWT.verifyJWT(token)

  let results = addParticipants(decodedToken.data.username,event)

  if(results=='added'){
    res.send('added to event')
  }
  else{
    res.send('already in event')
  }
})

/**
 * Starts the server listening on PORT, and logs in the console that the server has started
 */
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => console.log(chalk.yellow("Server started on port " + chalk.green(PORT))));
