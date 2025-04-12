import AsyncStorage from '@react-native-async-storage/async-storage';
import {Place} from '../features/historySlice';

export const STORAGE_KEY = 'PLACE_HISTORY';

export const storePlaceHistory = async (history: Place[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history', e);
  }
};

export const getPlaceHistory = async (): Promise<any[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to get place history', e);
    return [];
  }
};
