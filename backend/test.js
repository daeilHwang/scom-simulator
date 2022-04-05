const APP_PORT = 8000;
const IS_DEBUG = true;

var _express_server = require("./src/express_server.js");
var _websocket_server = require("./src/websocket_server.js");

let expServer, expPort, wsServer, wsPort;

async function initBackServers() {
    expServer = new _express_server.ExpressServer();
    await expServer.init(APP_PORT, IS_DEBUG);
    expPort = expServer.getPort();
    wsServer = new _websocket_server.WsServer();
    await wsServer.init(APP_PORT, IS_DEBUG);
    wsPort = wsServer.getPort();

    expServer.app.get('/wsport', (req,res) => {
        res.json({
            port: wsServer.getPort(),
        });
    })
}
initBackServers();