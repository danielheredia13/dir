import { useState, useEffect } from "react";
import { InputGroup, Form, Card, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../app/store";
import { useParams, useNavigate } from "react-router-dom";
import { updateNote } from "../features/noteUpdateSlice";
import { getNoteById } from "../features/noteByIdSlice";
import { getNotes } from "../features/noteByUserSlice";
import Message from "../Components/Message";
import Loader from "../Components/Loader";

const UpdateNoteScreen = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const noteById = useSelector((state: RootState) => state.noteById);
  const { noteInfo } = noteById;

  const noteUpdate = useSelector((state: RootState) => state.noteUpdate);
  const { loading, error } = noteUpdate;

  useEffect(() => {
    if (noteInfo && noteInfo.title.length > 0) {
      setTitle(noteInfo.title);
      setContent(noteInfo.content);
    }

    if (noteInfo && noteInfo._id !== id) {
      dispatch(getNoteById(id));
    }
  }, [noteInfo, dispatch, id]);

  const UpdateContactHandler = async () => {
    await dispatch(
      updateNote({
        _id: noteInfo._id,
        title: title,
        content: content,
      })
    );

    dispatch(getNotes());
    navigate("/");
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
        <h4>Actualizar Nota</h4>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Titulo</InputGroup.Text>
          <Form.Control
            placeholder=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>Comentario</InputGroup.Text>
          <Form.Control
            as="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </InputGroup>
        <Button className="btn-form rounded" onClick={UpdateContactHandler}>
          Actualizar Nota
        </Button>
      </Card>
    </Container>
  );
};

export default UpdateNoteScreen;
