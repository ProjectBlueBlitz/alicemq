import React, { Component } from 'react';
import Settings1 from '../Components/Settings1.js'
import Display from '../Components/Display.js'
import FrontPage from '../Components/FrontPage.js'
import SignOut from '../Components/SignOut.js'
import Spinner from '../Components/Spinner.js'
import OverviewCards from '../Components/OverviewCards.js'
// import "@babel/polyfill";
import BlueBottle from '../../server/blueBottle.js';
import NodeCards from '../Components/NodeCards.js';
import Typography from '@material-ui/core/Typography';

// d3Data reference
// "cluster_name": cluster_name,
// "nodes": [],
// "links": [],
// "identifiers": [{binding: exchange}],
// "producers": producers.length,
// "exchanges": exchanges.length,
// "queues": queues.length,
// "consumers": consumers.length

function makeTitles(d3Data) {
  const titles = [];
  const nameTitles = ['Producers', 'Exchanges', 'Queues', 'Consumers']

  for (let i = 0; i < nameTitles.length; i++)
    titles.push({
      name: nameTitles[i],
      y: (d3Data.height / 4) * (i + 1) - (d3Data.height * 0.1) - 40,
      x: 25
    });

  return titles;
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hostname: "",
      username: "",
      password: "",
      // hostname: "192.168.0.236",
      // username: "test",
      // password: "test",

      // hostname: "192.168.0.35",
      // username: "vhs",
      // password: "4444",
      d3Data: {},
      width: (window.innerWidth),
      height: (parent.innerHeight),
      padding: 10,
      nodecards: [],
      visualizer: false,
      loggedIn: false,
      toggled: {},
      nodes: [],
      links: [],
      pause: false,
      trafficMode: false,
      errorHostname: '',
      errorUsername: '',
      errorPassword: '',
      errorConnection: '',
    }

    this.blueBottle = null;
    this.baseState = this.state;
    // this.initializeState = this.initializeState.bind(this)
    this.updateHostname = this.updateHostname.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.visualize = this.visualize.bind(this);
    this.updateNodeCards = this.updateNodeCards.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.configureInstance = this.configureInstance.bind(this);
    this.toggleStartStop = this.toggleStartStop.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
    this.validateHostname = this.validateHostname.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  async update() {
    if (this.blueBottle === null) return;
    try{
      const d3Data = await this.blueBottle.getData();
      this.setState({visualizer: true});

      d3Data.nodes.forEach((x)=>{
        if (this.state.toggled[x.identifier]){
          x.visibility = false
        } else {x.visibility = true}
      })
      const dataTitles = makeTitles(d3Data);
      this.setState({ ...d3Data, titles: dataTitles });
    }
    catch(e){
      const error = e.message.replace(/^TypeError: /, '');
      this.setState({ errorConnection: error, loggedIn: false, pause: true });
    }
  }

  componentDidMount() {
    document.body.classList.add('background')

    this.timer = setInterval(() => {
      if (this.state.pause) return;

      this.update()
    }, 5 * 1000) // 5 seconds
  }
  componentWillUnmount() {
    this.blueBottle = null;
    clearInterval(this.timer);
  }

  updateHostname(e) {
    this.setState({ hostname: e.target.value });
  };
  updateUsername(e) {
    this.setState({ username: e.target.value });
  };
  updatePassword(e) {
    this.setState({ password: e.target.value });
  };

  initializeState() {
    return { hostname: "",
    username: "",
    password: "",
    // hostname: "192.168.0.35",
    // username: "vhs",
    // password: "4444",
    d3Data: {},
    width: (window.innerWidth),
    height: (parent.innerHeight),
    padding: 10,
    nodecards: [],
    visualizer: false,
    toggled: {},
    nodes: [], 
    links: [],
    pause: true
  }
}
  toggleVisibility(e) {
    let nodes = this.state.nodes;
    let newToggled = this.state.toggled;
     nodes.forEach((x)=>{
      if (x.identifier === e.target.id && x.group === 2){
        newToggled[x.identifier] = !newToggled[x.identifier];
      }
    })
    this.setState({ toggled: Object.assign(newToggled) })
  }

  toggleStartStop(e){
    this.setState({pause: !this.state.pause});
  }
  toggleMode(e){
    this.setState({trafficMode: !this.state.trafficMode});
  }
  configureInstance(e){
    // this.setState(this.initializeState());
    this.setState(this.baseState);
    this.setState({pause: true});
  }

  visualize(e) {
    if(!this.validateAll()) return;

    const userConfig = {
      host: this.state.hostname,
      username: this.state.username,
      password: this.state.password
    };

    this.blueBottle = new BlueBottle(userConfig);
    this.setState({ pause: false, loggedIn: true });
  }

  validateAll(){
    if(this.state.errorHostname !== '') return false; 
    if(this.state.errorUsername !== '') return false;
    if(this.state.errorPassword !== '') return false; 

    return true;
  }

  validateHostname(e){
    if(e.target.value){
      this.setState({errorHostname: ''});
      return;
    }
    this.setState({errorHostname: 'Invalid IP Adress'});
  }

  validateUsername(e){
    if(e.target.value){
      this.setState({errorUsername: ''});
      return;
    }
    this.setState({errorUsername: 'Invalid Username'});
  }

  validatePassword(e){
    if(e.target.value){
      this.setState({errorPassword: ''});
      return;
    }
    this.setState({errorPassword: 'Invalid Password'});
  }

  updateNodeCards(node) {
    switch (node.group) {
      case 1: {
        return this.setState({
          nodecards: [
            { "Type": "Producer" },
            { "Total Published": node.message_stats.publish },
            { "Publishes/s": node.message_stats.publish_details.rate },
            { "state": node.state }
          ]
        })
      }
      case 2: {
        return this.setState({
          nodecards: [
            { "Type": node.type },
            { "Publishes/s": node.message_stats.publish_in_details.rate },
            { "Messages Sent": node.message_stats.publish_out },
            { "Sent/s": node.message_stats.publish_out_details.rate },
          ]
        })
      }
      case 3: {
        return this.setState({
          nodecards: [
            { "Total Received": node.message_stats.publish },
            { "Recieved/s": node.message_stats.publish_details.rate },
            { "Total Sent": node.message_stats.deliver_get === undefined ? '0': node.message_stats.deliver_get},
            { "Sent/s": node.message_stats.deliver_get_details === undefined ? '0': node.message_stats.deliver_get_details.rate},
          ]
        })
      }
      case 4: {
        return this.setState({
          nodecards: [
            { "Type": "Consumer" },
            { "Total Received": node.message_stats.deliver_get },
            { "Delivery Rate": node.message_stats.deliver_get_details.rate },
            { "state": node.state }
          ]
        })
      }
      default: return;
    }
  }

  render() {
    if (!this.state.visualizer && !this.state.loggedIn) {
      return (
          <FrontPage className="container"
            updateHostname={this.updateHostname}
            updateUsername={this.updateUsername}
            updatePassword={this.updatePassword}
            visualize={this.visualize}
            validateHostname={this.validateHostname}
            validateUsername={this.validateUsername}
            validatePassword={this.validatePassword}
            {...this.state}
          />)
    } 
    else if(!this.state.visualizer && this.state.loggedIn) {
      return(<Spinner />);
    }
    else {
      document.body.classList.add('background-vis')
      return (
        <div className="grid-reloaded">
          <SignOut {...this.state} configureInstance={this.configureInstance} toggleStartStop={this.toggleStartStop} toggleMode={this.toggleMode} />
          <div className="instance">
            <span>Instance: <strong>{this.state.cluster_name}</strong><br />
            ip: <strong>{this.state.hostname}</strong></span>
          </div>
          <Display {...this.state} updateNodeCards={this.updateNodeCards} />
          {this.state.message_stats && <OverviewCards {...this.state} />}
          <NodeCards {...this.state} />
          <Settings1 {...this.state} mute={this.toggleVisibility} />
        </div>
      )
    }
  }
}

export default Main
