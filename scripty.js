let canvas = document.querySelector("canvas")
let context = canvas.getContext("2d");
// let root = document.getRootNode();
let root = document.getElementById("root");

let button = document.querySelector("#button")
button.addEventListener("click", () => { 
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    window.location.href=image; // it will save locally
})



// let x;
let y = 0;
let clickedX;
let clickedY;

let indexOnLevel = new Array(100).fill(0)
let level = 0


function getNodesPerLevel(row){
    return row<=0?1:_getNodesPerLevel(document, row)
}
function _getNodesPerLevel(e, row){
    if (row == 0)
        if("children" in e)
            return e.children.length;
        else 
            return 0;
    else if(! ("children" in e))
        return 0;
    var total = 0
    for (let i = 0; i < e.children.length; i++)
        total+= _getNodesPerLevel(e.children[i], row -1)
    return total;
}

function draw(param,x,y,bigX,bigY) {
        // param.show = true;
        HighlightFeature(param,x,y)// draw node
        context.beginPath(); 
        if(!param.isRoot){
            context.moveTo(x,y-31)
            context.lineTo(bigX,bigY+30)}
        context.strokeStyle = "#72CBE3"
        context.fill()
        context.stroke();

}

function recursiveT(node_ ,y ,  bigX, bigY, level){
    indexOnLevel[level] +=1;  
    level++;
    if(level==1) {
        node_.isRoot = true;
        draw(node_ , canvas.width/2,30,0 , 0)
        AttrFeature(node_,canvas.width/2,30)
        minMaxFeature(node_,canvas.width/2,30)
        bigX = canvas.width/2
        bigY = 30
        y+=30;
    }
    if(level==0) {
        draw(node_ , canvas.width/2,30,canvas.width/2 , 0)
        bigX = canvas.width/2
        bigY = 30
    }

    for (let index = 0; index < node_.children.length; index++) {

        var element = node_.children[index];
        let cellWidth =canvas.width/(getNodesPerLevel(level)); 
        let x = ( cellWidth * indexOnLevel[level] ) + cellWidth/2

        draw(element , x,y, bigX, bigY)
        if (element.firstChild != null && element.firstChild.data != undefined ){
           texty(element, x, y)
       }
        AttrFeature(element,x,y)
        minMaxFeature(element,x,y)
        if((element.x+20> clickedX && element.x -20 <clickedX) && (element.y+10> clickedY && element.y -10 <clickedY)){
            console.log(element.show)
        if (element.show == false )
            element.show = true
        else 
        element.show = false
        }
        // if( element.show==undefined )
        // element.show = true
        if(element.show==true || element.show == undefined)
            recursiveT(element, y+100, x, y, level)
        // }
    }
}

function minMaxFeature(element,x,y){
    if (element.hasChildNodes()) {
    
    const min_max_node = new Path2D();
    min_max_node.rect(x-48,y-18,10,10);
    element.x = x-48;
    element.y = y-18;
    context.fillStyle = "white";
    context.fill(min_max_node);
    context.stroke(min_max_node);
    context.font="14px Georgia";
    context.fillStyle="black";
    context.fillText("+", x-48,y-10);
    // element.show;
    // if( element.show==undefined )
    // element.show = true
    document.addEventListener("click", function (e) {    //i tried  `ontoggle`
        const XY = getXY(canvas, e)
        if(context.isPointInPath(min_max_node, XY.x, XY.y)) {
        //    if( element.show==undefined || element.show==false)
        //         element.show = true
        //     else
        clickedX = XY.x;
        clickedY = XY.y;
            // element.show = !element.show
            context.clearRect(0,0,canvas.width,canvas.height)
            x = 0;
            y = 0;
            indexOnLevel = new Array(20).fill(0)
            level = 0
            recursiveT(root,100,0,0,0)
        }
      }, false)}
    // return element
}
function AttrFeature(element,x,y){
    const path = new Path2D()
    path.rect(x-55,y,20,10) 
    context.fillStyle = "#ffffff"
    context.fill(path)
    context.stroke(path)
    context.font="12px Georgia"
    context.fillStyle = "#000000"; 
    context.fillText("...", x-50, y+5,30)

    document.addEventListener("click",  function (e) {
        const XY = getXY(canvas, e)
        if(context.isPointInPath(path, XY.x, XY.y)) {
            let attr =""
            for (let i =0; i< element.attributes.length;i++){                    
                attr += element.attributes[i].name+": \""+element.attributes[i].value +"\"\n";
        }
        if (attr == "")
            alert("There is no attrubute for this Node ")
        else
          alert(attr)
        }
      }, false)
}

function HighlightFeature(element,x,y){
    const path3 = new Path2D()
    // const path33 = new Path2D()
    path3.arc(x, y, 30, 0,Math.PI *2,false)
    context.font="12px Georgia"
    context.fillStyle = "#000000"; 
    context.fillText(element.nodeName, x-20, y);
    context.fillStyle = "#3d32";
    context.strokeStyle = "#757599"
    context.fill(path3)
    context.stroke(path3)

//    document.addEventListener("mousemove"
//    ,  function (e) {
//        const XY = getXY(canvas, e)
//         if(context.isPointInPath(path3, XY.x, XY.y)) {
//            alert(element.innerHTML)
//        }
//       }, false)
//
    document.addEventListener("click",function (e) {
        const XY = getXY(canvas, e)
        if(context.isPointInPath(path3, XY.x, XY.y)) {
            var addedNode = prompt("Please enter The node you want to add", "div");
            if (addedNode != null) {
                let selected = document.querySelector(element.nodeName)
                let node = document.createElement(addedNode);
                
                selected.appendChild(node)
                // alert(selected.nodeName)
                context.clearRect(0,0,canvas.width,canvas.height)
                x = 0;
                y = 0;
                indexOnLevel = new Array(20).fill(0)
                level = 0
                recursiveT(root,100,0,0,0)
            }
        }
    }, false)
}
//---------------------------------------------
function getXY(canvas, event){ //shape 
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top //mouse event
    const x = event.clientX - rect.left 
    return {x:x, y:y}
  }
//---------------------------------------

function texty(param,x,y){
    const para1 = param;
    if (param.firstChild != null && param.firstChild.data.trim() != "" ){
    context.beginPath();
    context.strokeStyle = "lightblue"; 
    context.fillStyle = "#9CB0FF"; 
    context.lineWidth = 3;
    context.fillRect(x-35,y+40,50,30); 
    context.strokeRect(x-35,y+40,50,30);
    context.fillStyle = "#000000"; 
    if (para1.textContent.length >5){
        context.fillText(para1.textContent.substring(0,7)+"...", x-35, y+55,50);
    }
    else{
        // context.textAlign = ""
        context.fillText(para1.textContent, x-35, y+55,70);}
    context.stroke();

    context.beginPath();
    context.moveTo(x-15,y+40)
    context.lineTo(x,y+30)
    context.strokeStyle = "#72CBE3"
    context.fill()
    context.stroke();
    }
}
recursiveT(root,y+100,0,0,0)
// requestAnimationFrame(recursiveT)