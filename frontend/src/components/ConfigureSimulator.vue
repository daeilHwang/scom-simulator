<template>
  <div id='ConfigureSimulator'>
      <div class="tab">
        <!-- <button class="tablinks" onclick="openCity(event, 'London')">London</button>
        <button class="tablinks" onclick="openCity(event, 'Paris')">Paris</button>
        <button class="tablinks" onclick="openCity(event, 'Tokyo')">Tokyo</button> -->
        <button class="tablinks active" @click="openCity('General', $event)">General</button>
        <button class="tablinks" @click="openCity('HSMS', $event)">HSMS</button>
        <button class="tablinks" @click="openCity('SECS1', $event)">SECS I</button>
        <button class="tablinks" @click="openCity('Log', $event)">Log</button>
      </div>

      <div id="General" class="tabcontent" style='display:block'>
        <General v-bind:propsdata='propsdata'
          v-on:closeConfig='closeModal'
          v-on:getConfig='getConfig'/>
      </div>
      <div id="HSMS" class="tabcontent" style='display:none'>
        <HSMS v-bind:propsdata='propsdata'/>
      </div>
      <div id='SECS1' class='tabcontent' style='display:none'>
        <SECS1 v-bind:propsdata='propsdata'/>
      </div>

      <div id="Log" class="tabcontent" style='display:none'>
        <LogVue v-bind:propsdata='propsdata'/>
      </div>

      <div id='bottom_buttons'>
        <button @click="saveButton">
          <i class="fa-solid fa-floppy-disk" style='margin-right:0.2em;'></i>Save
        </button>
        <button @click="closeModal">
          <i class="fa-solid fa-circle-xmark" style='margin-right:0.2em;'></i>Close
        </button>
      </div>
  </div>
</template>

<script>
import General from './ConfigureComponents/General.vue'
import HSMS from './ConfigureComponents/HSMS.vue'
import SECS1 from './ConfigureComponents/SECS1.vue'
import LogVue from './ConfigureComponents/LogVue.vue'

export default {
  components: {
    General,
    HSMS,
    SECS1,
    LogVue
  },
  props:[ 'propsdata' ],
  methods:{
    openCity: function(tabName, evt) {
      // Declare all variables
      var i, tabcontent, tablinks;

      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }

      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.className += " active";
    },
    closeModal: function(){
      this.$emit('closeConfigModal');
    },
    saveButton: function(){
      try{
        if(!this.checkValidateValue(document.getElementById('SEComID'))) return;
        if(!this.checkValidateValue(document.getElementById('DeviceID'))) return;
        if(!this.checkValidateValue(document.getElementById('SMDPath'))) return;
        if(!this.checkValidateValue(document.getElementById('T1TimeOut'))) return;
        if(!this.checkValidateValue(document.getElementById('T2TimeOut'))) return;
        if(!this.checkValidateValue(document.getElementById('T3TimeOut'))) return;
        if(!this.checkValidateValue(document.getElementById('T4TimeOut'))) return;
        if(!this.checkValidateValue(document.getElementById('T5TimeOut'))) return;
        if(!this.checkValidateValue(document.getElementById('T6TimeOut'))) return;
        if(!this.checkValidateValue(document.getElementById('T7TimeOut'))) return;
        if(!this.checkValidateValue(document.getElementById('T8TimeOut'))) return;
        if(!this.checkValidateValue(document.getElementById('RemoteIP1'))) return;
        if(!this.checkValidateValue(document.getElementById('RemoteIP2'))) return;
        if(!this.checkValidateValue(document.getElementById('RemoteIP3'))) return;
        if(!this.checkValidateValue(document.getElementById('RemoteIP4'))) return;
        if(!this.checkValidateValue(document.getElementById('RemotePort'))) return;
        if(!this.checkValidateValue(document.getElementById('LocalPort'))) return;
        if(!this.checkValidateValue(document.getElementById('LinkTestTime'))) return;
        if(!this.checkValidateValue(document.getElementById('RetryCount'))) return;

        this.$emit('saveConfig');
      }
      catch(ex){
          return false;
      }
    },
    checkValidateValue: function(tag){
      try{
        if(!tag.value.trim()){
          alert('Please Insert ' + tag.id);
          return false;
        }
        return true;
      }catch(ex){
        alert('cannot find a tag');
      }
      return false;
    },
    getConfig: function(id){
      this.$emit('getConfig', id);
    }
  }
}
</script>

<style>
#ConfigureSimulator {
  border: 1px solid #ccc;
}

Label {
  font-size: 0.8em;
  margin-right: 0.5em;
}

.tab {
  min-width: 20em;
  overflow: hidden;
  border-bottom: 1px solid #ccc;
  background-color: #f1f1f1;
}

/* Style the buttons that are used to open the tab content */
.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
  /* min-width: 20em;
  min-height: 12em; */
  width:100%;
  height:100%;
  padding: 6px 12px;
  animation: fadeEffect 0.33s; /* Fading effect takes 1 second */
  display: block;
  margin:0; padding:0;
}

.tabcontentbody{
    min-width: 20em;
    min-height: 12em;
    padding: 6px 12px;
    animation: fadeEffect 0.33s; /* Fading effect takes 1 second */
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
.tabcontentbody div {
    display:flex;
    flex-direction: row;
    justify-content: left;
    flex-basis: 100%;
    flex-wrap: nowrap;
}
.tabcontentbody div div {
    flex-basis: 50%;
}

@keyframes fadeEffect {
  from {opacity: 0;}
  to {opacity: 1;}
}

#bottom_buttons {
  display:flex;
  width:100%;
  justify-content: center;
  border-top: 1px solid #ccc;
}
#bottom_buttons button{
  width:6em;
  height:3em;
  margin: 1em;
}
.image-upload>input {
  display: none;
}
</style>