<template>
  <div class='tabcontentbody'>
      <div>
          <div>
              <Label>T1 Time Out</Label>
              <input type='text' v-model="T1TimeOut" id='T1TimeOut'
                style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
              <Label>(sec)</Label>
          </div>
          <div>
              <Label>Serial Port</Label>
              <select>
                <option selected>COM1</option>
              </select>
          </div>
      </div>
      <div>
          <div>
                <Label>T2 Time Out</Label>
                <input type='text' v-model="T2TimeOut" id='T2TimeOut'
                    style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
                <Label>(sec)</Label>
          </div>
          <div>
                <Label>Baud Rate</Label>
                <select v-model="BaudRate">
                    <option>Auto</option>
                    <option>1200</option>
                    <option>2400</option>
                    <option>4800</option>
                    <option>9600</option>
                    <option>19200</option>
                </select>
          </div>
      </div>
      <div>
          <div>
                <Label>T3 Time Out</Label>
                <input type='text' v-model="T3TimeOut"
                    style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
                <Label>(sec)</Label>
          </div>
          <div>
                <Label>Retry Count</Label>
                <input type='text' v-model="RetryCount" id='RetryCount'
                    style='width:3em;'/>
          </div>
      </div>
      <div>
          <div>
                <Label>T4 Time Out</Label>
                <input type='text' v-model="T4TimeOut" id='T4TimeOut'
                    style='width:3em; margin-left:0.5em; margin-right:0.2em;'/>
                <Label>(sec)</Label>
          </div>
          <div>
                <div>
                    <input type='checkbox' v-model='Master' id='Master'/> Master
                </div>
                <div>
                    <input type='checkbox' v-model='Interleave' id='interleave'/> Interleave
                </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    props:[ 'propsdata' ],
    computed:{
        T1TimeOut:{
            get:function(){
                return this.propsdata.T1TimeOut;
            },
            set:function(newval){
                this.propsdata.T1TimeOut = newval;
            }
        },
        T2TimeOut:{
            get:function(){
                return this.propsdata.T2TimeOut;
            },
            set:function(newval){
                this.propsdata.T2TimeOut = newval;
            }
        },
        T3TimeOut:{
            get:function(){
                return this.propsdata.T3TimeOut;
            },
            set:function(newval){
                this.propsdata.T3TimeOut = newval;
            }
        },
        T4TimeOut:{
            get:function(){
                return this.propsdata.T4TimeOut;
            },
            set:function(newval){
                this.propsdata.T4TimeOut = newval;
            }
        },
        SerialPort:{
            get:function(){
                return this.propsdata.SerialPort;
            },
            set:function(newval){
                this.propsdata.SerialPort = newval;
            }
        },
        BaudRate:{
            get:function(){
                return this.propsdata.BaudRate;
            },
            set:function(newval){
                this.propsdata.BaudRate = newval;
            }
        },
        RetryCount:{
            get:function(){
                return this.propsdata.RetryCount;
            },
            set:function(newval){
                this.propsdata.RetryCount = newval;
            }
        },
        Master:{
            get:function(){
                return this.propsdata.Master;
            },
            set:function(newval){
                this.propsdata.Master = newval;
            }
        },
        Interleave:{
            get:function(){
                return this.propsdata.Interleave;
            },
            set:function(newval){
                this.propsdata.Interleave = newval;
            }
        },
    }
}
</script>

<style>

</style>