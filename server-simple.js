const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<!DOCTYPE html><html><head><title>House of Merola</title></head><body><header><nav><a href="/">Logo</a><a href="/shop">Shop</a></nav></header><section><h1>Hero Title</h1><img src="/hero.jpg" /></section><footer>Newsletter</footer></body></html>');
});
server.listen(3000, '0.0.0.0', () => {
  console.log('Simple HTTP server listening on 0.0.0.0:3000');
});
