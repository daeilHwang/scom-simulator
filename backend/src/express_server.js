Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ExpressServer = void 0;
  
  var _express = _interopRequireDefault(require("express"));
  
  var _findFreePort = _interopRequireDefault(require("find-free-port"));

  const path = require('path');

  const cors = require('cors');
  const whitelist = ['http://localhost:8080', 'http://localhost:8081'];
  const corsOptions = {
    origin: function(origin, callback){
      if(whitelist.indexOf(origin) !== -1){
        callback(null, true);
      }
      else{
        callback(new Error('Not Allowed Origin!'));
      }
    }
  }
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  class ExpressServer {
    init(APP_PORT, isDebug, ROOT_PATH) {
      return new Promise((resolve, reject) => {
        try {
          this.isDebug = isDebug;
          (0, _findFreePort.default)(APP_PORT).then(([freep]) => {
            this.port = freep;
            let app = (0, _express.default)();
            // app.use(_express.default.static('dist'));
            app.use(_express.default.static(path.join(ROOT_PATH, '/dist/')));
            // app.use(cors(corsOptions));
            app.get('/', (req, res) => {
              // res.sendFile(__dirname + '/dist/index.html');
              res.sendFile(path.join(ROOT_PATH , '/dist/index.html'));
            });
            this.listener = app.listen(this.port, () => {
              isDebug ? console.log('Example app listening on port', this.port) : isDebug;
              resolve();
            });
            this.app = app;
          }).catch(err => {
            isDebug ? console.error(err) : isDebug;
          });
        } catch (ex) {
          reject(new Error(ex));
        }
      });
    }
  
    getPort() {
      return this.listener.address().port;
    }
  
    close() {
      this.listener.close();
      this.isDebug ? console.log('express server was closed.') : this.isDebug;
    }
  
  }
  
  exports.ExpressServer = ExpressServer;