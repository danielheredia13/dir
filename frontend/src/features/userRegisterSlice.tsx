import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserData {
  _id?: string;
  name: string;
  email: string;
  password?: string;
}

interface UserState {
  userInfo: UserData;
  loading: boolean;
  error: string | null;
}

interface UserCreatedData {
  _id: string;
  name: string;
  email: string;
}

const initialState: UserState = {
  userInfo: { name: "", email: "", password: "" },
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "user/register",
  async (userData: UserData, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post<UserCreatedData>(
        "/api/users",
        userData,
        config
      );

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

const userRegister = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    registerReset: (state) => {
      state.userInfo = { name: "", email: "", password: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { registerReset } = userRegister.actions;
export default userRegister.reducer;
