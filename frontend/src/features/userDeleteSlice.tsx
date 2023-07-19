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
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  success: false,
  loading: false,
  error: null,
};

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (_, thunkAPI) => {
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

      const { data } = await axios.delete(`/api/users/${user._id}`, config);

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

const userDelete = createSlice({
  name: "success",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userDelete.reducer;
