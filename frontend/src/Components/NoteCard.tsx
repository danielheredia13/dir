import React from "react";
import { Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { deleteNote } from "../features/noteDeleteSlice";
import { getNotes } from "../features/noteByUserSlice";

interface NoteData {
  _id: string;
  title: string;
  content: string;
}

interface NoteProps {
  note: NoteData;
}

const NoteCard: React.FC<NoteProps> = ({ note }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const navigate = useNavigate();

  const id = note._id;
  const title = note.title;
  const content = note.content;

  const updateBtnHandler = (id: string) => {
    navigate(`/note/${id}`);
  };

  const deleteBtnHandler = async (id: string) => {
    if (window.confirm("Borrar nota ?")) {
      await dispatch(deleteNote(id));
      dispatch(getNotes());
    }
  };

  return (
    <Card className="note-card">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{content}</Card.Text>
        <Button onClick={() => updateBtnHandler(id)} className="btn-sm rounded">
          <i className="fa-sharp fa-solid fa-pen"></i>
        </Button>

        <Button
          onClick={() => deleteBtnHandler(id)}
          className="btn-sm rounded btn-trash"
          variant="danger"
        >
          <i className="fa-solid fa-trash"></i>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
