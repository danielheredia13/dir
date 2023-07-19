import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import axios from "axios";

interface UserData {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

interface NoteState {
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  success: false,
  loading: false,
  error: null,
};

export const deleteNote = createAsyncThunk(
  "note/delete",
  async (id: string, thunkAPI) => {
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

      const { data } = await axios.delete(`/api/notes/${id}`, config);

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

const noteDelete = createSlice({
  name: "success",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteNote.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default noteDelete.reducer;
