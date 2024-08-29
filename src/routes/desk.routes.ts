import { Router } from "express";

//local imports
import { getDesks, getDeskById, createDesk, updateDesk, deleteDesk } from "../controllers/desk.controller";
import { checkUserRol } from "../middlewares/checkUserRole";

const router = Router();

router.get("/desks", checkUserRol, getDesks);
router.post("/desks", checkUserRol, createDesk);
router.get("/desk/:id", checkUserRol, getDeskById);
router.patch("/desk/:id", checkUserRol, updateDesk);
router.delete("/desk/:id", checkUserRol, deleteDesk);


export default router;
