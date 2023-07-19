import asyncHandler from "express-async-handler";
import Note from "../models/noteModel.js";

// desc Crear nueva nota
// ruta POST /api/notes
// acceso Privado

const createNote = asyncHandler(async (req, res) => {
  const user = req.user;
  const { title, content } = req.body;

  const titleExist = await Note.findOne({
    title: title,
  });

  if (titleExist) {
    res.status(400);
    throw new Error("Titulo ya existe");
  }

  const note = await Note.create({
    user: user._id,
    title: title,
    content: content,
  });

  if (note) {
    res.status(201).json({
      _id: note._id,
      title: note.title,
      content: note.content,
    });
  } else {
    res.status(400);
    throw new Error("Informacion de la nota no es valida");
  }
});

// desc Obtener notas del usuario
// ruta GET /api/notes/user/:id
// acceso Privado

const getNotes = asyncHandler(async (req, res) => {
  const user = req.user;

  const notesList = await Note.find({ user: user._id });

  if (notesList) {
    res.json(notesList);
  } else {
    res.status(404);
    throw new Error("Usuario no tiene notas");
  }
});

// desc obtener nota por id
// ruta GET /api/notes/:id
// acceso Privado

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    res.json(note);
  } else {
    res.status(404);
    throw new Error("Nota no encontrada");
  }
});

// desc actualizar nota
// ruta PUT /api/notes/:id
// acceso Privado

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  const { title, content } = await req.body;

  if (note) {
    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();

    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error("Nota no encontrada");
  }
});

// desc Borrar nota
// ruta DELETE /api/notes/:id
// acceso Privado

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    await Note.deleteOne({ _id: req.params.id });

    res.json({ message: "Nota borrado" });
  } else {
    res.status(404);
    throw new Error("Nota no encontrada");
  }
});

export { createNote, getNotes, getNoteById, updateNote, deleteNote };
