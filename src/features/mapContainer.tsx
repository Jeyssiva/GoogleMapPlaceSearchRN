import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ScaledSize, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export interface Region {
  name: string;
  address: string;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

type MapContainerProps = {
  selectedPlace: Region;
};

const MapContainer = (props: MapContainerProps) => {
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapSize, setMapSize] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const {selectedPlace} = props;
  const {name, address, region} = selectedPlace as Region;

  useEffect(() => {
    const onChange = ({window}: {window: ScaledSize}) => {
      setMapSize({
        width: window.width,
        height: window.height,
      });
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => {
      subscription.remove(); // cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      mapRef.current.fitToCoordinates([region], {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [mapReady, region]);

  return (
    <View>
      <MapView
        region={region}
        style={{width: mapSize.width, height: mapSize.height}}
        // style={StyleSheet.absoluteFillObject}
        ref={mapRef}
        onLayout={() => setMapReady(true)}>
        <Marker key={name} coordinate={region} title={`${name} - ${address}`} />
      </MapView>
    </View>
  );
};

export default MapContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
