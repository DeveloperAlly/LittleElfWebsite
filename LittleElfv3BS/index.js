
const app = require('./app1');

//TODO: set port
//TODO: set ip

//listen on port: PORT, ip: IP
//app.set('port', process.env.PORT || 5000);
//app.set('ip', process.env.IP || '0.0.0.0');
app.set('port', process.env.PORT || 8080);
app.set('ip', process.env.IP || '0.0.0.0');
const server = app.listen(app.get('port'), app.get('ip'), (err) => {
  if (err) {
    return console.error('err', err);
  }
  const port = server.address().port;
  console.log('Little Elf Server has started on port', port);
});
