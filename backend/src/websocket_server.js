Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.WsServer = void 0;
  
  var _ws = require("ws");
  var _fs = require("fs");

  var _scom = require("./scomrunner.js");
  
  var _findFreePort = _interopRequireDefault(require("find-free-port"));
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  // let WebSocketServer = require('ws');
  const PING_CHECK_INTERVAL = 1000;

  let nowScomID;
  let isConnecting = false;
  let scomWebSocket;
  
  function heartbeat() {
    this.isAlive = true;
  }
  
  class WsServer {
    init(APP_PORT, isDebug) {
      return new Promise((resolve, reject) => {
        try {
          this.isDebug = isDebug;
          (0, _findFreePort.default)(APP_PORT).then(([freep]) => {
            this.port = freep;
            
            // region //
            // make WebSocket for VueJS(FrontEnd)
            const wss = new _ws.WebSocketServer({
              port: this.port
            });
            this.wss = wss;
            wss.on('connection', ws => {
              ws.isAlive = true;
              ws.on('pong', heartbeat);
              // msg = { action: '액션' , data: {데이터 구조체}}
              ws.on('message', data => {
                // isDebug ? console.log('received: %s', data) : isDebug;
                try{
                  let msg = JSON.parse(data);

                  switch(msg.action){
                    case 'get_config':
                      let target = msg.data.target;
                      if(target === 'all'){
                        let files = _fs.readdirSync('./scom_configs/');
                        
                        let obj = {
                          'action': 'get_config_all',
                          'data': files
                        }
                        ws.send(JSON.stringify(obj));
                      }
                      else if(target){
                        let dir = './scom_configs/' + target + '.conf';
                        // let file = _fs.readFileSync('./scom_configs/test.conf');
                        let file = _fs.readFileSync(dir, 'utf8').toString();
                        let obj = {
                          'action' : 'get_config',
                          'data' : file,
                          'isConnecting' : isConnecting,
                        }
                        nowScomID = msg.data.target;
                        ws.send(JSON.stringify(obj));
                      }
                      else{
                        
                      }
                      break;
                    case 'set_config': {
                      let obj = {
                        'action' : 'set_config_reply',
                      }
                      try{
                        let config = JSON.stringify(msg.data);
                        let dir = './scom_configs/' + msg.data.SEComID + '.conf';
                        if(!_fs.existsSync('./scom_configs'))
                          _fs.mkdirSync('./scom_configs')

                        _fs.writeFileSync(dir, config, 'utf8', function(err){
                          if(err) console.log(err);
                        });
                        obj.data = {
                          result:'success',
                          target:msg.data.SEComID
                        }
                      }
                      catch(ex){
                        obj.data = ex;
                      }
                      ws.send(JSON.stringify(obj));
                      break;
                    }

                    case 'scom_start':{
                      _scom.start(this.getPort());
                      let obj = {
                        'action':'scom_start_reply',
                        'data':'success'
                      }
                      isConnecting = true;
                      ws.send(JSON.stringify(obj));
                      break;
                    }
                    case 'scom_stop':{
                      _scom.stop();
                      let obj = {
                        'action':'scom_stop_reply',
                        'data':'success'
                      }
                      isConnecting = false;
                      ws.send(JSON.stringify(obj));
                      break;
                    }
                      
                    case 'runner_started': {
                      let obj = {
                        'action':'get_scom_config',
                        'data': '',
                        'driverID': nowScomID,
                      }

                      try{
                        obj.data = (_fs.readFileSync('./scom_configs/' + nowScomID + '.conf')).toString();
                      }catch(ex){
                        obj.data = ex;
                      }
                      ws.send(JSON.stringify(obj));
                      scomWebSocket = ws;
                      break;
                    }

                    case 'send_scom_msg':{
                      let obj = {
                        'action':'send_scom_msg',
                        'data': msg.data
                      }
                      scomWebSocket.send(JSON.stringify(obj));
                      break;
                    }
                      
                  }
                }catch(ex){
                  isDebug ? console.error('--- json msg parse error ---') : isDebug;
                  isDebug ? console.error(ex) : isDebug;
                }
              });
            });
            const interval = setInterval(function ping() {
              wss.clients.forEach(function each(ws) {
                if (ws.isAlive === false) return ws.terminate();
                ws.isAlive = false;
                ws.ping();
              });
            }, PING_CHECK_INTERVAL);
            wss.on('close', function close() {
              clearInterval(interval);
              _scom.stop();
            });
            isDebug ? console.log('Example WebSocketServer listening on port', this.port) : isDebug;

            resolve();
          }).catch(err => {
            isDebug ? console.error(err) : isDebug;
          });
        } catch (ex) {
          reject(new Error(ex));
        }
      });
    }
  
    getPort() {
      return this.port;
    }
  
    close() {
      this.wss.close();
      _scom.stop();
      this.isDebug ? console.log('WebSocket server was closed.') : isDebug;
    }
  
  }
  
  exports.WsServer = WsServer;