import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const fetchUserIfNeeded = createAsyncThunk(
  "userMap/fetchUserIfNeeded",
  async (userId: string, { getState }) => {
    const state = getState() as any;
    if (state.userMap[userId]) return null;

    const userDoc = await getDoc(doc(firestore, "users", userId));
    return userDoc.exists() ? { userId, data: userDoc.data() } : null;
  }
);

const userMapSlice = createSlice({
  name: "userMap",
  initialState: {} as Record<string, any>,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserIfNeeded.fulfilled, (state, action) => {
      if (action.payload) {
        const { userId, data } = action.payload;
        state[userId] = data;
      }
    });
  },
});

export default userMapSlice.reducer;
