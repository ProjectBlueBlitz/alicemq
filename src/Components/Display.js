import React, { Component } from 'react';
import Canvas from './NetworkD3/Canvas.js'
import NetworkGraph from './NetworkD3/NetworkGraph.js'

const Display = (props) => {
  
  return (
    <div className="viz"> 
      <NetworkGraph {...props}/>
    </div>
  )
}

export default Display
