<template>
  <div class='tabcontentbody'>
      <div>
        <div style='flex-basis:30%;'>
          <Label>SECom Log Folder</Label>
        </div>
        <div style='flex-basis:50%;'>
          <input type='text' v-model="SEComLogFolder"
            style='width:12em; margin-right:0.3em; overflow:hidden;' readonly/>
        </div>
        <div style='flex-basis:10%;'>
          <i class="fa-solid fa-folder-open fa-2x"></i>
        </div>
      </div>
      <div>
        <div>
          <Label>SECom Log Mode</Label>
          <select v-model="SEComLogMode">
            <option>None</option>
            <option>Hour</option>
            <option>Day</option>
          </select>
        </div>
        <div>
          <Label>SECS-I Log Mode</Label>
          <select v-model="SECS1LogMode">
            <option>None</option>
            <option>Hour</option>
            <option>Day</option>
          </select>
        </div>
      </div>
      <div>
        <div>
          <Label>SECom Log level</Label>
          <select v-model="SEComLogLevel">
            <option>Level 1</option>
            <option>Level 2</option>
            <option>Level 3</option>
            <option>Level 4</option>
            <option>Level 5</option>
          </select>
        </div>
        <div>
          <Label>SECS-II Log Mode</Label>
          <select v-model="SECS2LogMode">
            <option selected>None</option>
            <option>Hour</option>
            <option>Day</option>
          </select>
        </div>
      </div>
      <div>
        <div>
          <Label>Log Backup</Label>
          <select v-model="LogBackup">
            <option>1 Day</option>
            <option>2 Days</option>
            <option>3 Days</option>
            <option>4 Days</option>
            <option>5 Days</option>
            <option>6 Days</option>
            <option>1 Week</option>
            <option>2 Weeks</option>
            <option>3 Weeks</option>
            <option>4 Weeks</option>
          </select>
        </div>
        <div></div>
      </div>
  </div>
</template>

<script>
export default {
  props:[ 'propsdata' ],
    computed:{
        SEComLogFolder: function(){
            return this.propsdata.SEComLogFolder;
        },
        SEComLogMode:{
            get:function(){
                return this.propsdata.SEComLogMode;
            },
            set:function(newval){
                this.propsdata.SEComLogMode = newval;
            }
        },
        SECS1LogMode:{
            get:function(){
                return this.propsdata.SECS1LogMode;
            },
            set:function(newval){
                this.propsdata.SECS1LogMode = newval;
            }
        },
        SEComLogLevel:{
            get:function(){
                return this.propsdata.SEComLogLevel;
            },
            set:function(newval){
                this.propsdata.SEComLogLevel = newval;
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
        SECS2LogMode:{
            get:function(){
                return this.propsdata.SECS2LogMode;
            },
            set:function(newval){
                this.propsdata.SECS2LogMode = newval;
            }
        },
        LogBackup:{
            get:function(){
                return this.propsdata.LogBackup;
            },
            set:function(newval){
                this.propsdata.LogBackup = newval;
            }
        },
    }
}
</script>

<style>

</style>