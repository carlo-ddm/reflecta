import * as http from 'node:http';

const server = http.createServer((req, res) => {
const greetings = 'Hello world!';
console.log(greetings)
});

server.listen(3000);
