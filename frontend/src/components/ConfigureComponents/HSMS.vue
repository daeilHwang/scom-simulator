<template>
  <div class='tabcontentbody'>
      <div>
          <div>
              <Label>T3 Time Out</Label>
              <input type='text' v-model="T3TimeOut" id='T3TimeOut'
                style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
              <Label>(sec)</Label>
          </div>
          <div>
              <Label>Connect Mode</Label>
              <select v-model="ConnectMode" @change='ConnectModeChange($event)'>
                <option>Active</option>
                <option>Passive</option>
              </select>
          </div>
      </div>
      <div>
          <div>
                <Label>T5 Time Out</Label>
                <input type='text' v-model="T5TimeOut" id='T5TimeOut'
                    style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
                <Label>(sec)</Label>
          </div>
          <div>
                <Label>Remote IP</Label>
                <input type='text' v-model="RemoteIP1" class='ipinput' style='margin-left:0.5em' id='RemoteIP1'>
                <input type='text' v-model="RemoteIP2" class='ipinput' id='RemoteIP2'>
                <input type='text' v-model="RemoteIP3" class='ipinput' id='RemoteIP3'>
                <input type='text' v-model="RemoteIP4" class='ipinput' id='RemoteIP4'>
          </div>
      </div>
      <div>
          <div>
                <Label>T6 Time Out</Label>
                <input type='text' v-model="T6TimeOut" id='T6TimeOut'
                    style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
                <Label>(sec)</Label>
          </div>
          <div>
                <Label>Remote Port</Label>
                <input type='text' v-model="RemotePort" id='RemotePort'
                    style='width:3em;'/>
          </div>
      </div>
      <div>
          <div>
                <Label>T7 Time Out</Label>
                <input type='text' v-model="T7TimeOut" id='T7TimeOut'
                    style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
                <Label>(sec)</Label>
          </div>
          <div>
                <Label>Local Port</Label>
                <input type='text' v-model="LocalPort" id='LocalPort' disabled
                    style='width:3em;'/>
          </div>
      </div>
      <div>
          <div>
                <Label>T8 Time Out</Label>
                <input type='text' v-model="T8TimeOut" id='T8TimeOut'
                    style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
                <Label>(sec)</Label>
          </div>
          <div>
                <Label>LinkTest Time</Label>
                <input type='text' v-model="LinkTestTime" id='LinkTestTime'
                    style='width:3em; margin-right:0.2em;'/>
                <Label>(m.sec)</Label>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    props:[ 'propsdata' ],
    computed:{
        T3TimeOut:{
            get:function(){
                return this.propsdata.T3TimeOut;
            },
            set:function(newval){
                this.propsdata.T3TimeOut = newval;
            }
        },
        T5TimeOut: {
            get:function(){
                return this.propsdata.T5TimeOut;
            },
            set:function(newval){
                this.propsdata.T5TimeOut = newval;
            }
        },
        T6TimeOut: {
            get:function(){
                return this.propsdata.T6TimeOut;
            },
            set:function(newval){
                this.propsdata.T6TimeOut = newval;
            }
        },
        T7TimeOut: {
            get:function(){
                return this.propsdata.T7TimeOut;
            },
            set:function(newval){
                this.propsdata.T7TimeOut = newval;
            }
        },
        T8TimeOut: {
            get:function(){
                return this.propsdata.T8TimeOut;
            },
            set:function(newval){
                this.propsdata.T8TimeOut = newval;
            }
        },
        ConnectMode: {
            get:function(){
                return this.propsdata.ConnectMode;
            },
            set:function(newval){
                this.propsdata.ConnectMode = newval;
            }
        },
        RemoteIP1: {
            get:function(){
                return this.propsdata.RemoteIP.split('.')[0];
            },
            set:function(newval){
                this.propsdata.RemoteIP = newval + '.' + this.RemoteIP2 + '.' + this.RemoteIP3 + '.' + this.RemoteIP4;
            }
        },
        RemoteIP2: {
            get:function(){
                return this.propsdata.RemoteIP.split('.')[1];
            },
            set:function(newval){
                this.propsdata.RemoteIP = this.RemoteIP1 + '.' + newval + '.' + this.RemoteIP3 + '.' + this.RemoteIP4;
            }
            
        },
        RemoteIP3: {
            get:function(){
                return this.propsdata.RemoteIP.split('.')[2];
            },
            set:function(newval){
                this.propsdata.RemoteIP = this.RemoteIP1 + '.' + this.RemoteIP2 + '.' + newval + '.' + this.RemoteIP4;
            }
            
        },
        RemoteIP4: {
            get:function(){
                return this.propsdata.RemoteIP.split('.')[3];
            },
            set:function(newval){
                this.propsdata.RemoteIP = this.RemoteIP1 + '.' + this.RemoteIP2 + '.' + this.RemoteIP3 + '.' + newval;
            }
        },
        RemotePort: {
            get:function(){
                return this.propsdata.RemotePort;
            },
            set:function(newval){
                this.propsdata.RemotePort = newval;
            }
        },
        LocalPort: {
            get:function(){
                return this.propsdata.LocalPort;
            },
            set:function(newval){
                this.propsdata.LocalPort = newval;
            }
        },
        LinkTestTime: {
            get:function(){
                return this.propsdata.LinkTestTime;
            },
            set:function(newval){
                this.propsdata.LinkTestTime = newval;
            }
        },
    },
    methods: {
        ConnectModeChange: function(event){
            switch(event.target.value){
                case 'Active':
                    document.getElementById('RemoteIP1').disabled = false;
                    document.getElementById('RemoteIP2').disabled = false;
                    document.getElementById('RemoteIP3').disabled = false;
                    document.getElementById('RemoteIP4').disabled = false;
                    document.getElementById('RemotePort').disabled = false;
                    document.getElementById('LocalPort').disabled = true;
                    break;
                case 'Passive':
                    document.getElementById('RemoteIP1').disabled = true;
                    document.getElementById('RemoteIP2').disabled = true;
                    document.getElementById('RemoteIP3').disabled = true;
                    document.getElementById('RemoteIP4').disabled = true;
                    document.getElementById('RemotePort').disabled = true;
                    document.getElementById('LocalPort').disabled = false;
                    break;
            }
        }
    }
}
</script>

<style>
.ipinput{
    font-size: 0.2em;
    width:18px;
}
</style>