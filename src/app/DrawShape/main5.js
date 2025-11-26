
//setTimeout(() => { alert("Delayed for 1 second."); }, 5000);

let canvas = new fabric.Canvas('canvas', {
    width: 900, // window.innerWidth,
    height: 500  // window.innerHeight
});

////// Add Angle
var degsymbole = '\xB0';
let addingAnglebtn = document.getElementById('btnAngle');
addingAnglebtn.addEventListener('click', createGroupAngle);
var Angleclick = 0;

function createGroupAngle() {
    Angleclick += 1;
    var line = new fabric.Line([100, 100, 200, 100], {
        id: 'angleline_' + Angleclick,
        stroke: 'black',
        strokeWidth: 2,
        cornerColor: 'green',
        cornerSize: 6,
        hoverCursor: 'pointer',
        selectable: true
    });
    var line2 = new fabric.Line([100, 200, 100, 100], {
        id: 'angleline2_' + Angleclick,
        stroke: 'black',
        strokeWidth: 2,
        cornerColor: 'green',
        cornerSize: 6,
        hoverCursor: 'pointer',
        selectable: false,
        //angle:90
    });

    var angle = new fabric.IText("90" + degsymbole, {
        id: 'angle_' + Angleclick,
        left: 105,
        top: 100,
        fontSize: 15,
        selectable: true,
        cornerColor: 'green',
        cornerSize: 2,
        transparentCorners: false,
        hasControls: false,
    });

    var linetxt = new fabric.IText("100", {
        id: 'anglelinetxt1_' + Angleclick,
        left: 150,
        top: 100,
        fontSize: 15,
        fill: "red",
        selectable: true,
        cornerColor: 'green',
        cornerSize: 2,
        transparentCorners: false,
        hasControls: false
    });

    var linetxt2 = new fabric.IText("100", {
        id: 'anglelinetxt2_' + Angleclick,
        left: 100,
        top: 150,
        fontSize: 15,
        fill: "red",
        selectable: true,
        cornerColor: 'green',
        cornerSize: 2,
        transparentCorners: false,
        hasControls: false,
        angle: 90,
    });

    let group = new fabric.Group([line, linetxt, angle, line2, linetxt2], {
        subTargetCheck: true,
        hasControls: false
    });


    group.on('mousedblclick', (e) => {
        if (e.subTargets[0].id.search("anglelinetxt1") >= 0) {
            let textForEditing = new fabric.IText(linetxt.text, {
                textAlign: linetxt.textAlign,
                fontSize: linetxt.fontSize,
                left: e.pointer.x, //group.left + (group.width / 2),
                top: e.pointer.y //group.top,
            })
            linetxt.visible = false;
            group.addWithUpdate();
            textForEditing.visible = true;
            textForEditing.hasConstrols = false;
            canvas.add(textForEditing);
            canvas.setActiveObject(textForEditing);
            textForEditing.enterEditing();
            textForEditing.selectAll();

            textForEditing.on('editing:exited', () => {
                let newVal = textForEditing.text;
                let oldVal = linetxt.text;
                if (newVal !== oldVal) {
                    linetxt.set({
                        text: newVal,
                        visible: true,
                    })
                    line.scaleToWidth(Number(newVal));
                    line.set('strokeUniform', true);
                    group.addWithUpdate();
                    textForEditing.visible = false;
                    canvas.remove(textForEditing);
                    canvas.setActiveObject(group);
                }
            })
            return;
        }

        if (e.subTargets[0].id.search("anglelinetxt2") >= 0) {
            let textForEditing = new fabric.IText(linetxt2.text, {
                textAlign: linetxt2.textAlign,
                fontSize: linetxt2.fontSize,
                left: e.pointer.x,
                top: e.pointer.y,
            })
            linetxt2.visible = false;
            group.addWithUpdate();
            textForEditing.visible = true;
            textForEditing.hasConstrols = false;
            canvas.add(textForEditing);
            canvas.setActiveObject(textForEditing);
            textForEditing.enterEditing();
            textForEditing.selectAll();

            textForEditing.on('editing:exited', () => {
                let newVal = textForEditing.text;
                let oldVal = linetxt2.text;
                if (newVal !== oldVal) {
                    linetxt2.set({
                        text: newVal,
                        visible: true,
                    })
                    //console.log(line2.aCoords)
                    line2.scaleToHeight(Number(newVal));
                    line2.set('strokeUniform', true);
                    group.addWithUpdate();
                    textForEditing.visible = false;
                    canvas.remove(textForEditing);
                    canvas.setActiveObject(group);
                    // console.log(line2.aCoords)
                }
            })
            return;
        }

        if (e.subTargets[0].id.search("angle") >= 0) {
            let textForEditing = new fabric.IText(angle.text, {
                textAlign: angle.textAlign,
                fontSize: angle.fontSize,
                left: e.pointer.x, // group.left,
                top: e.pointer.y // group.top,
            })
            angle.visible = false;
            group.addWithUpdate();
            textForEditing.visible = true;
            textForEditing.hasConstrols = false;
            canvas.add(textForEditing);
            canvas.setActiveObject(textForEditing);
            textForEditing.enterEditing();
            textForEditing.selectAll();

            textForEditing.on('editing:exited', (e) => {
                let newVal = Number(textForEditing.text) - 90;
                let oldVal = angle.text;
                let newvalues;
                if (newVal !== oldVal) {

                    angle.set({
                        text: textForEditing.text + degsymbole,
                        visible: true,
                    })
                    line2.set({
                        angle: Number(newVal),
                    })
                    linetxt2.set({
                        left: line2.left,
                        top: line2.top,
                        angle: Number(textForEditing.text),
                    })
                    group.addWithUpdate();
                    textForEditing.visible = false;
                    canvas.remove(textForEditing);
                    canvas.setActiveObject(group);
                }
            })
            return;
        }
    })

    canvas.add(group);

}


////// Add Vertical Line
let addingLinebtn = document.getElementById('btnVLine');
addingLinebtn.addEventListener('click', createGroupLine);
var lineclick = 0;

function createGroupLine() {
    lineclick += 1;
    var line = new fabric.Line([100, 100, 200, 100], {
        id: 'line_' + lineclick,
        stroke: 'black',
        strokeWidth: 2,
        cornerColor: 'green',
        cornerSize: 6,
        hoverCursor: 'pointer',
        selectable: true
    });

    var linetxt = new fabric.IText("100", {
        id: 'linetxt_' + lineclick,
        left: 150,
        top: 100,
        fontSize: 15,
        fill: "red",
        selectable: true,
        cornerColor: 'green',
        cornerSize: 2,
        transparentCorners: false,
        hasControls: false
    });


    let group = new fabric.Group([line, linetxt], {
        subTargetCheck: true,
        hasControls: false
    });


    group.on('mousedblclick', (e) => {
        if (e.subTargets[0].id.search("linetxt") >= 0) {
            let textForEditing = new fabric.IText(linetxt.text, {
                textAlign: linetxt.textAlign,
                fontSize: linetxt.fontSize,
                left: e.pointer.x, //group.left + (group.width / 2),
                top: e.pointer.y //group.top,
            })
            linetxt.visible = false;
            group.addWithUpdate();
            textForEditing.visible = true;
            textForEditing.hasConstrols = false;
            canvas.add(textForEditing);
            canvas.setActiveObject(textForEditing);
            textForEditing.enterEditing();
            textForEditing.selectAll();

            textForEditing.on('editing:exited', () => {
                let newVal = textForEditing.text;
                let oldVal = linetxt.text;
                if (newVal !== oldVal) {
                    linetxt.set({
                        text: newVal,
                        visible: true,
                    })
                    line.scaleToWidth(Number(newVal));
                    line.set('strokeUniform', true);
                    group.addWithUpdate();
                    textForEditing.visible = false;
                    canvas.remove(textForEditing);
                    canvas.setActiveObject(group);
                }
            })
            return;
        }


    })

    canvas.add(group);

}

////// Add Horizontal Line
let addingHLinebtn = document.getElementById('btnHLine');
addingHLinebtn.addEventListener('click', createGroupHLine);
var hlineclick = 0;

function createGroupHLine() {
    hlineclick += 1;
    var hline = new fabric.Line([100, 200, 100, 100], {
        id: 'hline_' + lineclick,
        stroke: 'black',
        strokeWidth: 2,
        cornerColor: 'green',
        cornerSize: 6,
        hoverCursor: 'pointer',
        selectable: false,
        hasControls: false
    });

    var hlinetxt = new fabric.IText("100", {
        id: 'hlinetxt_' + lineclick,
        left: 102,
        top: 100,
        fontSize: 15,
        fill: "red",
        selectable: false,
        cornerColor: 'green',
        cornerSize: 2,
        transparentCorners: false,
        hasControls: false
    });


    let group = new fabric.Group([hline, hlinetxt], {
        subTargetCheck: true,
        hasControls: false
    });


    group.on('mousedblclick', (e) => {
        if (e.subTargets[0].id.search("hlinetxt") >= 0) {
            let textForEditing = new fabric.IText(hlinetxt.text, {
                textAlign: hlinetxt.textAlign,
                fontSize: hlinetxt.fontSize,
                left: e.pointer.x, //group.left + (group.width / 2),
                top: e.pointer.y //group.top,
            })
            hlinetxt.visible = false;
            group.addWithUpdate();
            textForEditing.visible = true;
            textForEditing.hasConstrols = false;
            canvas.add(textForEditing);
            canvas.setActiveObject(textForEditing);
            textForEditing.enterEditing();
            textForEditing.selectAll();

            textForEditing.on('editing:exited', () => {
                let newVal = textForEditing.text;
                let oldVal = hlinetxt.text;
                if (newVal !== oldVal) {
                    hlinetxt.set({
                        text: newVal,
                        visible: true,
                    })
                    hline.scaleToHeight(Number(newVal));
                    hline.set('strokeUniform', true);
                    group.addWithUpdate();
                    textForEditing.visible = false;
                    canvas.remove(textForEditing);
                    canvas.setActiveObject(group);
                }
            })
            return;
        }
    })

    canvas.add(group);
}

////// Add Arc
let addingArcbtn = document.getElementById('btnArc');
addingArcbtn.addEventListener('click', createGroupAre);
var Arcclick = 0;

function createGroupAre() {
    Arcclick += 1;
    var circle = new fabric.Circle({
        id: "arc_" + Arcclick,
        left: 150,
        top: 100,
        radius: 50,
        fill: "",
        stroke: "black",
        strokeWidth: 2,
        //angle: 45,
        startAngle: 90,
        endAngle: 270,
    });

    var linetxt = new fabric.IText("50", {
        id: 'arclinetxt_' + Arcclick,
        left: 160,
        top: 140,
        fontSize: 15,
        fill: "red",
        selectable: true,
        cornerColor: 'green',
        cornerSize: 2,
        transparentCorners: false,
        hasControls: false
    });


    let group = new fabric.Group([circle, linetxt], {
        subTargetCheck: true,
        hasControls: true
    });


    group.on('mousedblclick', (e) => {
        if (e.subTargets[0].id.search("arclinetxt") >= 0) {
            let textForEditing = new fabric.IText(linetxt.text, {
                textAlign: linetxt.textAlign,
                fontSize: linetxt.fontSize,
                left: e.pointer.x, //group.left + (group.width / 2),
                top: e.pointer.y //group.top,
            })
            linetxt.visible = false;
            group.addWithUpdate();
            textForEditing.visible = true;
            textForEditing.hasConstrols = false;
            canvas.add(textForEditing);
            canvas.setActiveObject(textForEditing);
            textForEditing.enterEditing();
            textForEditing.selectAll();

            textForEditing.on('editing:exited', () => {
                let newVal = textForEditing.text;
                let oldVal = linetxt.text;
                if (newVal !== oldVal) {
                    circle.set({
                        radius: Number(newVal)
                    })
                    //console.log(circle);
                    linetxt.set({
                        text: newVal,
                        visible: true,
                        // top:  circle.oCoords.mb.y - circle.oCoords.mb.x , //- circle.oCoords.mt.y, //+ (group.width / 2),
                        // left: circle.oCoords.mt.y - circle.oCoords.mb.y,//- circle.oCoords.mb.y,
                    })

                    group.addWithUpdate();
                    textForEditing.visible = false;
                    canvas.remove(textForEditing);
                    canvas.setActiveObject(group);
                }
            })
            return;
        }
    })

    canvas.add(group);

}



////// Add Text
let addingTextbtn = document.getElementById('btnText');
addingTextbtn.addEventListener('click', createGroupText);
var txtclick = 0;

function createGroupText() {
    txtclick += 1;

    var txt = new fabric.IText("100", {
        id: 'txt_' + txtclick,
        left: 100,
        top: 100,
        fontSize: 15,
        fill: "red",
        selectable: true,
        cornerColor: 'green',
        cornerSize: 2,
        transparentCorners: false,
        hasControls: false
    });

    canvas.add(txt);

}

////// Add Delete
let deletegrp = document.getElementById('btnDelete');
deletegrp.addEventListener('click', DeleteGroup);

function DeleteGroup() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        //if (confirm('Are you sure?')) {
        canvas.remove(activeObject);
        //}
    }
}


function clearall() {
    canvas.clear();
}

function save_filename() {
    var link = document.createElement("a");
 var rr =  prompt("Enter Name for Save.");
    
    link.download = rr+'.png';
    link.href = canvas.toDataURL("image/png");

    document.body.appendChild(link);
    link.click();
  
}