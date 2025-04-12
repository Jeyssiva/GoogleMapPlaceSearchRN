import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Place} from './historySlice';
import Ionicons from 'react-native-vector-icons/Ionicons';

type HistoryProps = {
  history: Place[];
  showAllHistory: boolean;
  onHandleShowHistory: Function;
  onHandleSelect: Function;
};
const HistoryModal = (props: HistoryProps) => {
  const {showAllHistory, history, onHandleShowHistory, onHandleSelect} = props;
  return (
    <Modal visible={showAllHistory} transparent animationType="slide">
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>History</Text>
        <FlatList
          data={history}
          keyExtractor={(_, idx) => idx.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({item}) => (
            <TouchableHighlight
              onPress={() =>
                onHandleSelect({
                  place_id: item.place_id,
                  description: item.name,
                })
              }>
              <Text style={styles.item}>{item.name}</Text>
            </TouchableHighlight>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={() => onHandleShowHistory(false)}>
              <Ionicons
                style={styles.closeBtn}
                name="close"
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    color: 'green',
  },
  moreText: {color: 'blue', marginVertical: 10},
  modalView: {flex: 1, backgroundColor: 'white', marginTop: 100, padding: 20},
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 20,
    textAlign: 'center',
    color: 'red',
    borderRadius: 20,
  },
});

export default HistoryModal;
