import React from 'react';
import Producers from './Producers.js';
import Exchanges from './Exchanges.js';
import Queues from './Queues.js';
import Consumers from './Consumers.js';
import Links from './Links.js';
import Titles from './Titles.js'
import Legend from './Legend.js'
import * as d3 from 'd3';




const NetworkGraph =(props)=> {

    return (<svg width={props.width} height={props.height}>
      <Legend {...props} />
      {props.titles && <Titles {...props} />}
      {props.links && props.nodes && <Links {...props} setColors={setRateColor} />}
      {props.producers && <Producers className="node" {...props} setColors={setRateColor} />}
      {props.exchanges && <Exchanges popup={props.popup} popOff={props.popOff} className="node"{...props} setColors={setRateColor} />}
      {props.queues && <Queues className="node"{...props} setColors={setRateColor} />}
      {props.consumers && <Consumers className="node"{...props} setColors={setRateColor} />}
    </svg>)
  }

function setRateColor(rate){
  let lineColor = '';
  if (rate === 0) { lineColor = '#bdbdbd' } 
  else if (rate > 0 && rate <= 50) { lineColor = '#b9f6ca' }//'#b9f6ca' light green  
  else if (rate > 50 && rate <= 150) { lineColor = '#ffeb3b' } 
  else if (rate > 150 && rate <= 500) { lineColor = '#f9a825' } 
  else if (rate > 500 && rate <= 2000) { lineColor = '#ff5722' } 
  else if (rate > 2000) { lineColor = '#b71c1c' }
  return lineColor;
}

export default NetworkGraph;