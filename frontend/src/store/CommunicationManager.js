import { xmlParser } from './XmlHelper.js';
import Swal from 'sweetalert2';

export async function ConnectAndSetup(_this){
    return new Promise((resolve, reject)=>{
        let ws = undefined;
        // Electron으로 빌드할때
        fetch('http://localhost:' + window.location.port + '/wsport').then(res => {
        // test.js로 테스트 실행할 때
        // fetch('http://localhost:8000/wsport').then(res => {
            if(res.ok){
                return res.json();
            }
            reject(new Error("Server Connecting is Failed."));
        }).then((json) => {
            let port = json.port;
            ws = new WebSocket('ws://localhost:' + port);
            ws.onopen = function(){
                _this.getConfigAll()
            }
            ws.onmessage = function(msg){
                let json = JSON.parse(msg.data);
                switch(json.action){
                    case 'get_config_all': {
                        if(json.data.length >= 1){
                            json.data.forEach(function(item, i){
                            json.data[i] = item.replace('.conf','');
                        })
        
                        if(json.data.length != 0)
                            _this.getConfig(json.data[0]);
                        }
                        _this.configdata.SEComIDs = json.data;
                        break;
                    }
                    case 'get_config':{
                        let config = JSON.parse(json.data);
                                for(let key in config){
                            if(key === 'SEComIDs') continue;
                            Object.prototype.hasOwnProperty.call(_this.configdata, key) 
                                ? _this.configdata[key] = config[key] : key;
                        }
                        _this.XMLData = xmlParser(config.SMDFile);
                        _this.setTrafficLight('yellow');
                                let isConnecting = json.isConnecting;
                        if(isConnecting) _this.setTrafficLight('green');
                            break;
                    }
                    case 'set_config_reply':{
                        if(json.data.result !== 'success'){
                            alert(json.data);
                            return;
                        }
                        if(json.data.target)
                            _this.getConfig(json.data.target);
                        alert('config save is success!');
                        _this.tempConfigBtn();
                        break;
                    }
                    case 'scom_start_reply':{
                        _this.setTrafficLight("green");
                        break;
                    }
                    case 'scom_stop_reply':{
                        _this.setTrafficLight("yellow");
                        break;
                    }
                }
            }
            resolve(ws);
        })
        .catch(()=>{
            Swal.fire({
                title: 'Error!', html: 'Connect To Server is Failed,\nPlease, Check a Server.', icon: 'error', confirmButtonText: 'OK'
            });
            reject("Server Connect is Failed.");
        })
    });
}