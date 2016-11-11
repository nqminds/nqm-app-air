import React from 'react';
import { MapLayer } from 'react-leaflet';
import * as _ from "lodash";

const maxIntensity = 10;
const defaultRadius = 125;

class Heatmap extends MapLayer {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let latlngData = [];
        /*
        _.forEach(this.props.metaData,(val,key)=>{
            if (val.Latitude==null || val.Longitude==null)
                latlngData.push([val.Latitude, val.Longitude, maxIntensity]);
        });

        this.leafletElement = L.heatLayer(latlngData, {radius: defaultRadius, max: maxIntensity});
        */
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
    }

    render() {
        return null;
    }
}

Heatmap.propTypes = {
    metaData: React.PropTypes.object.isRequired
};

export default Heatmap;