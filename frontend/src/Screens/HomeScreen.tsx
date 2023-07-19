import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../app/store";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";
import NoteCard from "../Components/NoteCard";
import { getNotes } from "../features/noteByUserSlice";

const HomeScreen = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const noteByUser = useSelector((state: RootState) => state.noteByUser);
  const { notesList, error, loading } = noteByUser;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const text = "Iniciar Sesion o Registrarse para crear nuevas notas";

  useEffect(() => {
    if (userInfo) {
      dispatch(getNotes());
    }
  }, [dispatch, userInfo]);

  const toggleHandler = () => {
    if (userInfo) {
      navigate("/note");
    } else {
      setLoginError(true);
    }
  };

  const errorReset = () => {
    setLoginError(false);
    setErrorMessage(false);
  };

  return (
    <Container className="home">
      <Button
        onClick={toggleHandler}
        variant="outline-primary"
        className="my-4 btn-add"
      >
        <i className="fa-solid fa-plus"></i>
      </Button>
      {loginError && (
        <Message errorReset={errorReset} variant="danger" text={text} />
      )}
      {error && errorMessage && (
        <Message errorReset={errorReset} variant="danger" text={error} />
      )}
      {loading && <Loader />}
      <Container className="note-card-box mt-3">
        {notesList &&
          notesList.length > 0 &&
          notesList.map((note) => {
            return <NoteCard key={note._id} note={note} />;
          })}
      </Container>
    </Container>
  );
};

export default HomeScreen;
