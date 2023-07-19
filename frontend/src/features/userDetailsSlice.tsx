import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import axios from "axios";

interface UserData {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

interface UserState {
  userInfo: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const details = createAsyncThunk("user/details", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const user = (state.userLogin.userInfo as UserData | null) ?? {
      _id: "",
      name: "",
      email: "",
      token: "",
    };

    const config = {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios<UserData>("/api/users/profile", config);

    return data;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

const userDetails = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    reset: (state) => {
      state.userInfo = { _id: "", name: "", email: "", token: "" };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(details.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(details.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(details.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { reset } = userDetails.actions;

export default userDetails.reducer;
