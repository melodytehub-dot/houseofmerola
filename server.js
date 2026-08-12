const http = require('http');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res);
  }).listen(3000, '127.0.0.1', (err) => {
    if (err) throw err;
    console.log('> Ready on http://127.0.0.1:3000');
  });
});
