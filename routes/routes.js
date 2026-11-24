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

router.post("/crearusuario", createUsuario);
router.get("/login", getMati);

router.post("/cancion", verifyToken, verifyAdmin, createCancion);
router.put("/cancion", verifyToken, verifyAdmin, updateCancion);
router.delete("/cancion", verifyToken, verifyAdmin, deleteCancion);

router.post("/escucho", verifyToken, registrarEscucha);
router.get("/escucho", verifyToken, escucho);

export default router;