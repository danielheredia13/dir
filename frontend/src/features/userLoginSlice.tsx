import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserData {
  _id?: string;
  name?: string;
  email: string;
  password?: string;
  token?: string;
}

interface UserState {
  userInfo: UserData | null;
  loading: boolean;
  error: string | null;
}

const userFromLocalStorageStr = localStorage.getItem("userLogin");
const userFromLocalStorage: UserData | null = userFromLocalStorageStr
  ? JSON.parse(userFromLocalStorageStr)
  : null;

const initialState: UserState = {
  userInfo: userFromLocalStorage,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "user/login",
  async (userData: { email: string; password: string }, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/users/login", userData, config);

      localStorage.setItem("userLogin", JSON.stringify(data));

      return data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userLogin = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = initialState.userInfo;

      localStorage.removeItem("userLogin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userLogin.actions;
export default userLogin.reducer;
