"use strict";

import React from "react";
import ReactDOM from 'react-dom';
import {Meteor} from "meteor/meteor";
import { blue900, blue100 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import 'leaflet';
import 'leaflet.markercluster';
import * as _ from "lodash";
import TDXAPI from "nqm-api-tdx/client-api";

import Livemap from "../components/livemap"
import ChartContainer from "./chart-container"
import connectionManager from "../../api/manager/connection-manager";

class AirApp extends React.Component {
  constructor(props) {
    super(props);

    this.tdxApi = new TDXAPI({
      commandHost: Meteor.settings.public.commandHost,
      queryHost: Meteor.settings.public.queryHost,
      accessToken: connectionManager.authToken
    });

    
    let date = new Date();
    
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    const currentMarker = {LotCode:0};
    this.state = {
      currentMarker:currentMarker,
      snackBarMessage:"",
      snackBarOpen: false,      
      filterDate: date,
      parkingMetadata: {},
      chartType: "Line"
    };
  }

  _onClickMarker(id) {
  
  }

  handleSnackbarClose() {
    this.setState({
      snackBarOpen: false
    });
  };
  
  componentWillMount() {
    let parkingMetadata = {};

    this.tdxApi.getDatasetData(Meteor.settings.public.parkingMetadata, null, null, null, (err, data)=>{
      if (err) {
        this.setState({
          snackBarOpen: true,
          snackBarMessage: "No parking metadata available!"
        });  
      } else {
        if (!data.data.length){
          this.setState({
            snackBarOpen: true,
            snackBarMessage: "No parking metadata available!"
          });          
        } else {
          let minMarker = _.minBy(data.data,(val)=>{return val.LotCode});

          _.forEach(data.data, (val)=>{
            parkingMetadata[val.LotCode] = val;
          });

          this.setState({
            'currentMarker':minMarker,
            'parkingMetadata': parkingMetadata
          });
        }
      }
    });
  }

  componentDidMount() {
    let currentLiveFeed = {};

    this.tdxApi.getDatasetData(Meteor.settings.public.liveFeedSubscribtion, null, null, null, (err, data)=>{
      if(err) {
        this.setState({
          snackBarOpen: true,
          snackBarMessage: "Can't retrieve the live feed data!"
        });
      } else {
          _.forEach(data.data, (val)=>{
            currentLiveFeed[val.ID] = val.state;
          });

          this.setState({ liveFeed: currentLiveFeed });
      }
    });
  }

  render() {
    const gte = this.state.filterDate.getTime();
    const lte = gte + 24*60*60*1000;
    
    const chartOptions = { sort: { timestamp: 1 }};
    const chartFilter = {ID: {$eq: this.state.currentMarker.LotCode}, "$and":[{"timestamp":{"$gte":gte}},{"timestamp":{"$lte":lte}}]};
    let cPos = L.latLng(52.008778, -0.771088);

    const appBarHeight = Meteor.settings.public.showAppBar !== false ? 50 : 0;
    const styles = {
      root: {
        height: "100%"
      },
      mainPanel: {
        position: "absolute",        
        top: appBarHeight,
        bottom: 0,
        left: 0,
        right: 0
      }
    };

    return (
      <div style={styles.mainPanel}>
        <Livemap
          parkingMetadata={this.state.parkingMetadata}
          realTimeData={this.props.data}
          onClickMarker={this._onClickMarker.bind(this)}
          centerPosition={cPos}
        />
        <Snackbar
          open={this.state.snackBarOpen}
          message={this.state.snackBarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose.bind(this)}
        />
      </div>
    );
  }
}

AirApp.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default AirApp;
