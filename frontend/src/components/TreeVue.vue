<template>
  <div id='sm_wrapper'>
    <div id="tree"></div>
    <ContextMenu 
        v-on:event-copy='eventCopy'
        v-on:event-paste='eventPaste'
        v-on:event-edit='eventEdit' 
        v-on:event-save='eventSave'
        v-on:event-refresh='eventRefresh'
        v-on:event-delete='eventDelete'
        v-on:event-addnode='eventAddNode'
        v-on:event-addvalue='eventAddValue'>
    </ContextMenu>
  </div>
</template>

<script>
//import { VanillaTreeView } from '../store/treeview.vanilla.js';
import _helper from '../store/Treehelper.js';
import ContextMenu from './ContextMenu.vue';
import _ from 'lodash';
import Swal from 'sweetalert2';
//import { createContextmenu } from '../store/contextmenu.js'
let selectedNode;
let tree;
let treeview;
let isEditing = false;
let _this;  // save a vue component
let copyNode;

export default {
    components: {
        ContextMenu
    },
    mounted(){
        _this = this;
        ContextMenu.methods.initTreeContextMenu(document.getElementById('xmlEditorWrapper'));
    },
    // data: function() {
    //     return {
    //         result : this.propsdata
    //     }
    // },
    methods: {
        'redrawTree': function(){
            tree = document.getElementById('tree');
            tree.innerHTML = '';
            // logicalRoot = new Object();
            treeview = new VanillaTreeView(tree, {
            provider: {
                async getChildren(id) {
                    let transactions = [];
                    if (!id) {
                      for(let key in _helper.getXmlData()){
                          if(key !== '?xml')
                                transactions.push({ id: key, label: '<' + key + '>', icon: 'fa-folder-tree', state: 'expanded' });
                      }
                    } else {
                      // ID에 해당하는 인스턴스를 반복문을 통해 찾아감.
                      let instance = _helper.getInstance(id).xmlnode;

                      // 찾아낸 인스턴스의 자식 개체를 상황에 맞게 판별하고 동작
                      let itemType = typeof(instance);
                      switch(itemType){
                        case 'object':
                          for(let key in instance){
                            if(Array.isArray(instance[key])){
                                for(let i=0; i<instance[key].length; i++){
                                    transactions.push({ id: id + '_' + key + '#' + i, label: _helper.makeLabel(key, instance[key][i]), icon: 'fa-folder', state: 'collapsed' });
                                }
                            }
                            else{
                              if(key.indexOf('#text') != -1){
                                transactions.push({ id: id + '_' + instance[key], label: _helper.makeLabel(key, instance[key]), icon: 'fa-file' });
                              }
                              else if(!key.startsWith('@')){
                                  let obj = { id: id + '_' + key, label: _helper.makeLabel(key, instance[key]), icon: 'fa-folder', state: 'collapsed', direction:undefined };
                                  
                                  if(Object.prototype.hasOwnProperty.call(instance[key], 'Header')){
                                       // <가 있으면
                                        if(instance[key].Header.Direction['#text'].indexOf('<') !== -1){
                                            if(instance[key].Header.Direction['#text'].indexOf('>') !== -1){
                                                // 양방향
                                                obj.direction = 'bidir';
                                            }
                                            else{
                                                // 호스트에게
                                                obj.direction = 'tohost';
                                            }
                                        }
                                        else{
                                            obj.direction = 'toeqp';
                                        }
                                  }
                                transactions.push(obj);
                              }
                            }
                          }
                          break;
                        default:
                          if(instance !== ''){
                            transactions.push({ id: id + '_' + instance, label: instance, icon: 'fa-file'});
                          }
                          break;
                      }
                    }
                    return transactions;
                }
            }
          });
        },
        'initTree': function(result) {
            // xmldata = result;
            // console.log(xmldata);
            _helper.initialize(result);
            this.redrawTree();
        },
        'collpaseAndExpand': function(element){
            treeview._collapseNode(element);
            treeview._expandNode(element);
        },
        eventAddNode: function(){
            if(selectedNode === undefined) { this.alertError("No node selected!"); return; }
            if(_helper.isLeaf(selectedNode)) { this.alertError("You cannot add nodes to a value."); return;}

            let metadata = treeview._getMetadata(selectedNode);
            let instance = _helper.getInstance(metadata.id);
            let curid = _helper.getNewIDNotDuplicate(instance.xmlnode, 'tmp');
            instance.xmlnode[curid] = {};

            _this.collpaseAndExpand(instance.element.value);
        },
        eventAddValue: function(value){
            if(selectedNode === undefined) { this.alertError("No node selected!"); return; }
            if(_helper.isLeaf(selectedNode)) { this.alertError("You cannot add value to a value."); return; }
            
            let metadata = treeview._getMetadata(selectedNode);
            let instance = _helper.getInstance(metadata.id);
            
            if(Object.prototype.hasOwnProperty.call(instance.xmlnode, '#text')) { this.alertError("The node already has a value."); return; }

            value === undefined ? value = '' : value;
            instance.xmlnode['#text'] = value;
            this.collpaseAndExpand(instance.element.value);
        },
        eventEdit: function(){
            if(selectedNode === undefined) { this.alertError("No node selected!"); return; }
            isEditing = true;
            let metadata = treeview._getMetadata(selectedNode);
            let copyHTML = selectedNode.innerHTML.toString();
            selectedNode.innerHTML = "<input type='text' id='inputtext' spellcheck='false' autocomplete='off'/>"
            this._showEditText(metadata, copyHTML);
        },
        regulateEditTextWidth : function(editText){
            let fontsize = parseInt(document.defaultView.getComputedStyle(tree).getPropertyValue('font-size'));
            let wrapperWidth = document.getElementById('xmlEditorWrapper').clientWidth;
            let padding = parseInt(selectedNode.style.paddingLeft.replace('em', ''))*fontsize;
            let edittextWidth = editText.clientWidth + padding;

            if(edittextWidth > wrapperWidth){
                edittextWidth = wrapperWidth - padding;
                editText.removeAttribute('size');
                editText.style.width = edittextWidth + 'px';
            }
        },
        eventSave: function(){
            _this.$emit('event-save', _helper.getXmlData());
        },
        eventCopy: function(){
            if(selectedNode === undefined) { this.alertError("No node selected!"); return; }

            let metadata = treeview._getMetadata(selectedNode);
            let instance = _helper.getInstance(metadata.id);
            copyNode = new Object();
            copyNode.element = instance.element;
            metadata.label = metadata.label.split(' ')[0].replace(/[<>]/g, '');

            _helper.isLeaf(selectedNode) ? copyNode.xmlnode = undefined : copyNode.xmlnode = instance.xmlnode;
            // copyNode.xmlnode = instance.xmlnode;
            copyNode.metadata = metadata;
        },
        eventPaste: function(){
            if(selectedNode === undefined) { this.alertError("No node selected!"); return; }
            if(!copyNode) { this.alertError("The copied node does not exist."); return; }
            if(_helper.isLeaf(selectedNode)) { this.alertError("You cannot paste to a value."); return;}
            
            let targetId = treeview._getMetadata(selectedNode).id;
            let instance = _helper.getInstance(targetId);

            if(copyNode.xmlnode === undefined) this.eventAddValue(copyNode.metadata.label);
            else{
                // copyNode.metadata.label = _helper.getNewIDNotDuplicate(instance.xmlnode, copyNode.metadata.label.replace(/[<>]/g, ''));
                copyNode.metadata.label = copyNode.metadata.label.replace(/[<>]/g, '');
                if(Object.prototype.hasOwnProperty.call(instance.xmlnode, copyNode.metadata.label)){
                    if(Array.isArray(instance.xmlnode[copyNode.metadata.label])){
                        instance.xmlnode[copyNode.metadata.label].push(_.cloneDeep(copyNode.xmlnode));
                    }
                    else{
                        let copy = instance.xmlnode[copyNode.metadata.label];
                        instance.xmlnode[copyNode.metadata.label] = new Array();
                        instance.xmlnode[copyNode.metadata.label].push(copy);
                        instance.xmlnode[copyNode.metadata.label].push(_.cloneDeep(copyNode.xmlnode));   
                    }
                }
                else{
                    instance.xmlnode[copyNode.metadata.label] = _.cloneDeep(copyNode.xmlnode);
                }
            }

            _this.collpaseAndExpand(instance.element.value);
        },
        eventRefresh: function(){
            this.redrawTree();
        },
        eventDelete: function(){
            if(selectedNode === undefined) { this.alertError("No node selected!"); return; }
            let metadata = treeview._getMetadata(selectedNode);
            let instance = _helper.getInstance(metadata.id);
            if(!_helper.isRootElement(instance.element)) { this.alertError("The Root Element cannot be deleted."); return; }

            Swal.fire({
                title : "Are you sure delete this Node?",
                icon : "warning",
                confirmButtonText : "Delete",
                showCancelButton : true,
                cancelButtonText : "Cancel",
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
            }).then((result) => {
                if (result.isConfirmed) {
                    let superInstance = _helper.getInstance(metadata.id, 1);
                    let curid = metadata.label.replace(/[<>]/g, '').split(' ')[0];

                    if(Array.isArray(superInstance.xmlnode[curid])){
                        let index = _helper.getArrayindexInID(metadata.id);
                        let length = _helper.deleteNodeInArray(superInstance.xmlnode[curid], index);
                        if(length == 1) {
                            superInstance.xmlnode[curid] = superInstance.xmlnode[curid].pop();
                        }
                        else if(length == 0){
                            delete superInstance.xmlnode[curid];
                        }
                    }
                    else{
                        delete superInstance.element[curid];
                        _helper.isLeaf(selectedNode) ? delete superInstance.xmlnode['#text'] : delete superInstance.xmlnode[curid];
                    }
                    
                    this.collpaseAndExpand(superInstance.element.value);
                }
            });
        },
        // eventSelect: function(node){
        //     _this.$emit('event-selectnode', node);
        // },
        alertError: function(msg){
            _this.$emit('event-okconfirm', 'Error', msg, 'error');
        },
        alertWarning: function(msg){
            _this.$emit('event-okconfirm', 'Warning', msg, 'warning');
        },
        _showEditText: function(metadata, copyHTML){
            let editText = document.getElementById('inputtext');
            editText.focus();
            editText.value = metadata.label.replace(/[<>]/g, '');
            editText.setAttribute('size', editText.value.length);
            this.regulateEditTextWidth(editText);
            editText.addEventListener('focusout', () => this._editTextCallbackFunc(metadata, copyHTML, editText));
            editText.addEventListener('keyup', (e) => {
                let originValue = metadata.label.replace(/[<>]/g, '');
                if(e.key === 'Enter')
                    editText.blur();
                else if(e.key === 'Escape'){
                    editText.value = originValue;
                    editText.blur();
                }
            });
            editText.addEventListener('input', () => {
                // console.log(e.target.value);
                editText.setAttribute('size', editText.value.length);
                _this.regulateEditTextWidth(editText);
            });
            return editText;
        },
        _editTextCallbackFunc: function(metadata, copyHTML, editText){
            let source = metadata.label.replace(/[<>]/g, '');

            // 수정사항이 있으면??
            if(source != editText.value){
                let target = editText.value.replace(/[<>]/g, '');
                target = target.replace(/[^A-Za-z 0-9=]/g, '');
                copyHTML = copyHTML.replace(source, target);
                _helper.changeNodeAtTree(metadata, target.split(' '), source.split(' '));
            }
            selectedNode.innerHTML = copyHTML;
            metadata.label = editText.value

            treeview._setMetadata(selectedNode, metadata);
            
            // console.log(treeview);
            editText.remove();
            _this.collpaseAndExpand(_helper.getInstance(metadata.id, 1).element.value);

            isEditing = false;
        },
    }
}

/**
 * Tree node state.
 */
 var CollapsibleState;
 (function (CollapsibleState) {
     /** Node cannot be neither collapsed nor expanded. It is a leaf. */
     CollapsibleState["None"] = "";
     /** Node is collapsed and can be expanded. */
     CollapsibleState["Collapsed"] = "collapsed";
     /** Node is expanded and can be collapsed. */
     CollapsibleState["Expanded"] = "expanded";
 })(CollapsibleState || (CollapsibleState = {}));
 /**
  * Core implementation of tree view component providing the basic functionality.
  * @abstract
  */
 class TreeView {
     /**
      * Initializes a new tree view.
      * @param container HTML element that will host the tree view.
      * @param options Additional options.
      */

     constructor(container, options) {
         this.container = container;
         this.provider = options.provider;
         this.onSelectionChanged = options.onSelectionChanged;
         this.root = document.createElement('div');
        //  this.root = document.getElementById('tree');
         this._onRootClick = this._onRootClick.bind(this);
         this._onRootDoubleClick = this._onRootDoubleClick.bind(this);
         this._onContextMenu = this._onContextMenu.bind(this);
         this.attach();
     }
     /**
      * Attaches the tree view to the DOM.
      */
     attach() {
         this.root.addEventListener('click', this._onRootClick);
         this.root.addEventListener('dblclick', this._onRootDoubleClick);
         this.root.addEventListener('contextmenu', this._onContextMenu);
         this.container.appendChild(this.root);
         this._render(undefined, 0);
     }
     /**
      * Detaches the tree view from the DOM.
      */
     detach() {
         this.root.removeEventListener('dblclick', this._onRootClick);
         this.root.removeEventListener('dblclick', this._onRootDoubleClick);
         this.root.removeEventListener('contextmenu', this._onContextMenu);
         this.container.removeChild(this.root);
     }

     _onContextMenu(ev){
        let el = ev.target;
        while (!this._hasMetadata(el) && el.parentElement) {
            el = el.parentElement;
        }
        selectedNode = el;
     }
     _onRootDoubleClick(ev){
         if(isEditing) return;
        //  if(selectedNode !== undefined) selectedNode = undefined;

        try{
            let el = ev.target;
            while (!this._hasMetadata(el) && el.parentElement) {
                el = el.parentElement;
            }
            const metadata = this._getMetadata(el);
            switch (metadata.state) {
                case CollapsibleState.Collapsed:
                    this._expandNode(el);
                    break;
                case CollapsibleState.Expanded:
                    this._collapseNode(el);
                    break;
                default:
                    this.onNodeClicked(el);
                    if (this.onSelectionChanged) {
                        this.onSelectionChanged([metadata]);
                    }
                    break;
            }
            return false;
        }catch(ex){
            return false;
        }
     }

     _onRootClick(ev) {
         if(isEditing) return;
        //  if(selectedNode !== undefined) selectedNode = undefined;

        try{
            let el = ev.target;
            while (!this._hasMetadata(el) && el.parentElement) {
                el = el.parentElement;
            }
            const metadata = this._getMetadata(el);
            let secsmessage = _helper.getSECSMessage(metadata.id);
            if(secsmessage)
                _this.$emit('event-selectnode', secsmessage);
                
        }catch(ex){
            return false;
        }
     }
     async _render(id, level, insertAfterEl) {
         const root = this.root;
         const children = await this.provider.getChildren(id);
         for (const { id, label, icon, state, direction } of children) {
             const metadata = { id, label, level, icon, state: state || CollapsibleState.None, loading: false , direction};
             const el = this.renderNode(metadata);
             el.style.paddingLeft = `${level}em`;
             this._setMetadata(el, metadata);
             if (insertAfterEl) {
                 insertAfterEl.insertAdjacentElement('afterend', el);
             }
             else {
                 root.appendChild(el);
             }
             insertAfterEl = el;
             if (metadata.state === CollapsibleState.Expanded) {
                 this._expandNode(el);
             }

             _helper.modifyLogicalTree(metadata.id, el);
         }
        //  console.log(logicalRoot);
     }
     _expandNode(el) {
         const metadata = this._getMetadata(el);
         if (!metadata.loading) {
             metadata.loading = true;
             this._setMetadata(el, metadata);
             this.onNodeLoading(metadata, el);
             this._render(metadata.id, metadata.level + 1, el)
                 .then(() => {
                 metadata.loading = false;
                 metadata.state = CollapsibleState.Expanded;
                 this._setMetadata(el, metadata);
                 this.onNodeExpanded(metadata, el);
             });
         }
     }
     _collapseNode(el) {
         const root = this.root;
         const metadata = this._getMetadata(el);
         if (!metadata.loading) {
             while (el.nextSibling && this._getMetadata(el.nextSibling).level > metadata.level) {
                _helper.modifyLogicalTree(this._getMetadata(el.nextSibling).id, undefined);
                root.removeChild(el.nextSibling);
             }
             metadata.state = CollapsibleState.Collapsed;
             this._setMetadata(el, metadata);
             this.onNodeCollapsed(metadata, el);
         }
     }
     _getMetadata(el) {
         try{
            //console.assert(el.hasAttribute('data-treeview'));
            return JSON.parse(el.getAttribute('data-treeview'));
         }catch(err){
             return;
         }
         
     }
     _setMetadata(el, metadata) {
         el.setAttribute('data-treeview', JSON.stringify(metadata));
     }
     _hasMetadata(el) {
         return el.hasAttribute('data-treeview');
     }
 }
 
 const NodeClass = 'treeview-node';
 const CollapsedNodeClass = 'treeview-node-collapsed';
 const ExpandedNodeClass = 'treeview-node-expanded';
 const LeafNodeClass = 'treeview-node-leaf';
 const LoadingNodeClass = 'treeview-node-loading';
 /**
  * Tree view component built using vanilla JavaScript and CSS.
  *
  * The component makes use of [Font Awesome](https://fontawesome.com) icons, so classes
  * such as `fa-folder` or `fa-clock` can be used in {@link INode}'s `icon` property.
  */
 class VanillaTreeView extends TreeView {
     renderNode(node) {
         const el = document.createElement('div');

         el.classList.add(NodeClass);
         switch (node.state) {
             case CollapsibleState.Collapsed:
                 el.classList.add(CollapsedNodeClass);
                 break;
             case CollapsibleState.Expanded:
                 el.classList.add(ExpandedNodeClass);
                 break;
             case CollapsibleState.None:
                 el.classList.add(LeafNodeClass);
                 break;
         }
         const icon = document.createElement('div');
         icon.classList.add('icon');
         if (node.icon) {
             if (typeof node.icon === 'string') {
                //  icon.classList.add("far", node.icon);
                icon.classList.add('fas', node.icon);
                switch(node.icon){
                    case 'fa-folder-tree':
                        icon.classList.add('secsmsg')
                        break;
                }
             }
             else if ('classes' in node.icon) {
                 icon.classList.add(...node.icon.classes);
             }
             else if ('src' in node.icon) {
                 const img = document.createElement('img');
                 img.src = node.icon.src;
                 icon.appendChild(img);
             }
         }
         if(node.direction){
             if(node.direction !== undefined){
                 icon.classList.remove('fa-folder');
                 switch(node.direction){
                    case 'bidir':
                        icon.classList.add('fa-arrow-right-arrow-left', 'bidir');
                        break;
                    case 'tohost':
                        icon.classList.add('fa-arrow-left', 'tohost')
                        break;
                    case 'toeqp':
                        icon.classList.add('fa-arrow-right', 'toeqp')
                        break;
                 }
             }
         }
         el.appendChild(icon);
         const label = document.createElement('label');
         label.innerText = node.label;
         el.appendChild(label);
         return el;
     }
    //  /**
    //   * Reacts to the event of a tree node being clicked.
    //   * @param node Tree node metadata.
    //   * @param el Tree node HTML element.
    //   */
     onNodeClicked(node, el) {
        selectedNode = el;
     }
    //  /**
    //   * Reacts to the event of a tree node loading its children.
    //   * @param node Tree node metadata.
    //   * @param el Tree node HTML element.
    //   */
     onNodeLoading(node, el) {
         el.classList.remove(ExpandedNodeClass, CollapsedNodeClass);
         el.classList.add(LoadingNodeClass);
     }
    //  /**
    //   * Reacts to the event of a tree node being collapsed.
    //   * @param node Tree node metadata.
    //   * @param el Tree node HTML element.
    //   */
     onNodeCollapsed(node, el) {
         el.classList.remove(ExpandedNodeClass, LoadingNodeClass);
         el.classList.add(CollapsedNodeClass);
     }
    //  /**
    //   * Reacts to the event of a tree node being expanded.
    //   * @param node Tree node metadata.
    //   * @param el Tree node HTML element.
    //   */
     onNodeExpanded(node, el) {
         el.classList.remove(CollapsedNodeClass, LoadingNodeClass);
         el.classList.add(ExpandedNodeClass);
     }
 }
 
//  export { VanillaTreeView };
 
</script>

<style>

h1 {
  color: white;
  /* margin: 3rem 0 1rem 0; */
  padding: 0;
  font-size: 1.5rem;
}

/* textarea {
  width: 300px;
  min-height: 200px;
  resize: none;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0.5rem;
  color: #666;
  -webkit-box-shadow: inset 0 0 0.25rem #ddd;
          box-shadow: inset 0 0 0.25rem #ddd;
}

textarea:focus {
  outline: none;
  border: 1px solid #d0d0d0;
  -webkit-box-shadow: inset 0 0 0.5rem #d0d0d0;
          box-shadow: inset 0 0 0.5rem #d0d0d0;
}

textarea[placeholder] {
  font-style: italic;
  font-size: 0.875rem;
} */

#the-count {
  float: right;
  padding: 0.1rem 0 0 0;
  font-size: 0.875rem;
}

/* #the-textarea-bot {
  white-space: pre-wrap;
} */

#tree {
    text-align: left;
    border: 1px solid lightgrey;
    /* display:block; */
    /* max-width: 20em; */
    /* margin: 2em; */
}

.treeview-node {
    white-space: nowrap;
    overflow-x: hidden;
    /* text-overflow: ellipsis; */
}

.treeview-node .icon {
    display: inline-block;
    margin-right: 0.5em;
    width: 12px;
}



.treeview-node .icon img {
    width: 12px;
}

.treeview-node:nth-child(odd) {
    /* background: rgba(32, 64, 128, 0.05); */
    color: #A8D8F0;
    background: #19405D;
}
.treeview-node:nth-child(even) {
    /* background: rgba(32, 64, 128, 0.05); */
    color: #A8D8F0;
    background: #2B5573;
}

.treeview-node:hover {
    /* background: rgba(32, 64, 128, 0.1); */
    color: #E8FFF0;
    background: #4E7795;
    transition: 0.1s ease-in;
}

.treeview-node.active {
    /* background: rgba(32, 64, 128, 0.9); */
    color: #E8FFF0;
    background: #4E7795;
}

.treeview-node {
    cursor: pointer;
    padding: 0.5em;
}

.treeview-node.treeview-node-collapsed::before,
.treeview-node.treeview-node-expanded::before,
.treeview-node.treeview-node-loading::before,
.treeview-node.treeview-node-leaf::before {
    font-family: monospace;
    margin: 0.5em;
}

.treeview-node.treeview-node-collapsed::before {
    content: "+";
}

.treeview-node.treeview-node-expanded::before {
    content: "-";
}

.treeview-node.treeview-node-loading::before {
    content: "?";
}

.treeview-node.treeview-node-leaf::before {
    content: ".";
    visibility: hidden;
}

#inputtext {
    height: 1.1rem;
    max-height: 1.1rem;
    font-size: 1rem;
    overflow:auto;
}

.secsmsg {
    color: #9fa8da;
}
.bidir{
    color:#f57c00;
}
.tohost{
    color:#ffeb3b;
}
.toeqp{
    color:#66bb6a;
}

/*# sourceMappingURL=style.css.map */
</style>