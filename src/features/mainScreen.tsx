import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getPlaceHistory, storePlaceHistory} from '../utils/storage';
import {addPlace, setHistory} from './historySlice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import Config from 'react-native-config';
import axios from 'axios';
import MapContainer, {Region} from './mapContainer';
import HistoryModal from './historyModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GOOGLE_API_KEY = Config.GOOGLE_MAPS_API_KEY;

const MainScreen = () => {
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) => state.history.places);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedPlace, setRegion] = useState<Region>({
    name: 'Kuala Lumpur',
    address: 'Malaysia',
    region: {
      latitude: 3.140853,
      longitude: 101.693207,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [suggestionLoading, setSuggestLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getPlaceHistory();
      dispatch(setHistory(data));
    };
    //TODO:
    //AsyncStorage.clear();
    loadHistory();
  }, [dispatch]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    setSuggestLoading(true);
    const res = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: text,
          key: GOOGLE_API_KEY,
        },
      },
    );
    setSuggestLoading(false);
    setSuggestions(res.data.predictions);
  };

  const handleSelect = async (item: any) => {
    const details = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: item.place_id,
          key: GOOGLE_API_KEY,
        },
      },
    );

    const {name, formatted_address: address, geometry} = details.data.result;
    const {location} = geometry;

    const place = {place_id: item.place_id, name, address, location};
    const ifExistPlace = history.find(h => h.place_id === place.place_id);
    if (!ifExistPlace) {
      dispatch(addPlace(place));
      storePlaceHistory([place, ...history]);
    }

    setRegion({
      name,
      address,
      region: {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
    });
    setSuggestions([]);
    setQuery(name);
    setShowAllHistory(false);
  };

  const renderHistory = () => {
    const displayList = showAllHistory ? history : history.slice(0, 5);
    return (
      <>
        <FlatList
          data={displayList}
          keyExtractor={(_, idx) => idx.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({item}) => (
            <TouchableHighlight
              onPress={() =>
                handleSelect({place_id: item.place_id, description: item.name})
              }>
              <Text style={styles.item}>{item.name}</Text>
            </TouchableHighlight>
          )}
          ListHeaderComponent={
            history.length === 0 ? (
              <View>
                <Text style={styles.historyTitle}>No history</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.historyTitle}>Recent</Text>
              </View>
            )
          }
          ListFooterComponent={
            history.length > 5 ? (
              <TouchableHighlight onPress={() => setShowAllHistory(true)}>
                <Text style={styles.moreText}>More from recent history</Text>
              </TouchableHighlight>
            ) : null
          }
        />
      </>
    );
  };

  const onSearchFocus = () => {
    setSuggestions([]);
  };

  const onHandleClose = () => {
    setSuggestions([]);
    setQuery('');
  };

  return (
    <View>
      <View style={styles.modalHeader}>
        <TextInput
          placeholder="Search places..."
          value={query}
          onFocus={onSearchFocus}
          onBlur={() => setQuery('')}
          onChangeText={handleSearch}
          style={styles.input}
        />
        <TouchableOpacity onPress={onHandleClose} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      {query === '' && renderHistory()}
      {/* Load from google APIs */}
      <FlatList
        data={suggestions}
        keyExtractor={(_, i) => i.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({item}) => (
          <TouchableHighlight onPress={() => handleSelect(item)}>
            <Text style={styles.item}>{item.description}</Text>
          </TouchableHighlight>
        )}
        ListFooterComponent={
          suggestionLoading ? (
            <ActivityIndicator animating={true} size="large" color="#00ff00" />
          ) : null
        }
      />

      <MapContainer selectedPlace={selectedPlace} />
      <HistoryModal
        showAllHistory={showAllHistory}
        history={history}
        onHandleSelect={handleSelect}
        onHandleShowHistory={(value: boolean) => setShowAllHistory(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    color: 'green',
  },
  moreText: {color: 'blue', marginVertical: 10, textAlign: 'center'},
  historyTitle: {color: 'gray', fontSize: 12},
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    color: '#000',
  },
  closeIcon: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#999',
    borderRadius: 20,
  },
});

export default MainScreen;
