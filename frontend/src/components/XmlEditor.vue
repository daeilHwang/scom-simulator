<template>
    <div id='xmlEditorWrapper'>
        <div id="xmlEditorHeader">
          <span id="xmlEditorHeader_left">
            <label style="font-weight:bold; color:#FEF2EF; font-size:1.5em; padding-left:0.5em;">
              SECS Transaction Messages
            </label>
          </span>
          <!-- <span id="xmlEditorHeader_right" class="image-upload">
            <label for="file-input" style='padding-right:0.5em;'>
              <i class="fa-solid fa-folder-open" id='file-input-button'></i>
            </label>
            <input id="file-input" type="file" @change="fileupload" accept=".xml, .smd"/>
          </span> -->
        </div>
        <div id='xmlEditorBody'>
          <TreeVue v-on:event-save='saveXml'
            v-on:event-okconfirm='okConfirm'
            v-on:event-selectnode='selectnode'/>
        </div>
        <!-- <input id='inputfile' type='file' @change="fileupload" accept=".xml, .smd"/> -->
        <!-- <input id='inputfile' type='file' @change="fileupload" accept=".xml"/> -->
        <!-- <button v-on:click='resetEditor'>reset</button> -->
    </div>

</template>

<script>
// import XMLFileReader from '../store/XmlFileReader.js'
// import xmlPretty from '../store/XmlPretty.js'
// import xmlParser from '../store/XmlParser.js'
import { xmlValidate, xmlBuild } from '../store/XmlHelper';
import TreeVue from './TreeVue.vue';
import Swal from 'sweetalert2';
let tree;

export default {
    name: 'xmlEditor',
    props:[ 'xmldata' ],
    mounted() {
      tree = document.getElementById('tree')
      document.body.addEventListener('contextmenu', e => {
        e.preventDefault();
      });
    },
    components: {
      //ContextMenu,
      TreeVue
    },
    watch:{
      xmldata(newxml){
        this.makeTree(newxml);
      }
    },
    methods: {
        'makeTree': function(xml){
          tree.innerHTML = '';
          TreeVue.methods.initTree(xml);
        },
        'xmlError': function(validate){
          let errmsg = '<div style="text-align:left">code: ' + validate.err.code + '<br/>col: ' + validate.err.col + '<br/>line: ' + validate.err.line + '<br/>msg: ' + validate.err.msg + "</div>";
          Swal.fire({
            title: 'Error!', html: errmsg, icon: 'error', confirmButtonText: 'OK'
          });
        },
        'saveXml': function(xmldata){
          if(xmldata === undefined) return;

          let strxml = xmlBuild(xmldata);
          console.log(strxml);
          let validate = xmlValidate(strxml);

          if(validate !== true){
            this.xmlError(validate);
            return;
          }
        },
        'resetEditor':function(){
          document.getElementById('inputfile').value = null;
          tree.innerHTML = '';
        },
        'okConfirm':function(_title, msg, level){
          Swal.fire({
            title: _title + '!', 
            text: msg, 
            icon: level, 
            confirmButtonText: 'OK'
          });
        },
        'selectnode': function(secsmessage){
          this.$emit('selectnode', secsmessage);
        }
    },
}
</script>

<style>
/* @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,700,300italic);
*, *:before, *:after {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
} */

#xmlEditorWrapper{
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction: column;
  text-align: left;
  margin: 0px; padding: 0px;
  -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;
}

.image-upload>input {
  display: none;
}

#xmlEditorHeader{
  width: 100%;
  height: 2em;
  text-align: left;
  margin: 0px; padding: 0px;
}

#xmlEditorHeader_left{
  text-align: left;
  display: inline-block;
  width:90%;
}
#xmlEditorHeader_right{
  text-align: right;
  display: inline-block;
  width:10%;
  text-align: right;
}

#file-input-button{
    color: #FFD16B;
    text-shadow: 1px 1px 1px #ccc;
    font-size: 1.5em;
}

#xmlEditorBody {
  width: 100%;
  height:100%;
  flex:1;
  overflow: auto;
}

</style>