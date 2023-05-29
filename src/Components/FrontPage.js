import React from 'react';
import Button from './Button.js'
import Typography from '@material-ui/core/Typography'
import {TextField} from '@material-ui/core'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import ErrorMessage from './ErrorMessage.js'

const purpleTheme = createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#6200EE',
    },
    secondary: {
      main: '#e1e1dd',
    },
    error: {
      main: '#aa0000',
    }
  },
  spacing: 10
})


function FrontPage(props) {
  document.body.classList.remove('background-vis');

  return (
    <MuiThemeProvider theme={purpleTheme}>
    <div className='login-box'>
      <Typography variant='h4' color="primary">AliceMQ</Typography>
      <TextField
        id='host'
        label='Host'
        variant='outlined'
        type='text'
        name='host'
        placeholder='RabbitMQ Hostname'
        onChange={ props.updateHostname }
        onBlur={ props.validateHostname }
        margin='dense'
        required={true}
        autoFocus={true}
        error={props.errorHostname ? true : false}
      />
      <TextField
        id='username'
        type='text'
        name='username'
        placeholder='Username'
        onChange={ props.updateUsername }
        onBlur={ props.validateUsername }
        label='Username'
        variant='outlined'
        margin="dense"
        required={true}
        error={props.errorUsername ? true : false}
      />
      <TextField
        id='password'
        type='password'
        name='password'
        placeholder='Password'
        variant='outlined'
        label='Password'
        onChange={ props.updatePassword }
        onBlur={ props.validatePassword }
        margin="dense"
        required={true}
        error={props.errorPassword ? true : false}
      />
    </div>
    <div id='frontPage'>
      <Button visualize={ props.visualize }>
        Visualize
      </Button>
    </div>
    <div id='errorMessage'>
      <ErrorMessage msg={props.errorConnection} /> 
    </div>
    </MuiThemeProvider>)
}


export default FrontPage;