"use strict";
 
var srv = require('http').Server();
var io = require('socket.io')(srv);
var port = 9001;
srv.listen(port);
console.log('signaling server started on port:' + port);

io.on('connection', function(socket) {
    socket.on('enter', function(roomname) {
      socket.join(roomname);
      console.log('id=' + socket.id + ' enter room=' + roomname);
      setRoomname(roomname);
    });
 
    function setRoomname(room) {
      socket.roomname = room;
    }
 
    function getRoomname() {
      var room = socket.roomname;
      return room;
    }
 
    function emitMessage(type, message) {
      var roomname = getRoomname();
      if (roomname) {
        console.log('===== message broadcast to room -->' + roomname);
        socket.broadcast.to(roomname).emit(type, message);
      }
      else {
        console.log('===== message broadcast all');
        socket.broadcast.emit(type, message);
      }
    }

    socket.on('message', function(message) {
        var date = new Date();
        message.from = socket.id;
        console.log(date + 'id=' + socket.id + ' Received Message: ' + JSON.stringify(message));
        var target = message.sendto;
        if (target) {
          console.log('===== message emit to -->' + target);
          socket.to(target).emit('message', message);
          return;
        }
        emitMessage('message', message);
    });
 
    socket.on('disconnect', function() {
        console.log((new Date()) + ' Peer disconnected. id=' + socket.id);
        emitMessage('user disconnected', {id: socket.id});
        var roomname = getRoomname();
        if (roomname) {
          socket.leave(roomname);
        }
    });
 
});