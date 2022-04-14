import './App.css';
import React, { useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import MindElixir, { E } from "mind-elixir";
//import {writeJsonFile} from 'write-json-file';
import painter from 'mind-elixir/dist/painter';
import PptxGenJS from "pptxgenjs";

import data from './datatemp1.json';

//const pptx = new PptxGenJS();

var mindstring = '';

var mindhistory = [];
var mindhistoryIndex = [];

var mindundo = [];

let datajson = '';

function App() {

  //const [update, setUpdate] = useState();

  let options = {
    el: "#map",
    direction: MindElixir.LEFT,
    //data: data,
    data: MindElixir.new("new topic"),
    draggable: true,
    contextMenu: true,
    toolBar: true,
    nodeMenu: true,
    keypress: true,
    allowUndo: true,
    contextMenuOption: {
      focus: true,
      link: true,
      extend: [
        {
          name: 'Node edit',
          onclick: () => {
            
          },
        },
      ],
    },
  }

  //let mind = new MindElixir(options);
  let mind = null;

  useEffect(() => {

    mind = new MindElixir(options);

    //setMind(mind);
    //mind.init();

    mind.initSide();

    mind.getAllDataString();

    // get a node
    //console.log(mind.getAllDataMd());
    //dataUpdate(mind.getAllData());

    mind.bus.addListener('operation', operation => {

      //console.log(mind.getAllDataString());
      console.log(operation);
      mindstring = mind.getAllData();

    })
    mind.bus.addListener('selectNode', node => {
      //console.log(node)
    })

    mind.bus.addListener('expandNode', node => {
      //console.log('expandNode: ', node)
    })
  },[]);



  const exportData = () => {
    mindstring = mind.getAllData();
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(mindstring)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  const paint = () => {
    //console.log(mind.getAllDataMd());
    painter.exportPng(mind,'picture');
    //const fs = require('fs');

  }

  const importData = (datajson) => {

    var obj = JSON.parse(datajson);

    let optionsdata = {
      el: "#map",
      direction: MindElixir.LEFT,
      data: obj,
      //data: MindElixir.new("new topic"),
      draggable: true,
      contextMenu: true,
      toolBar: true,
      nodeMenu: true,
      keypress: true, //true 
      allowUndo: true, //ทำ undo, redo manual เอง
      contextMenuOption: {
        focus: true,
        link: true,
        extend: [
          {
            name: 'Undo',
            onclick: () => {
              
            },
          },
        ],
      },
    }

    console.log(data.nodeData.id);

    mind = new MindElixir(optionsdata);

    mind.initSide();

    mind.getAllDataString();

    mindstring = mind.getAllData();

    mind.bus.addListener('operation', operation => {

      //console.log(operation);
      mindstring = mind.getAllData();

      console.log(mindstring);

      //mindhistory.push(operation);
      //mindhistory = mind.history
      console.log(mind.history);

    })
    mind.bus.addListener('selectNode', node => {
      //console.log(node)
    })

    mind.bus.addListener('expandNode', node => {
      //console.log('expandNode: ', node)
    })
  }

  const undo = () => {

    if (mindhistory.length === 0 ){
      return 'No undo left';
    }

    mindhistoryIndex = mindhistory.length-3;
    //var mind1 = mindhistory[mindhistoryIndex];
    //console.log(JSON.stringify(mind1))
    //console.log((mind1))
    
    var undoOperation = mind.history.pop();
    //if (!operation) return
    //console.log(mindhistory);
    console.log(undoOperation);
    //mindundo.push(undoOperation);
    //console.log(mindundo)

    if (undoOperation.name === 'finishEdit'){
      //var idTemp = undoOperation.obj.id
      //var originName = undoOperation.origin
      //console.log(idTemp);
      //console.log(originName)
      mind.setNodeTopic(E(undoOperation.obj.id), undoOperation.origin)
      //console.log(mind)

    }

  }

  const redo = () => {
    
    var redoOperation = mindundo.pop();
    mindhistory.push(redoOperation);
    console.log(redoOperation);
    mind.setNodeTopic(E(redoOperation.obj.id), redoOperation.obj.topic)

  }

  const recursive = (obj,pptx) => {
    //var mindObj = mind.getAllData()
    //console.log(obj.topic);


    if (!('children' in obj) || obj.children.length === 0){

      //slide.addText(obj.topic, { x: 10, y: 10, w: 10, fontSize: 36, fill: { color: "F1F1F1" }, align: "center" })

      return;

    } else {

      let slide = pptx.addSlide();
      
      slide.addText(obj.topic, {x:0.5, h: 1, w: "90%", fontSize: 24, align: "center", bold:true })

      //ถ้า children length > 8
      //
      var childrentext = []
      for (var i = 0 ; i < obj.children.length ; i++){

        //slide.addText(obj.children[i].topic+(i+1)/2, { x: 0.5, y: (i+1)/2, h: 1, w: 9, fontSize: 14, align: "left" ,bullet: true})

        childrentext.push({ text: obj.children[i].topic, options: { fontSize: 14, align: "left", bullet: true, breakLine: true } })
      }

      slide.addText(childrentext, { x: 0.5, y: 1, w: "90%", h: 2 });

      for (var j = 0 ; j < obj.children.length ; j++){
        //console.log(obj.children[j]);
        recursive(obj.children[j],pptx);
      }

    }
  }

  const onExport = () => {
    var pptx = new PptxGenJS();
    var mindObj = mind.getAllData();
    //console.log(mindObj.nodeData);
    recursive(mindObj.nodeData,pptx);

    

    //let slide = pptx.addSlide();
    //slide.addText("React Demo!");

    pptx.writeFile({ fileName: "mindmap.pptx" });
  };

  const readJSON = (e) => {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        console.log("e.target.result", e.target.result);
        datajson = e.target.result;
        importData(datajson);
      };
    };

  return (
  <>
    <div id="map" style={{ height: "500px", width: "100%" }} />
    <button onClick={paint}>Save as Image</button>
    <button onClick={exportData}>Save as JSON</button>
    <input type="file" onChange={readJSON} />
    <button onClick={onExport}>To Powerpoint</button>
  </>
  );
}

export default App;