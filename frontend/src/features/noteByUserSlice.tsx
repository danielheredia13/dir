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
  _id: string;
  title: string;
  content: string;
}

interface NoteState {
  notesList: NoteData[];
  loading: boolean;
  fetched: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notesList: [],
  loading: false,
  fetched: false,
  error: null,
};

export const getNotes = createAsyncThunk(
  "note/getList",
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

      const { data } = await axios(`/api/notes/user/${user._id}`, config);

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

const notesGetByUser = createSlice({
  name: "notesList",
  initialState,
  reducers: {
    getNotesReset: (state) => {
      state.notesList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notesList = action.payload;
        state.fetched = true;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { getNotesReset } = notesGetByUser.actions;
export default notesGetByUser.reducer;
