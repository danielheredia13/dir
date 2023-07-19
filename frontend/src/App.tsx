import { Route, Routes } from "react-router-dom";
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import Header from "./Components/Header";
import RegisterScreen from "./Screens/RegisterScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import AddNoteScreen from "./Screens/AddNoteScreen";
import UpdateNoteScreen from "./Screens/UpdateNoteScreen";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/profile/:id" element={<ProfileScreen />} />
        <Route path="/note" element={<AddNoteScreen />} />
        <Route path="/note/:id" element={<UpdateNoteScreen />} />
      </Routes>
    </div>
  );
}

export default App;
