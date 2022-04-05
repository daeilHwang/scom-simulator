<template>
  <div id='sidebar'>
      <div id='sidebar_headder'>
          <div id='sidebar_header_left'>
            <label style="font-weight:bold; color:#FEF2EF; font-size:1.5em; padding-left:0.5em; ">
                Communication Manager
            </label>
          </div>
          <div id='sidebar_header_right' @click="onTrafficlightClicked">
              <i class="fa-solid fa-traffic-light" v-bind:class='trafficlight' id='trafficlight'></i>
          </div>
          
      </div>
      <div id='sidebar_body' style='display:hidden;'>
          <div id='sidebar_body_sf'>
                <span style='width:75%'>
                    <i class="fa-solid fa-s"></i>tream
                    <input class='sidebar_editext streamfunc' type='text' v-bind:value='propsdata.Stream' readonly/>
                    <div class='void3em'></div>
                    <i class="fa-solid fa-f"></i>unction
                    <input class='sidebar_editext streamfunc' type='text' v-bind:value='propsdata.Function' readonly/>
                </span>
                <span style='width:25%'>
                    <i class="fa-solid fa-desktop" id='icon_desktop'></i><div class='void1em'></div>
                    <i class="fa-solid fa-circle-question" id='direction'></i><div class='void1em'></div>
                    <!-- fa-arrows-left-right  fa-circle-question fa-arrow-left fa-arrow-right-->
                    <i class="fa-solid fa-cash-register" id='icon_eqp'></i>
                </span>  
          </div>
          <div id='sidebar_body_msgname'>
              Message Name: <input class='sidebar_editext msgname' type='text' v-bind:value='propsdata.MessageName' readonly/>
          </div>
          <div id='sidebar_body_checkboxs'>
              <!-- <input type='checkbox' v-bind:value='propsdata.Wait'/>Wait -->
              <input type='checkbox' v-model='isWait'/>Wait
              <input type='checkbox' v-model='isAutoReply'/>Auto Reply
              <input type='checkbox' v-model="isNoLogging"/>No Logging
          </div>
          <div id='sidebar_body_description'>
              <div>Description</div>
              <textarea class='sidebar_editext' v-bind:value='propsdata.Description' readonly></textarea>
          </div>
          <div id='sidebar_body_send'>
              <button id='sendmsgbtn' disabled='true' @click="sendMessage">
                <i class="fa-solid fa-paper-plane"></i> Send Message</button>
          </div>
      </div>
      <div id='sidebar_bot'>
          <table id='sidebar_bot_head'>
              <tr>
                  <th>Name</th>
                  <th>SxFx</th>
                  <th>Description</th>
              </tr>
              <tr class='sidebar_bot_body'>
                  <td>AreYouThere</td>
                  <td>S1F1</td>
                  <td>Are You There Request</td>
              </tr>
              <tr class='sidebar_bot_body'>
                  <td>OnLineData</td>
                  <td>S1F2</td>
                  <td>Are You There Request</td>
              </tr>
          </table>
      </div>
  </div>
</template>

<script>
export default {
    props: ['propsdata', 'trafficlight', 'configdata'],
    watch:{
      trafficlight(newval){
        let tl = document.getElementById('trafficlight');
        tl.classList.remove('trafficlight_red', 'trafficlight_yellow', 'trafficlight_green')
        switch(newval){
            case 'trafficlight_red':
                tl.classList.add('trafficlight_red');
                break;
            case 'trafficlight_yellow':
                tl.classList.add('trafficlight_yellow');
                break;
            case 'trafficlight_green':
                tl.classList.add('trafficlight_green');
                break;
        }
      },
      propsdata(newval){
          let arrow = document.getElementById('direction');
          arrow.classList.remove('fa-circle-question', 'fa-arrow-right-arrow-left', 'fa-arrow-left', 'fa-arrow-right');
          
          if(newval.Direction.indexOf('<') !== -1){
              if(newval.Direction.indexOf('>') !== -1){
                  arrow.classList.add('fa-arrow-right-arrow-left', 'bidir');
              }
              else{
                  arrow.classList.add('fa-arrow-left', 'tohost');
              }
          }
          else{
              arrow.classList.add('fa-arrow-right', 'toeqp');
          }

          let isEQP;
          this.configdata.EQPorHOST === 'EQP' ? isEQP = true : isEQP = false;

          if(isEQP){
              if(newval.Direction.indexOf('<') !== -1){
                  this.enableIcons();
              }
              else{
                  this.disableIcons();
              }
          }
          else{
              if(newval.Direction.indexOf('>') !== -1){
                  this.enableIcons();
              }
              else{
                  this.disableIcons();
              }
          }
      }
    },
    computed: {
        isWait: {
            get: function(){
                try{
                    return this.propsdata.Wait.toLowerCase() === 'true' ? true : false;
                }
                catch(err){
                    return false;
                }
            },
            set: function(newval){
                this.propsdata.Wait = newval;
            }
        },
        isAutoReply: {
            get: function(){
                try{
                    return this.propsdata.isAutoReply.toLowerCase() === 'true' ? true : false;
                }
                catch(err){
                    return false;
                }
            },
            set: function(newval){
                this.propsdata.isAutoReply = newval;
            }
        },
        isNoLogging: {
            get: function(){
                try{
                    return this.propsdata.NoLogging.toLowerCase() === 'true' ? true : false;
                }
                catch(err){
                    return false;
                }
            },
            set: function(newval){
                this.propsdata.NoLogging = newval;
            }
        }
    },
    methods: {
        onTrafficlightClicked: function(){
            let trafficlightcolor = this.trafficlight;
            switch(trafficlightcolor){
                case 'trafficlight_yellow':
                    this.$emit('startup');
                    break;
                case 'trafficlight_green':
                    this.initializeCommunicationManager();
                    this.$emit('stop');
                    break;
                default:
                    break;
            }
        },
        disableIcons: function(){
            document.getElementById('icon_desktop').classList.remove('icon_able');
            document.getElementById('icon_eqp').classList.remove('icon_able');
            document.getElementById('direction').classList.remove('icon_able');
            document.getElementById('icon_desktop').classList.add('icon_disable');
            document.getElementById('icon_eqp').classList.add('icon_disable');
            document.getElementById('direction').classList.add('icon_disable');
            document.getElementById('sendmsgbtn').disabled = true;
        },
        enableIcons: function(){
            document.getElementById('icon_desktop').classList.remove('icon_disable');
            document.getElementById('icon_eqp').classList.remove('icon_disable');
            document.getElementById('direction').classList.remove('icon_disable');
            document.getElementById('icon_desktop').classList.add('icon_able');
            document.getElementById('icon_eqp').classList.add('icon_able');
            document.getElementById('direction').classList.add('icon_able');
            document.getElementById('sendmsgbtn').disabled = false;
        },
        initializeCommunicationManager: function(){
            this.$emit('init');
        },
        sendMessage: function(){
            this.$emit('sendMessage')
        }
    }
}
</script>

<style>

#sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;
}

#sidebar_headder{
    width: 32em;
    height: 2em;
    text-align: left;
    margin: 0px; padding: 0px;
    
}
#sidebar_header_left{
    text-align: left;
    display: inline-block;
    width:80%;
}
#sidebar_header_right {
    text-align: right;
    display: inline-block;
    width:20%;
    text-align: right;
}

#sidebar_body {
    width:100%;
    height: 16em;
    display: block;
    border: 2px solid lightgrey;
    border-left-style: none;
    border-right-style: none;
}

#sidebar_body_sf {
    font-size: 1.25em;
    font-weight: bold;
    padding: 0.4em 0em 0.1em 0.5em;
    color:#FAFAFA;
}
#sidebar_body_sf > span {
    display: inline-block;
}
/* #sidebar_body_sf > span > i{
    color:#D8D8D8;
} */

.sidebar_editext{
    font-size: 1em;
    background-color:#FFE19A;
    border: none;
}
.streamfunc {
    width:2em;
}
.msgname{
    width:64%;
}

.void3em {
    width:3em;
    display: inline-block;
}

.void1em {
    width:1em;
    display: inline-block;
}

.fa-circle-arrow-left{
    color: #FFBB15;
}
.fa-circle-arrow-right{
    color: #1263CE;
}

#xmlEditorHeader{
  width: 100%;
  height: 2em;
  text-align: left;
  margin: 0px; padding: 0px;
}

#sidebar_body_msgname{
    font-size: 1.25em;
    font-weight: bold;
    padding: 0.1em 0em 0.1em 0.5em;
    color:#FAFAFA;
}

#sidebar_body_checkboxs {
    font-size: 1.25em;
    font-weight: bold;
    padding: 0.1em 0em 0.1em 0.5em;
    color:#FAFAFA;
}

#sidebar_body_description{
    font-size: 1.25em;
    font-weight: bold;
    padding: 0.1em 0em 0.1em 0.5em;
    color:#FAFAFA;
}
#sidebar_body_description > textarea {
    resize:none; width:96%;
}

#sidebar_body_send{
    font-size: 1.25em;
    font-weight: bold;
    padding: 0.1em 0em 0.1em 0.5em;
    color:#FAFAFA;
}
#sidebar_body_send > button {
    width:97%;
    height:2em;
    background-color:#ECECF0;
    border: none;
}
#sidebar_body_send > button:hover:enabled {
    width:97%;
    height:2em;
    background-color:#ECECF0;
    color:blue;
    border: none;
}
#sidebar_body_send > button:active:enabled {
    width:97%;
    height:2em;
    background-color:#ECECF0;
    color:red;
    border: none;
}

#sidebar_bot{
    width:100%;
    display: block;
    flex: 1;
    overflow: auto;
    overflow-x: hidden
}

#sidebar_bot_head {
    width: 100%;
    height: 2em;
    font-size: 1.25em;
    font-weight: bold;
    padding: 0.1em 0em 0.1em 0.5em;
    color:#FAFAFA;
}
.sidebar_bot_body {
    width: 100%;
    height: auto;
    min-height: 16em;
    font-size: 0.9em;
    font-weight: bold;
    padding: 0.1em 0em 0.1em 0.5em;
    color:#FAFAFA;
    border: white;
}
.sidebar_bot_body:hover{
    background-color: #1263CE;
    color:#FFBB15;
}

.trafficlight_red {
    color:red; padding-right:0.5em;
}
.trafficlight_yellow {
    color:yellow; padding-right:0.5em;
}
.trafficlight_green {
    color:green; padding-right:0.5em;
}
#trafficlight{
    margin:0;
    position: relative;
    top:50%;
    font-size: 1.5em;
}

.icon_able{
    color: #2196f3;
}
.icon_disable{
    color:#bdbdbd;
}

</style>