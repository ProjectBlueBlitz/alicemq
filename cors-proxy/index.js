var host = '0.0.0.0';
var port = 4000;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});