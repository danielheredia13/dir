import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// desc Autorizacion de usuario y generacion de token
// route POST /api/users/login
// acceso Publico

const authUsers = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  const auth =
    user && user.password
      ? await bcrypt.compare(password, user.password)
      : false;

  if (user && auth) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Correo electronico o password invalidos");
  }
});

// desc obtener usuario login
// ruta GET /api/users/profile
// acceso Privado

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

// desc registro nuevo usuario
// ruta POST /api/users
// acceso Publico

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({
    email: email,
  });

  if (userExist) {
    res.status(400);
    throw new Error("Usuario ya registrado");
  }

  const user = await User.create({
    name: name,
    email: email,
    password: bcrypt.hashSync(password, 10),
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Informacion del usuario invalida");
  }
});

// desc actualizar perfil del usuario
// ruta PUT /api/users/profile
// acceso Privado

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, password } = await req.body;

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado ");
  }
});

// desc Delete user
// ruta DELETE /api/users/:id
// acceso Privado

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const userId = user._id.toString();
  const userLoginId = req.user._id.toString();

  if (user && userId == userLoginId) {
    await User.deleteOne({ _id: userLoginId });

    res.json({ message: "Usuario borrado" });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

export {
  authUsers,
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
