let express = require("express");
let path = require("path");

let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);

app.use("/", express.static(path.join(__dirname, "dist/w11")));

var pollObj = {
  question: "Why did you choose FIT2095?",
  options: [
    { text: "I love coding!", value: 0, count: 0 },
    { text: "Relevant to my career", value: 1, count: 0 },
    { text: "Don't ask me about it", value: 2, count: 0 },
    { text: "Seemed interesting", value: 3, count: 0 },
    { text: "Prereq for another unit", value: 4, count: 0 },
  ],
};

io.on("connection", function(socket) {
  console.log("new connection made from client with ID="+socket.id);
  io.sockets.emit('display', pollObj);


    socket.on("newVote", function(data){
      io.sockets.emit("vote", countVote(data.vote));
      socket.broadcast.emit("msg", socket.id + "has just voted!");
    });
    
      
  });

function countVote(vote){
  for(let i in pollObj.options){
    if(vote == pollObj.options[i].value ){
      pollObj.options[i].count++;
      return pollObj;
    }
  }
}

let port = 8080;
server.listen(port, () => {
  console.log("Listening on port " + port);
});


