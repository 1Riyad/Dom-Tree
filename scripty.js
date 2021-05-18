let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d");
let root = document.getRootNode();
// save Image button
let button = document.querySelector("#button")
button.addEventListener("click", () => {
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    window.location.href = image; // it will save locally
})

// public variables
let indexOnLevel = new Array(100).fill(0)
let allee = []
let isMoving=false
let isNodeClicked=false
var isMouseUp = false
var mouseUpX = 0
var mouseUpX = 0
var mouseDownX = 0
var mouseDownY = 0

node = {
    n: root,
    shapePath: new Path2D(),
    attrShape: new Path2D(),
    min_maxShape: new Path2D(),
    line: new Path2D(),
    level: -1,
    nextLevelChilds: 0,
    position: { x: 0, y: 100 },
    innerText: "",
    attr: [],
    childrens: [],
    lineToPerant: { x: 0, y: 0 },
    show: true,
    isRoot: false
}


// recursiveT(node , node.position.y,node.lineToPerant.x,node.lineToPerant.y, node.level)
recursiveT(node, 100, 0, 0, -1)

//---------------------------------------------
///////////////////////////////
//////  helper methods   //////
//////////////////////////////
function getXY(canvas, event) { //shape 
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top //mouse event
    const x = event.clientX - rect.left
    return { x: x, y: y }
}
function getNodesPerLevel(row) {
    return row <= 0 ? 1 : _getNodesPerLevel(document, row)
}
function _getNodesPerLevel(e, row) {
    if (row == 0)
        if ("children" in e)
            return e.children.length;
        else
            return 0;
    else if (!("children" in e))
        return 0;
    var total = 0
    for (let i = 0; i < e.children.length; i++)
        total += _getNodesPerLevel(e.children[i], row - 1)
    return total;
}
///////////////////////////////
/////////  drawing   //////////
///////////////////////////////
function draw(node, x, y, bigX, bigY) {
    HighlightFeature(node, x, y)// draw node
    if (node.level > 0) {
        context.beginPath(); /// ?
        context.moveTo(node.n.positionX, node.n.positionY - 31)
        context.lineTo(bigX, bigY + 30)
        context.strokeStyle = "#72CBE3"
        context.fill()
        context.stroke();
    }
}
//---------------------------------------
function texty(param, x, y) {
    // const para1 = param;
    if (param.n.firstChild != null && param.n.firstChild.data.trim() != "") {
        context.beginPath();
        context.strokeStyle = "lightblue";
        context.fillStyle = "#9CB0FF";
        context.lineWidth = 3;
        context.fillRect(x - 35, y + 40, 50, 30);
        context.strokeRect(x - 35, y + 40, 50, 30);
        context.fillStyle = "#000000";
        if (param.n.textContent.length > 5) {
            context.fillText(param.n.textContent.substring(0, 7) + "...", x - 35, y + 55, 50);
        }
        else {
            // context.textAlign = ""
            context.fillText(param.n.textContent, x - 35, y + 55, 70);
        }
        context.stroke();

        context.beginPath();
        context.moveTo(x - 15, y + 40)
        context.lineTo(x, y + 30)
        context.strokeStyle = "#72CBE3"
        context.fill()
        context.stroke();
    }
}
//---------------------------------------
function HighlightFeature(element, x, y) {
    context.beginPath();
    element.shapePath = new Path2D()
    element.shapePath.arc(x, y, 30, 0, Math.PI * 2, true)
    context.font = "12px Georgia"
    context.fillStyle = "#000000";
    context.fillText(element.n.nodeName, x - 20, y);
    context.fillStyle = "#3d32";
    context.strokeStyle = "#757599"
    context.fill(element.shapePath)
    context.stroke(element.shapePath)
}
//---------------------------------------
function AttrFeature(element, x, y) {
    let path = new Path2D()
    element.attrShape = path;
    element.attrShape.rect(x - 55, y, 20, 10)
    context.fill();
    context.fillStyle = "#ffffff"
    context.fill(element.attrShape)
    context.stroke(element.attrShape)
    context.font = "12px Georgia"
    context.fillStyle = "#000000";
    context.fillText("...", x - 50, y + 5, 30)
}
//---------------------------------------
function minMaxFeature(element, x, y) {
    if (element.n.hasChildNodes() && (element.n.childElementCount > 0)) {
        context.beginPath();
        let min_max_node = new Path2D();
        element.min_maxShape = min_max_node;
        element.min_maxShape.rect(x - 48, y - 18, 10, 10);
        element.CallipsX = x - 48;
        element.CallipsY = y - 18;
        context.fillStyle = "white";
        context.fill(element.min_maxShape);
        context.stroke(element.min_maxShape);
        context.font = "14px Georgia";
        context.fillStyle = "black";
        context.fillText(element.n.show ? "-" : "+", x - 48, y - 10);
        context.stroke()
    }
}
//---------------------------------------
//////////////////////////////////
///////////// main func //////////
//////////////////////////////////
function recursiveT(node_ = node, y = 100, bigX = 0, bigY = 0, level = -1) {
    let nodeb = Object.create(node_);
    indexOnLevel[level] += 1;
    level++;
    nodeb.level = level
    if (level == 1) {
        nodeb.isRoot = true;
    }
    for (let index = 0; index <= node_.n.children.length-1; index++) {
        let node = Object.create(node_);
        node.level += 1
        node.n = node.n.children[index];
        if (node.n.nodeHasMoved == undefined) node.n.nodeHasMoved = false;
        //-----------------------------
        // if (node.n.nodeHasMoved && isMouseUp){
        //     node.n.positionX = mouseUpX
        //     node.n.positionY = mouseUpY
        // }
        // else
         if (!node.n.nodeHasMoved){
            let cellWidth = canvas.width / (getNodesPerLevel(level));
            node.position.x = (cellWidth * indexOnLevel[level]) + cellWidth / 2
            node.position.y = y
            node.n.positionX = node.position.x
            node.n.positionY = node.position.y
        }
        //-----------------------------

        node.level = level
        draw(node, node.n.positionX, node.n.positionY, bigX, bigY)
        if (node.n.firstChild != null && node.n.firstChild.data != undefined) {
            texty(node, node.n.positionX, node.n.positionY)
        }
        AttrFeature(node, node.n.positionX, node.n.positionY)
        if (node.n.show == undefined)node.n.show = true
        minMaxFeature(node, node.n.positionX, node.n.positionY)
        allee.push(node)
        if (node.n.show == true)
            recursiveT(node, node.n.positionY + 100, node.n.positionX, node.n.positionY, node.level)
    }
}

///////////////////////////////
/////////   events   //////////
///////////////////////////////
function mouseClick (e) { 
    // console.log("mouseClick")
    e.stopPropagation()
    const XY = getXY(canvas, e)
    for (let nd of allee) {
        if (nd == undefined) return
        if (context.isPointInPath(nd.min_maxShape, XY.x, XY.y)) {
            nd.n.show = !nd.n.show

            context.clearRect(0, 0, canvas.width, canvas.height)
            indexOnLevel = new Array(100).fill(0)
            allee = []
            recursiveT(node, 100, 0, 0, -1)
            return
        }
        else if (context.isPointInPath(nd.attrShape, XY.x, XY.y)) {
            console.log(nd.attrShape)

            let attr = ""
            for (let i = 0; i < nd.n.attributes.length; i++) {
                attr += nd.n.attributes[i].name + ": \"" + nd.n.attributes[i].value + "\"\n";
            }
            if (attr == "")  alert("There is no attrubute for this Node ")
            else  alert(attr)
            return
        }
        else if (/*!isMoving && !isMouseUp && */(mouseDownX == XY.x && mouseDownY == XY.y) && context.isPointInPath(nd.shapePath, XY.x, XY.y)) {
            isNodeClicked=true
            var addedNode = prompt("Please enter The node you want to add", "");
            if (addedNode != null) {
                let n = document.createElement(addedNode);
                nd.n.appendChild(n)
                context.clearRect(0, 0, canvas.width, canvas.height)
                indexOnLevel = new Array(100).fill(0)
                allee = []
                recursiveT(node, 100, 0, 0, -1)
                isNodeClicked=false;
                return
            }
        }
    }
}

function loopThroughAllShapes(XY){
    for (let nd of allee) {
            if(context.isPointInPath(nd.shapePath, XY.x, XY.y)) { 
                return nd;
            }
    }
}
let hasEntered = false
function mouseMove (e) {
    console.log(8)
    e.preventDefault();
    e.stopPropagation();
    const XY = getXY(canvas, e)

    let nd = loopThroughAllShapes(XY)
    if (nd == undefined && !hasEntered) return
    // for (let g of allee) {
    if (hasEntered && nd == undefined){
            hasEntered = false;
            context.clearRect(0,0,canvas.width,canvas.height)
            indexOnLevel = new Array(20).fill(0)
            allee = []
            // level = 0
            recursiveT(node,100,0,0,-1)
            return
    }
    else if(!hasEntered && context.isPointInPath(nd.shapePath, XY.x, XY.y)) { 
    //    alert(nd.n.innerHTML)
        // timer = setTimeout(function () {
        hasEntered = true;
        context.fillStyle = "rgba(197 , 210 , 255 , 0.8)";
        var h =10;
        nd.n.innerHTML.split("\n").forEach((line) => {
                h += 18;
            });
        context.fillRect(XY.x, XY.y, 500, h);
        context.fill(); 
        // deal with empty txt: if(g.n.innerHTML == "")
        context.fillStyle = "black";
        var y = XY.y + 10;
        nd.n.innerHTML.split("\n").forEach((line) => {
        context.fillText(line, XY.x + 10, y);
            y += 18;
        });
        return;
    // }, 500);
    }
}

var moving = false;
function mouseDown(e){
    // console.log("mouseDown")
    const XY = getXY(canvas, e)
    let nd = loopThroughAllShapes(XY)
    if (nd == undefined)return
    else if(context.isPointInPath(nd.shapePath, XY.x, XY.y)) {
    // context.clearRect(0,0,canvas.width,canvas.height)
        // isMoving = false;
        moving=true
        nd.n.nodeHasMoved = true
        nd.n.positionX = XY.x
        nd.n.positionY = XY.y
        mouseDownX = XY.x
        mouseDownY = XY.y
        // context.clearRect(0,0,canvas.width,canvas.height)
        indexOnLevel = new Array(20).fill(0)
        allee = []
        recursiveT(node,100,0,0,-1)
        return
    }
}
function mouseUp(e){
    const XY = getXY(canvas, e)
    if (mouseDownX != XY.x || mouseDownY != XY.y){
    moving = false;
    isMouseUp = true;

    
    mouseUpX = XY.x
    mouseUpY = XY.y
    context.clearRect(0,0,canvas.width,canvas.height)
    indexOnLevel = new Array(20).fill(0)
    allee = []
    recursiveT(node,100,0,0,-1)
    mouseUpX = 0
    mouseUpY = 0
    isMouseUp = false
    return
}
}

canvas.addEventListener("click", mouseClick);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousedown", mouseDown);