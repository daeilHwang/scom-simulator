<template>
  <div style='display:none;'></div>
</template>

<script>
import { createContextmenu } from '../store/contextmenu.js'
let _this;  // save a vue component

export default {
  methods: {
    eventEmit: function(msg){
      _this.$emit(msg);
    },
    'initTreeContextMenu': function(ele){
        createContextmenu(ele, [
        {
            'text': 'Edit',
            'onclick': (e, fnc)=>{
              fnc();
              this.eventEmit('event-edit');
            }
        },
        {
            'text': 'Copy',
            'onclick': (e, fnc)=>{
              fnc();
              this.eventEmit('event-copy');
            }
        },
        {
            'text': 'Paste',
            'onclick': (e, fnc)=>{
              fnc();
              this.eventEmit('event-paste');
            }
        },
        {
            'text': 'Add-Node',
            'onclick': (e, fnc)=>{
              fnc();
              this.eventEmit('event-addnode');
            }
        },
        {
            'text': 'Add-Value',
            'onclick': (e, fnc)=>{
              fnc();
              this.eventEmit('event-addvalue');
            }
        },
        {
            'text': 'Save',
            'onclick': (e, fnc)=>{
              fnc();
              this.eventEmit('event-save');
            }
        },
        {
            'text': 'Refersh',
            'onclick': (e, fnc)=>{
              fnc();
              this.eventEmit('event-refresh');
            }
        },
        {
            'text': 'Delete',
            'onclick': (e, fnc)=>{
              fnc();
              this.eventEmit('event-delete');
            }
        },
      ]);
      //this.classList.add('v-on:click="eventEmit"');
    },
  },
  mounted(){
    _this = this;
  },
  // 'initTreeContextMenu': (ele)=>{
  //   createContextmenu(ele, [
  //           {
  //               'text': 'Edit',
  //               'onclick': (e, fnc)=>{
  //                 fnc();
  //                 this.eventEmit('edit');
  //               }
  //           },
  //           // 'divider',
  //           // {
  //           //     'text': 'Click me',
  //           //     'onclick': ()=>alert('nice')
  //           // },
  //           // {
  //           //     'text': 'Save',
  //           //     'extraText': 'ctrl+s'
  //           // },
  //           // {
  //           //     'text': 'Delete',
  //           //     'extraText': 'ctrl+shift+d'
  //           // },
  //           // 'divider',
  //           // {
  //           //     'text': 'Sub-Menu',
  //           //     'sub':[
  //           //         {
  //           //             'text': 'larger than window height!'
  //           //         },
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{}  //text of empty items default to "text"
  //           //     ]
  //           // },
  //           // {
  //           //     'text': 'Sub-Menu',
  //           //     'sub':[
  //           //         {
  //           //             'text': 'larger than half of window height!'
  //           //         },
  //           //         {},{},{},{},{},{},{},
  //           //         {},{},{},{},{},{},{},{},
  //           //         {
  //           //             'sub': [
  //           //                 {},
  //           //                 {},
  //           //                 {
  //           //                     'sub': [
  //           //                         {},
  //           //                         {},
  //           //                         {}
  //           //                     ]
  //           //                 },
  //           //                 {},
  //           //                 {},
  //           //                 {
  //           //                     'sub': [
  //           //                         {},
  //           //                         {},
  //           //                         {
  //           //                             'sub': [
  //           //                                 {},
  //           //                                 {},
  //           //                                 {},
  //           //                                 {},
  //           //                                 {},
  //           //                                 {},
  //           //                                 {
  //           //                                     'sub':[
  //           //                                         {},
  //           //                                         {},
  //           //                                         {},
  //           //                                         {},
  //           //                                         {},
  //           //                                         {},
  //           //                                     ]
  //           //                                 },
  //           //                                 {},
  //           //                                 {},
  //           //                             ]
  //           //                         }
  //           //                     ]
  //           //                 }
  //           //             ]
  //           //         },
  //           //         {},{},{},{},{},{},{},{}
  //           //     ]
  //           // }
  //       ])
  // }
}
</script>

<style>
  #popup{
    display: none;
    position:fixed;
    background: #fff;
    box-shadow:1px 1px 5px 0 rgba(0, 0, 0, 0.54);
  } 

  .contextmenu-container{
            position: absolute;
            top:0;
            user-select:none;
            z-index:100000;

            background-color:rgb(250, 250, 250);
            margin:0;
            padding:0px;

            width:auto;
            min-width:150px;
            
            box-shadow:0px 0px 10px rgb(0,0,0,0.2);
            border:3px solid rgb(215, 215, 215);

            font-family: Arial, helvetica, sans-serif, serif;
            font-size: 13px;
            
            color:rgb(0,0,0,0.8);
        }

        .contextmenu-divider{
            width:85%;
            margin:3px auto;
            border: 1px solid rgb(0,0,0,0.15);
        }

        .contextmenu-text{
            margin:0;
            padding:5px 10px;
            pointer-events: none;
            white-space: nowrap;
        }

        .contextmenu-extraText{
            margin:0;
            padding:5px 10px;
            color:rgb(0,0,0,0.6);
        }

        .contextmenu-focus{
            background-color:rgb(220, 220, 220);
        }

        .contextmenu-item:hover{
            background-color:rgb(235, 235, 235);
        }        
</style>