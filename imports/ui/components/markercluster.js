import React from 'react';
import { MapLayer } from 'react-leaflet';
import './leaflet-text-icon.js';

class MarkerCluster extends MapLayer {
    constructor(props) {
        super(props);

        this._markers = {};    
    }

    componentWillMount() {
        let markers = [];
        let self = this;
        this.leafletElement = L.markerClusterGroup();
        
        if (!_.isEmpty(this.props.metaData)) {
            markers = _.map(this.props.metaData, (val,key)=>{
                this._markers[val.SiteCode] = L.marker(new L.LatLng(val.Latitude, val.Longitude), {
                    title: val.LocalAuthorityName,
                    icon: new L.TextIcon({
                        text: '1',
                        color: 'blue',
                        id: val.SiteCode
                    })
                });

                this._markers[val.SiteCode].bindPopup(
                    "<b>Local authority name: </b>"+val.LocalAuthorityName+"<br>"+
                    "<b>Site code: </b>"+val.SiteCode+"<br>"+
                    "<b>Local authority code: </b>"+val.LocalAuthorityCode+"<br>"+
                    "<b>Site type:</b>"+val.SiteType).on('click', (e) => {self.props.onClickMarker(e.target.options.icon.options.id)});
                return this._markers[val.SiteCode];
            });

            this.leafletElement.addLayers(markers);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.realTimeData);

        _.forEach(nextProps.realTimeData, (val)=>{
            let color = 'blue';//Number(val.currentvalue)?'blue':'red';
            this._markers[val.SiteCode].options.icon.setColor(color);
            this._markers[val.SiteCode].options.icon.setText('1');    
        });
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return null;
    }
}

MarkerCluster.propTypes = {
    metaData: React.PropTypes.object.isRequired,
    realTimeData: React.PropTypes.array.isRequired,
    onClickMarker: React.PropTypes.func.isRequired
};

export default MarkerCluster;