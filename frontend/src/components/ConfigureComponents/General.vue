<template>
    <div class='tabcontentbody'>
        <div>
            <div>
                <Label>SEComID</Label>
                <input type='text' style='width:10em;' v-model="SEComID" id='SEComID' autocomplete="off"/>
                <select @change="selectedSEComID" id='selectSEComID'>
                <option v-for="secom in SEComIDs" v-bind:key="secom">
                    {{ secom }}
                </option>
                </select>
            </div>
            <div>
                <i id='deleteBtn' class="fa-solid fa-trash-can fa-2x" style='margin-left:1em;'></i>
            </div>
        </div>
        <div>
            <div>
                <Label>EQP or HOST</Label>
                <select v-model="EQPorHOST">
                    <option>EQP</option>
                    <option>HOST</option>
                </select>
            </div>
            <div>

            </div>
        </div>
        <div>
            <div>
                <Label>Device ID</Label>
                <input type='text' style='width:1.5em;' v-model="DeviceID" id='DeviceID'>
            </div>
            <div>

            </div>
        </div>
        <div>
            <div>
                <Label>Protocol Type</Label>
                <select v-model="ProtocolType">
                    <option>HSMS</option>
                    <option>SECS</option>
                </select>
            </div>
            <div>

            </div>
        </div>
        <div>
            <div>
                <Label>SMD Path</Label>
                <input type='text' v-model="SMDPath" readonly id='SMDPath'
                    style='margin-right:0.3em;'/>
                <span class="image-upload">
                    <label for="file-input" style='padding-right:0.5em;'>
                        <i class="fa-solid fa-folder-open fa-2x" id='file-input-button'></i>
                    </label>
                    <input id="file-input" type="file" @change="fileupload" accept=".smd"/>
                </span>
            </div>
            <div>

            </div>
        </div>
    </div>
</template>

<script>
import { xmlFilereader, xmlValidate } from '../../store/XmlHelper.js';
// import Swal from 'sweetalert2';

export default {
    props:[ 'propsdata' ],
    computed: {
        SEComID: {
            get:function(){
                return this.propsdata.SEComID;
            },
            set:function(newval){
                this.propsdata.SEComID = newval;
            }
        },
        SEComIDs: {
            get:function(){
                return this.propsdata.SEComIDs;
            },
        },
        EQPorHOST: {
            get:function(){
                return this.propsdata.EQPorHOST;
            },
            set:function(newval){
                this.propsdata.EQPorHOST = newval;
            }
        },
        DeviceID: {
            get:function(){
                return this.propsdata.DeviceID;
            },
            set:function(newval){
                this.propsdata.DeviceID = newval;
            }
        },
        ProtocolType: {
            get:function(){
                return this.propsdata.ProtocolType;
            },
            set:function(newval){
                this.propsdata.ProtocolType = newval;
            }
        },
        SMDPath: {
            get:function(){
                return this.propsdata.SMDPath;
            },
            set:function(newval){
                this.propsdata.SMDPath = newval;
            }
        },
        SMDFile: {
            get:function(){
                return this.propsdata.SMDFile;
            },
            set:function(newval){
                this.propsdata.SMDFile = newval;
            }
        },
    },
    methods:{
        selectedSEComID: function(evt){
            this.propsdata.SEComID = evt.target.value;
        },
        fileupload: async function(event){
            let eventarget = event.target || event.srcElement;
            if (eventarget.value.length <= 0) {
                return;
            }
            let target = (event.target.files)[0];
            let readedfile = await xmlFilereader(target);
            let validate = xmlValidate(readedfile);
            if(validate !== true){
                this.xmlError(validate);
                return;
            }
            this.propsdata.SMDPath = target.name;
            let reg = /[\n\r\t]/g;
            this.propsdata.SMDFile = readedfile.replace(reg, '');
        },
        xmlError: function(validate){
          let errmsg = 'code: ' + validate.err.code + '\ncol: ' + validate.err.col + '\nline: ' + validate.err.line + '\nmsg: ' + validate.err.msg;
          alert(errmsg);
        },
    },
    // mounted() {
    //     this.$emit('getConfig', document.getElementById('selectSEComID').value);
    // }
}
</script>

<style>
#file-input-button{
    color: #FFD16B;
    text-shadow: 1px 1px 1px #ccc;
    font-size: 3em;
}

</style>