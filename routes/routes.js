import { Router } from "express";
import {
    createUsuario,
    getMati,
    escucho,
    createCancion,
    updateCancion,
    deleteCancion,
    registrarEscucha
} from "../controllers/funciones.js";
import { verifyToken, verifyAdmin } from "../middlewares/middleware.js";

const router = Router();

// Usuarios
router.post("/crearusuario", createUsuario);
router.get("/login", getMati);

// Canciones: solo admin
router.post("/cancion", verifyToken, verifyAdmin, createCancion);
router.put("/cancion", verifyToken, verifyAdmin, updateCancion);
router.delete("/cancion", verifyToken, verifyAdmin, deleteCancion);

// Escuchas: cualquier usuario logueado
router.post("/escucho", verifyToken, registrarEscucha);
router.get("/escucho", verifyToken, escucho);

export default router;