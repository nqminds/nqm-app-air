/*
https://github.com/Leaflet/Leaflet.markercluster
https://github.com/troutowicz/geoshare/blob/7f0c45d433a0d52d78e02da9a12b0d2156fcbedc/test/app/components/MarkerCluster.jsx
http://leaflet.github.io/Leaflet.markercluster/example/marker-clustering-realworld.388.html
https://github.com/Leaflet/Leaflet.markercluster#usage
*/

import React from "react";
import ReactDOM from 'react-dom';
import Paper from 'material-ui/Paper';
import Control from 'react-leaflet-control';
import { Map, TileLayer, Marker, Popup, LayerGroup, ZoomControl } from 'react-leaflet';
import MarkerCluster from "./markercluster"
import Chart from "./chart";

const defaultData = [{ lat: 52.008778, lon: -0.771088}];

class Livemap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            centerPosition: L.latLng(defaultData[0], defaultData[1])
        };
    }

    componentWillMount() {
        let bounds = L.latLngBounds(_.map(this.props.metaData, (val, key)=>{
            return L.latLng(val.Latitude, val.Longitude);
        }));

        this.setState({
            centerPosition: bounds.getCenter()
        });
    }

    componentWillReceiveProps(nextProps) {
    }
    
    render() {
        let self = this;
        let markerComponent = null;

        const style = {
            height: 100,
            width: 100,
            margin: 20,
            textAlign: 'center',
            display: 'inline-block',
        };

        if (!_.isEmpty(self.props.metaData)) {
            markerComponent =
                <MarkerCluster
                    metaData={self.props.metaData}
                    realTimeData={self.props.realTimeData}
                    onClickMarker={self.props.onClickMarker}
                />
        }


        return (
            <Map
                center={this.state.centerPosition}
                zoom={11}
                scrollWheelZoom={false}
                touchZoom={false}
                maxBounds={null}
                dragging={true}
                zoomControl={false}
            >
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {markerComponent}
                <ZoomControl position='bottomright' />
                <Control position="topright" >
                    <div className="chartinfo">
                        <Chart data={[]} type={"Line"} barcount={3}/>
                        <Chart data={[]} type={"Bar"} barcount={3}/>
                    </div>
                </Control>
            </Map>);
    }
}

Livemap.propTypes = {
    metaData: React.PropTypes.object.isRequired,
    realTimeData: React.PropTypes.array.isRequired,
    onClickMarker: React.PropTypes.func.isRequired,
};

export default Livemap;
