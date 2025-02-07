import { Router } from "express";

// local imports
import {
  createLetterOrderGame,
  completeCurrentGame,
  getLetterOrderGameById,
  getLetterOrderGames,
  deleteLetterOrderGame,
} from "../../controllers/games/letterOrderGame.controller";
import { checkUserRol } from "../../middlewares/checkUserRole";

const router = Router();

router.get("/letterOrderGames", checkUserRol, getLetterOrderGames);
router.post("/letterOrderGames", checkUserRol, createLetterOrderGame);
router.post("/currentLetterOrderGame/:letterOrderGameId", checkUserRol, completeCurrentGame);
router.get("/letterOrderGame/:id", checkUserRol, getLetterOrderGameById); 
router.delete("/letterOrderGame/:letterOrderGameId", checkUserRol, deleteLetterOrderGame);

export default router;