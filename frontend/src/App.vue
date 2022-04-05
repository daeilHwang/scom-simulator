<template>
  <div id='app_scomsimulator'>
    <div id='app_header'>
      <button @click="tempConfigBtn">configure</button>
    </div>
    <div id='app_body'>
      <div id='xml_editor'>
        <XmlEditor v-on:selectnode='selectnode'
          v-bind:xmldata='XMLData'/>
      </div>
      <div id='side_bar'>
        <SideBar 
          v-bind:propsdata='nowSelectItem'
          v-bind:trafficlight='trafficlight'
          v-bind:configdata='configdata'
          v-on:init='sidebarInit'
          v-on:startup='startup'
          v-on:stop='stop'
          v-on:sendMessage='sendMessage'/>
      </div>
    </div>
    <div id='app_logmanager'>
      a
    </div>
    <div id='app_footer'>
      <p>ScomSimulator - AIM Systems, Inc.</p>
    </div>

    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h2>Configure ScomSimulator</h2>
      </template>
      <template #body>
        <ConfigureSimulator 
          v-bind:propsdata='configdata'
          v-on:closeConfigModal='tempConfigBtn'
          v-on:saveConfig='saveConfig'
          v-on:getConfig='getConfig'/>
      </template>
      <template #footer><div></div></template>
    </modal>
  </div>
</template>

<script>
import XmlEditor from './components/XmlEditor.vue'
import SideBar from './components/SideBar.vue'
import Modal from './components/common/Modal.vue'
import ConfigureSimulator from './components/ConfigureSimulator.vue'
import {ConnectAndSetup} from './store/CommunicationManager.js'


let _this;

export default {
  name: 'App',
  components: {
    XmlEditor,
    SideBar,
    Modal,
    ConfigureSimulator
  },
  data: function(){
    return {
      nowSelectItem: {
        'Stream' : '',
        'Function' : '',
        'MessageName' : '',
        'Wait': false,
        'AutoReply': false,
        'NoLogging': false,
        'Description': '',
        'Direction':'',
      },
      showModal: false,
      ws: undefined,
      configdata: {
        SEComID: '',
        SEComIDs: undefined,
        EQPorHOST: 'EQP',
        DeviceID: '0',
        ProtocolType: 'HSMS',
        T1TimeOut: '0.5',
        T2TimeOut: '10',
        T3TimeOut: '45',
        T4TimeOut: '45',
        T5TimeOut: '10',
        T6TimeOut: '5',
        T7TimeOut: '10',
        T8TimeOut: '10',
        ConnectMode: 'Active',
        RemoteIP: '127.0.0.1',
        RemotePort: '9000',
        LocalPort: '9000',
        LinkTestTime: '60',
        SerialPort: 'COM1',
        BaudRate: 'Auto',
        RetryCount: '3',
        Master: true,
        Interleave: false,
        SEComLogFolder: '',
        SEComLogMode: 'Day',
        SECS1LogMode: 'Day',
        SEComLogLevel: 'Level 3',
        SECS2LogMode: 'Day',
        LogBackup: '3 Days',
        SMDPath: '',
        SMDFile: '',
      },
      XMLData: '',
      trafficlight: 'trafficlight_red',
    }
  },
  methods: {
    selectnode: function(secsmessage){
      this.nowSelectItem = {
        'Stream' : secsmessage.Stream !== undefined ? secsmessage.Stream : '',
        'Function' : secsmessage.Function !== undefined ? secsmessage.Function : '',
        'MessageName' : secsmessage.MessageName !== undefined ? secsmessage.MessageName : '',
        'Wait': secsmessage.Wait.toLowerCase() === 'true' ? secsmessage.Wait : 'false',
        'AutoReply': secsmessage.AutoReply.toLowerCase() === 'true' ? secsmessage.AutoReply : 'false',
        'NoLogging': secsmessage.NoLogging.toLowerCase() === 'true' ? secsmessage.NoLogging : 'false',
        'Description': secsmessage.Description !== undefined ? secsmessage.Description : '',
        'Direction': secsmessage.Direction !== undefined ? secsmessage.Direction : '',
      }
    },
    // 이 함수 수정할거면 위에서 사용중인 줄도 같이 수정하자.
    tempConfigBtn: function(){
      this.showModal = !this.showModal;
      if(this.showModal) this.getConfigAll();
    },
    saveConfig: function(){
      let msg = {
        'action': 'set_config',
        'data': this.configdata,
      }
      this.ws.send(JSON.stringify(msg));
    },
    getConfig: function(id){
      let msg = {
        'action' : 'get_config',
        'data' : {
          'target': id
        }
      }
      this.ws.send(JSON.stringify(msg));
    },
    getConfigAll: function(){
      let msg = {
          'action': 'get_config',
          'data': {
            'target': 'all'
          }
        }
      this.ws.send(JSON.stringify(msg));      
    },
    setTrafficLight(color){
      switch(color){
        case 'red':
          this.trafficlight = 'trafficlight_red'
          break;
        case 'yellow':
          this.trafficlight = 'trafficlight_yellow'
          break;
        case 'green':
          this.trafficlight = 'trafficlight_green'
          break;
      }
    },
    sidebarInit(){
      this.nowSelectItem = {
        'Stream' : '',
        'Function' : '',
        'MessageName' : '',
        'Wait': false,
        'AutoReply': false,
        'NoLogging': false,
        'Description': '',
        'Direction':'',
      };
    },
    startup(){
      let msg = {
          'action': 'scom_start',
          'data': {
            'target': this.configdata.SEComID
          }
        }
      this.ws.send(JSON.stringify(msg));
    },
    stop(){
      let msg = {
          'action': 'scom_stop',
          'data': {
            'target': this.configdata.SEComID
          }
        }
      this.ws.send(JSON.stringify(msg));
    },
    sendMessage(){
      let msg = {
        'action':'send_scom_msg',
        'data':{
          'stream':this.nowSelectItem.Stream,
          'function':this.nowSelectItem.Function,
          'messagename':this.nowSelectItem.MessageName
        }
      }
      this.ws.send(JSON.stringify(msg));
    }
  },
  async created() {
    /**
     * vue component가 create되면 서버에 접속을 시도해본다.
     */
    _this = this;
    this.ws = await ConnectAndSetup(_this);
  },
}
</script>

<style>

html{
  width: 100%;
  height: 100%;
  background: #011625;
}
body{
  width: 100%;
  height: 100%;
  margin: 0px; padding: 0px;
  font-size: 11px;
}

#app_scomsimulator{
  width:100%;
  height:100%;
  /* min-width: 50em; */
  min-height:20em;
  background: #011625;
  display:flex;
  flex-direction: column;
}

#app_body{
  width: 100%;
  height:100%;
  flex: 1;
  text-align: left;
  font-size: 11px;
  display: flex;
  flex-direction: row;
  /* flex-wrap: wrap; */
  flex-wrap: nowrap;
  overflow: hidden;
}

#xml_editor{
  /* width: 34em; */
  flex-grow: 1;
  flex-basis: 220px;
  flex-shrink: 0;
  font-family: 'Open Sans', sans-serif;
  /* background: #011625; */
  /* background: #d0e6ef; */
  color: #666;
  margin: 0px; padding: 0px;
  display: inline-block;
  border: 2px solid lightgrey;
  overflow: hidden;
  min-width: 23em;
}

#side_bar{
  width:32em;
  min-height:30em;
  height:auto;
  display: inline-block;
  /* font-size: 10px; */
  margin: 0px; padding: 0px;
  border: 2px solid lightgrey;
  /* background: blue; */
}

#app_logmanager {
  min-height: 14em;
  /* background: red; */
  /* display:inline-block; */
  display:none;
  border: 2px solid lightgrey;
  margin: 0px; padding: 0px;
  /* display: none; */
}

#app_footer{
  height:1.5em;
  display: inline-block;
  -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;
  color: white;
  border: 2px solid lightgrey;
}
#app_footer > p {
  font-size: 0.7em;
  color: white;
  width: 100%;
  min-height: 1em;
  margin: 0px; padding: 0px;
  display: inline-block;
}

body.swal2-height-auto {
  height: 100% !important
}

</style>
