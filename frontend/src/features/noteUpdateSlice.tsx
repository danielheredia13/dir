import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import axios from "axios";

interface UserData {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

interface NoteData {
  _id?: string;
  title: string;
  content: string;
}

interface NoteState {
  noteInfo: NoteData | {};
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  noteInfo: {},
  loading: false,
  error: null,
};

export const updateNote = createAsyncThunk(
  "note/update",
  async (noteData: NoteData, thunkAPI) => {
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
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/notes/${noteData._id}`,
        noteData,
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

const noteUpdate = createSlice({
  name: "noteInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateNote.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        state.noteInfo = action.payload;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default noteUpdate.reducer;
