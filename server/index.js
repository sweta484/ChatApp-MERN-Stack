const express = require('express');
const app = express();
const http = require('http').Server(app);
app.use('/',express.static(__dirname));
const path = require('path');
require('dotenv').config();
//const io = require('socket.io')(http);

const rsa = require('./init');
const crypto = require('crypto');

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;


const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
    }
  });


const Message = require('./Message');
const mongoose = require('mongoose');


mongoose.connect(uri , {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//it will serve all files in client directory under the '/' route        
app.use('/', express.static(path.join(__dirname, '/client','/server')));

//and the client side scripts installed through npm will be served under '/scripts' route
app.use('/scripts', express.static(path.join(__dirname, '/client/node_modules')))

io.on('connection', (socket) => {

  // Get the last 10 messages from the database.
  Message.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
    if (err) return console.error(err);
      messages.forEach(function(part) {
        part.content = rsa.decrypt(rsa.sPrikey,part.content);
      });
   // Send the last messages to the user.
    socket.emit('init', messages);
  });

  // Listen to connected users for a new message.
  socket.on('message', (msg) => {
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: rsa.encrypt(rsa.sPubkey,msg.content),
      name: msg.name,
    });

    // Save the message to the database.
    message.save((err) => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
   // socket.broadcast.emit('push', msg);
  });
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});