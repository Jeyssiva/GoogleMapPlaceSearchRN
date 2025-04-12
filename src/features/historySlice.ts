import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Place {
  place_id: string;
  address: string;
  name: string;
  location: {lat: number; lng: number};
}

interface HistoryState {
  places: Place[];
}

const initialState: HistoryState = {
  places: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<Place[]>) => {
      state.places = action.payload;
    },
    addPlace: (state, action: PayloadAction<Place>) => {
      state.places.unshift(action.payload);
    },
  },
});

export const {setHistory, addPlace} = historySlice.actions;
export default historySlice.reducer;
