const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin
});

const client = net.createConnection({
  host: 'localhost',
  port: 9876
});

client.on('error', (error) => { // server not ready
  console.log(`Error in connection to server: ${error.message}`)
  rl.close();
})

client.setEncoding('utf8');

rl.on('line', (input) => { // listen to any input event (return character)!
  client.write(`${input}\n`);
});

client.on('data', message => { // write
  if (message.includes('"type": "JSON"')) {
    console.log(JSON.parse(message).document);
  } else {
    console.log(message);
  }
});

client.on('end', () => {  // server disconnect
  console.log('🔺🔻 server disconnected');
  rl.close();
});