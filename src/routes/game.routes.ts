import { Router } from "express";

//local imports
import { getGames, getGameById, deleteGame } from "../controllers/game.controller";
import { checkUserRol } from "../middlewares/checkUserRole";

const router = Router();

router.get("/games", checkUserRol, getGames);
router.get("/game/:id", checkUserRol, getGameById);
router.delete("/game/:id", checkUserRol, deleteGame);

export default router;
