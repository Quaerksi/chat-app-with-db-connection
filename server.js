const express = require('express');
const socketIo = require('socket.io');
const cors = require("cors");
const http = require("http");
require('dotenv').config();

const axios = require('axios');

const PORT = process.env.PORT || 3000;
// const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static("public"));
//parse request of content-type - application/json
app.use(express.json());
//parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

var corsOptions = {
  origin: process.env.ORIGIN,
};

app.use(cors(corsOptions));

app.set('views', './views');
app.set('view engine', 'ejs');

const webServer = http.Server(app);
const io = socketIo(webServer)

//for DB
const dbNetwork = require("./app/models");
dbNetwork.initial();
const db = dbNetwork.db();

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
      console.log("Connected to the database");     
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

    require("./app/routes/tutorial.routes")(app);


let users = {};
let rooms = []

app.get('/', (req, res) => {
    res.render('welcome' );
  });

app.get('/index/user/:user', (req, res) => {
  if(users[req.params.user] == null){
    return res.redirect('/')
  }

  res.render('index', {rooms: rooms , user: req.params.user})
});

app.post('/index', (req, res) => {

  if(users[req.body.newUser] != null || req.body.newUser.includes(' ')){
    return res.redirect('/'); 
  }

  //start user management
  users[req.body.newUser] = {}
  io.emit('user names', Object.keys(users)); 

  //read room names from db
  axios.get('http://localhost:8080/api/tutorials/')
  .then(function(response) {
    // console.log(`Response: ${Object.keys(response)}, ${response.data}`);
    rooms = response.data;
    rooms.forEach(name => {
      axios.post('http://localhost:8080/api/tutorials/newroom',{
      message: 'room created',
      room: name      
    }).then(function (response) {
      // console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  })
})
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function(){
     return res.render('index', {rooms: rooms, user: req.body.newUser});
  });
})

app.get('/room/:room/user/:user', (req, res) => {

  const roomWithWhiteSpaces = req.params.room.replace(/\+/g, " ")
  //make plus in room to whitespace
  if (users[req.params.user] == null|| !rooms.includes(roomWithWhiteSpaces)) {
    return res.redirect('/')
  }

  //get all Chat messages
  answer = '';
  axios.get(`http://localhost:8080/api/tutorials/allChatEntrys/${roomWithWhiteSpaces}`)
  .then(function(response) {
      response.data.forEach(msg => console.log(`Message ${msg}`))
      //  console.log(`Type: ${response.data}`)
        if(response.data != ''){
          answer = response.data;
        }
        // console.log(`answer ${answer}`)
        if(answer != '') {
          answer = JSON.stringify(answer);
        }
      return res.render('room', {room:roomWithWhiteSpaces, user:req.params.user, messages:answer});
    })
  .catch(function (error) {
    // handle errors
    console.log(error);
  })

});


//create room
  app.post('/room', (req, res) => {
  
  //console.log(`Room ${req.body.roomName}, User ${req.body.roomUser}`)
    if (rooms.includes(req.body.roomName)) {
     return res.render('index', {rooms: rooms, user: req.body.roomUser});
  }
  
    rooms.push(req.body.roomName)

    //create new collection
    axios.post('http://localhost:8080/api/tutorials/newroom',{
      room: req.body.roomName      
    }).then(function (response) {
      // console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

    res.render('room', {room:req.body.roomName, user: req.body.roomUser, messages:''});
    io.emit('new room created', req.body.roomName);
 });

 //  ***********************function*************************************************************************

 let usersInRoom = (room) => {

  let usersInRoom = [];

  Object.keys(users).forEach(name => {
    if(typeof users[name][room] !== 'undefined'){
      usersInRoom.push(name)
    }
  })
  // console.log(`Who is online: ${usersInRoom.toString()}`)

  return usersInRoom;
  
}

//  ***********************io*************************************************************************
io.on('connection', (socket) => {

  //socket disconnect
  socket.on('disconnect', () => {

    let index2;
    let index1 = Object.values(users).findIndex((object) => {
        
      //find right entry -> SocketId for room
        let find = Object.values(object).find((mySocket, i, arr) => {

          // console.log(`MySocket: ${JSON.stringify(Object.keys(mySocket))}, ${mySocket['id']}`);
          if(mySocket['id'] == socket.id){
            index2 = i;
            return true
          } else {
            return false;
          }
        }) 
        return find == null ? false : true;   
      }) 

      // console.log(`Disconnect: index1 = ${index1}, index2 = ${index2}`);

      //if socket disconnect from a chat room, then delete entry and send message to the remaining chat members
      if(typeof Object.values(users)[index1] !== 'undefined' ){

        const name = Object.keys(users)[index1];
        if(typeof Object.values(users[name])[index2] !== 'undefined') {
      
            const room = Object.keys(users[name])[index2]
            socket.to(room).emit('chat message', `${name} left`);
            socket.leave(socket);
            // console.log(`Leave  ${room}, ${name}`)
            delete users[name][room];
        } else {
          // console.log(`Error in index2`)
        } 
      } else {
        // console.log(`Error in index1`)
      }
    });

    //handle new user connections
    socket.on('new chat member', (room, user) => {

      //if user enters a chat second time
      if(typeof users[user][room] !== 'undefined'){
        
        socket.to(room).emit('chat message', `${user} left`)
        users[user][room].emit('chat message', `${user} connected again. You got disconnected`)
        //leave with old socket
        users[user][room].leave(room);
      }

      //enter with new socket
      users[user][room] = socket;
      socket.join(room);
      // console.log(`Join ${room}, ${user}`)
      //send message to chat members
      socket.to(room).emit('chat message', `${user} has joined`);

      //who is online, send to socket
      let usersInRoomOnline = usersInRoom(room);
      usersInRoomOnline.length > 1 
      ? socket.emit('chat message', `Online: ${usersInRoom(room).filter(name => name!= user).toString()}`)
      : socket.emit('chat message', `You are alone`)

    });

    socket.on('send user names', () => {
      socket.emit('user names', Object.keys(users));      
    })

    //broadcast messages  
    socket.on('chat message', (room, user, msg) => {
      const chatMessage = `${user}: ${msg}`;
      //save chat message in db
      axios.post('http://localhost:8080/api/tutorials/',{
        message: chatMessage,
        room: room     
      }).then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

        // socket.post('/api/turorials/', {message: chatMessage, room: room})
        socket.to(room).emit('chat message', chatMessage);
    });
});

webServer.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});