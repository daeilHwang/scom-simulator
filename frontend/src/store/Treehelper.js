import _ from 'lodash';

let logictree = undefined;
let xmldata = undefined;

export default {
    initialize: (xml) => {
        logictree = new Object();
        xmldata = xml;
    },
    isLeaf: (el) => {
        return _isLeaf(el);
        // let classes = el.className.toString().split(/\s+/);
    },
    makeLabel: (name, instance) => {
        let result;
        if(name.indexOf('#text') != -1) {
            return instance;
        }
        else{
            result = '<' + name + ' ';
            // result = '<S' + instance.Header.Stream['#text'] 
            //     + 'F' + instance.Header.Function['#text'] + ' ';
        }
        
        // 아래 3줄이 왜있는지 모르겠음..
        // if(name.indexOf('#text') != -1) {
        //     name.replace('#text', instance);
        // }
        for(let key in instance){
            if(key.startsWith('@'))
                result += key.replace('@_', '') + "=" + instance[key] + " ";
        }

        return result.trim() + '>';
    },
    changeNodeAtTree: (metadata, target, source) => {
        let supernode = _findInstanceAtTree(metadata.id, 1);
        let element = _getElementInTree(metadata.id);

        // 값을 수정한 것이면 값만 수정하고 return;
        if(_isLeaf(element.value)) {
            supernode["#text"] = target.join(' ');
            return;
        }

        let curNode = supernode[source[0]];

        if(Array.isArray(curNode)){
            let index = _getArrayindexInID(metadata.id);
            curNode[index] = _deleteAllAttributeInNode(curNode[index]);
            curNode[index] = _addAttributeInNode(curNode[index], target);

            if(source[0] != target[0]){
                let clone = _.cloneDeep(curNode[index]);
                let length = _deleteNodeInArray(curNode, index);
                if(length == 1) {
                    supernode[source[0]] = curNode.pop();
                }
                else if(length == 0){
                    delete supernode[source[0]];
                }

                if(Object.prototype.hasOwnProperty.call(supernode, target[0])){
                    if(Array.isArray(supernode[target[0]])){
                        supernode[target[0]].push(clone);
                    }
                    else{
                        let copy = supernode[target[0]];
                        supernode[target[0]] = new Array();
                        supernode[target[0]].push(copy);
                        supernode[target[0]].push(clone);
                    }
                }
                else{
                    supernode[target[0]] = clone;
                }
            }
        }
        else{
            curNode = _deleteAllAttributeInNode(curNode);
            curNode = _addAttributeInNode(curNode, target);
            
            if(supernode[target[0]] === undefined) {
                supernode[target[0]] = curNode;
            }
            else{
                if(Array.isArray(supernode[target[0]])){
                    supernode[target[0]].push(curNode);
                }
                else{
                    let copy = supernode[target[0]];
                    supernode[target[0]] = new Array();
                    supernode[target[0]].push(copy);
                    supernode[target[0]].push(_.cloneDeep(curNode));
                }
            }

            delete supernode[source[0]];
        }
    },
    modifyLogicalTree: (id, value) => {
        let ids = id.split('_');
        let target = logictree;

        for(let i=0; i<ids.length; i++){
            target = _modifyLogicalTree(target, ids[i]);
        }

        target.value = value;
    },
    getInstance: (id, depth) => {
        let instance = new Object();
        instance.xmlnode = _findInstanceAtTree(id, depth);
        instance.element = _getElementInTree(id, depth)

        return instance;
    },
    getNewIDNotDuplicate: (curnode, id) => {
        let bool = true;
        let pivot = 0;
        let curid = id;
        
        while(bool){
            if(Object.prototype.hasOwnProperty.call(curnode, curid)){
                pivot += 1;
                curid = id + pivot;
                continue;
            }
            bool = false;
        }
        return curid;
    },
    getXmlData(){
        return xmldata;
    },
    getLogicaltree(){
        return logictree;
    },
    isRootElement(ele){
        let boolean = false;
        !ele['#super'].value ? boolean = false : boolean = true;
        return boolean;
    },
    deleteNodeInArray(arr, index){
        return _deleteNodeInArray(arr,index);
    },
    getArrayindexInID(id){
        return _getArrayindexInID(id);
    },
    getSECSMessage(id){
        let ids = id.split('_');
        if(ids.length <= 1)
            return undefined;
        else{
            let target = _findInstanceAtTree(ids[0] + '_' + ids[1]);
            let secsmsg = {
                'Stream' : '',
                'Function': '',
                'MessageName': '',
                'Wait' : 'false',
                'AutoReply' : 'false',
                'NoLogging': 'false',
                'Description': '',
                'Direction': '',
            };
            secsmsg.Stream = target.Header.Stream['#text'];
            secsmsg.Function = target.Header.Function['#text'];
            secsmsg.MessageName = target.Header.MessageName['#text'];
            secsmsg.Wait = target.Header.Wait['#text'];
            secsmsg.AutoReply = target.Header.AutoReply['#text'];
            secsmsg.NoLogging = target.Header.NoLogging['#text'];
            secsmsg.Description = target.Header.Description['#text'];
            secsmsg.Direction = target.Header.Direction['#text'];
            return secsmsg;
        }
            
    }
}

// 아래는 내부함수 모음 (외부에서 사용 x)
function _modifyLogicalTree(node, id){
    if(node[id] === undefined){
        node[id] = new Object();
        node[id]['#super'] = node;
    }

    return node[id];
}

function _getElementInTree(id, depth) {
    let ids = id.split('_');
    let target = logictree;
    let curdep;
    depth === undefined ? curdep = 0 : curdep = depth;

    for(let i=0; i<ids.length-curdep; i++){
        target = target[ids[i]];
    }

    return target;
}

function _findInstanceAtTree(curIdStr, depth){
    let instance = xmldata;
    let curIds = curIdStr.split('_');
    let curdep;
    depth === undefined ? curdep = 0 : curdep = depth;

    for(var i=0; i<curIds.length - curdep; i++){
        if(curIds[i].indexOf('#') != -1){
        let ids = curIds[i].split('#');
            instance = instance[ids[0]];
            instance = instance[ids[1]];
        }                          
        else{
            instance = instance[curIds[i]];
        }
    }

    return instance;
}

function _isLeaf(el){
    if (el.className.indexOf("leaf") !== -1) 
        return true;
    else
        return false;
}

function _deleteAllAttributeInNode(node){
    for(let key in node){
        if(key.startsWith('@_'))
            delete node[key];
    }
    return node;
}

function _addAttributeInNode(node, attrs){
    for(let i=1; i<attrs.length; i++){
        let attr = attrs[i].split('=');
        node['@_' + attr[0]] = attr[1];
    }

    return node;
}

function _getArrayindexInID(id){
    let index = id.split('_');
    index = index[index.length-1].split('#')[1];
    return index;
}

function _deleteNodeInArray(arr, index){
    try{
        arr.splice(index, 1);
    }catch(err){
        return -1;
    }
    return arr.length;
}