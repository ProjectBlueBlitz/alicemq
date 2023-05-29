import React from 'react';
import Typography from '@material-ui/core/Typography';

const Toggle = (props) => {

  if (props.ex){
    return (
    <li><form><label><input type="checkbox" id={props.content == "" ? 'default' : props.content } onChange={props.mute}/><span>{props.content === "" ? 'default' : props.content}</span></label></form></li>
    )
  }
  
  else return (
   <Typography color="inherit"><li>{props.content}</li></Typography>
  )
}

export default Toggle;