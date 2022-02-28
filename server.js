const net = require('net');
const PORT = 9876;

const server = net.createServer();

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

let id = 0;
const nextId = () => id +=1;
const listOfClients = [];

const broadcastMessage = function(message,curClient,listOfClients) {
  for (const client of listOfClients) {
    if ( client.id !== curClient.id) {
      client.write(`\rID ${curClient.id}: ${message}`)
    }
  }
};

const onlineClients = function(listOfClients) {
  idList = [];
  for (const client of listOfClients) {
    idList.push(`ID${client.id}`);
  }
  return idList;
};

server.on('connection',(socket) => {
  socket.setEncoding('utf8');

  socket.id = nextId();
  listOfClients.push(socket);

  console.log(`${socket.id} is connected to the server.`);

  socket.write(`🔺 ID ${socket.id}, you are connected. 🔻`); // write
  socket.write(`\n🔺 Online users: ${onlineClients(listOfClients)} 🔻`);

  broadcastMessage(`🔸🔸 joined.`,socket,listOfClients);
  
  
  socket.on('data', message => { // listen for data
    console.log(`${socket.id}: ${message}`);
    if (message == '*123#') { // Why not worksssssssss!!
      socket.write(`Online user: ${onlineClients}`);
    } else {
      broadcastMessage(message,socket,listOfClients);
    }
  })
  
  socket.on('end', () => { // client exit
    console.log(`${socket.id} left.`)
    const i = listOfClients.indexOf(socket);
    listOfClients.splice(i,1);
    broadcastMessage(`🔹🔹 left.`,socket,listOfClients);
  })

})