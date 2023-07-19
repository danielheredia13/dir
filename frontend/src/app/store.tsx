import { configureStore } from "@reduxjs/toolkit";
import userRegisterReducer from "../features/userRegisterSlice";
import { combineReducers } from "@reduxjs/toolkit";
import userLoginReducer from "../features/userLoginSlice";
import userDetailsReducer from "../features/userDetailsSlice";
import userUpdateReducer from "../features/userUpdateSlice";
import userDeleteReducer from "../features/userDeleteSlice";
import noteAddReducer from "../features/noteAddSlice";
import noteByUserReducer from "../features/noteByUserSlice";
import noteUpdateReducer from "../features/noteUpdateSlice";
import noteByIdReducer from "../features/noteByIdSlice";
import noteDeleteReducer from "../features/noteDeleteSlice";

const rootReducer = combineReducers({
  userRegister: userRegisterReducer,
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,
  noteAdd: noteAddReducer,
  noteByUser: noteByUserReducer,
  noteUpdate: noteUpdateReducer,
  noteById: noteByIdReducer,
  noteDelete: noteDeleteReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
