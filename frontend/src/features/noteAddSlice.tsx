import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import axios from "axios";

interface NoteData {
  _id?: string;
  title: string;
  content: string;
}

interface NoteState {
  noteInfo: NoteData;
  loading: boolean;
  error: string | null;
}

interface NoteCreatedData {
  _id: string;
  title: string;
  content: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

const initialState: NoteState = {
  noteInfo: { _id: "", title: "", content: "" },
  loading: false,
  error: null,
};

export const addNote = createAsyncThunk(
  "note/add",
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

      const { data } = await axios.post<NoteCreatedData>(
        "/api/notes",
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

const noteAdd = createSlice({
  name: "noteData",
  initialState,
  reducers: {
    addReset: (state) => {
      state.noteInfo = { _id: "", title: "", content: "" };
    },
    addErrorReset: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNote.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.loading = false;
        state.noteInfo = action.payload;
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addReset, addErrorReset } = noteAdd.actions;
export default noteAdd.reducer;
