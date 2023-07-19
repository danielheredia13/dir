import React, { useState, useEffect } from "react";
import { InputGroup, Form, Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../app/store";
import { addNote } from "../features/noteAddSlice";
import { addErrorReset } from "../features/noteAddSlice";
import { addReset } from "../features/noteAddSlice";
import { getNotes } from "../features/noteByUserSlice";
import Message from "../Components/Message";
import Loader from "../Components/Loader";

const AddNoteScreen = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const noteAdd = useSelector((state: RootState) => state.noteAdd);
  const { noteInfo, loading, error } = noteAdd;

  useEffect(() => {
    if (noteInfo && noteInfo.title.length > 0) {
      setTitle("");
      setContent("");
      dispatch(getNotes());
      dispatch(addReset());
      navigate("/");
    }

    if (error) {
      setErrorMessage(true);
      setTimeout(() => {
        dispatch(addErrorReset());
      }, 2000);
    }
  }, [navigate, error, dispatch, noteInfo]);

  const addNoteHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await dispatch(
      addNote({
        title,
        content,
      })
    );
  };

  const errorReset = () => {
    setErrorMessage(false);
  };

  return (
    <Container>
      <Button onClick={() => navigate("/")} className="mt-3 rounded">
        Atras
      </Button>
      {error && errorMessage && (
        <Message errorReset={errorReset} variant="danger" text={error} />
      )}
      {loading && <Loader />}
      <Card className="p-3 note-box">
        <h4>Nueva Nota</h4>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Titulo</InputGroup.Text>
          <Form.Control
            placeholder=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>Comentario</InputGroup.Text>
          <Form.Control
            as="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
          />
        </InputGroup>

        <Button className="btn-form rounded" onClick={addNoteHandler}>
          Agregar Nota
        </Button>
      </Card>
    </Container>
  );
};

export default AddNoteScreen;
