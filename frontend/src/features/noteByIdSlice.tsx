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
  noteInfo: NoteData;
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  noteInfo: { _id: "", title: "", content: "" },
  loading: false,
  error: null,
};

export const getNoteById = createAsyncThunk(
  "note/getById",
  async (id: string | undefined, thunkAPI) => {
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

      const { data } = await axios<NoteData>(`/api/notes/${id}`, config);

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

const noteGetById = createSlice({
  name: "noteInfo",
  initialState,
  reducers: {
    getNoteByIdReset: (state) => {
      state.noteInfo = { _id: "", title: "", content: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNoteById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.noteInfo = action.payload;
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { getNoteByIdReset } = noteGetById.actions;
export default noteGetById.reducer;
