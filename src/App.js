import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import MindElixir, { E } from "mind-elixir";
//import {writeJsonFile} from 'write-json-file';
import painter from 'mind-elixir/dist/painter';

var a = '';
var mindtemp = null;

function App() {

  const [update, setUpdate] = useState();

  let options = {
    el: "#map",
    direction: MindElixir.LEFT,
    data: MindElixir.new("new topic"),
    draggable: true, // default true
    contextMenu: true, // default true
    toolBar: true, // default true
    nodeMenu: true, // default true
    keypress: true // default true
  }

  //let mind = new MindElixir(options);

  useEffect(() => {

    let mind = new MindElixir(options);

    //setMind(mind);
    mind.init();

    mind.getAllDataString();

    // get a node
    //console.log(mind.getAllDataMd());
    //dataUpdate(mind.getAllData());

    mind.bus.addListener('operation', operation => {

      //console.log(mind.getAllDataString());
      a = mind.getAllDataString();

      //painter.exportPng(mind,'picture')

      mindtemp = mind;
      
      // return {
      //   name: action name,
      //   obj: target object
      // }

      // name: [insertSibling|addChild|removeNode|beginEdit|finishEdit]
      // obj: target

      // name: moveNode
      // obj: {from:target1,to:target2}

    })
  });

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      a
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  const paint = () => {
    //console.log(mind.getAllDataMd());
    console.log(a);
    painter.exportPng(mindtemp,'picture');
    //const fs = require('fs');

  }

  return (
  <>
    <div id="map" style={{ height: "500px", width: "100%" }} />
    <button onClick={paint}>Save as Image</button>
    <button onClick={exportData}>Save as JSON</button>
  </>
  );
}

export default App;
