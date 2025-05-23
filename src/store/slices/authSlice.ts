import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string | null;
  fullName: string;
  profileUrl: string;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

export const listenToAuthChanges = createAsyncThunk(
  'auth/listenToAuthChanges',
  async (_, thunkAPI) => {
    try {
      return new Promise<UserProfile | null>((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const docRef = doc(firestore, 'users', user.uid);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                const userData = docSnap.data();
                resolve({
                  uid: user.uid,
                  email: user.email,
                  fullName: userData.fullName,
                  profileUrl: userData.profileUrl,
                });
              } else {
                resolve(null);
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              reject('Failed to fetch user data');
            }
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Error in listenToAuthChanges:', error);
      return thunkAPI.rejectWithValue('Failed to listen to auth changes');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listenToAuthChanges.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(listenToAuthChanges.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(listenToAuthChanges.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
