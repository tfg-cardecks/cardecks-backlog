import { Router } from "express";

//local imports
import {
  createMatchingGame,
  completeCurrentGame,
  getMatchingGameById,
  getMatchingGames,
  deleteMatchingGame,
} from "../../controllers/games/matchingGames.controller";
import { checkUserRol } from "../../middlewares/checkUserRole";

const router = Router();

router.get("/matchingGames", checkUserRol, getMatchingGames);
router.post("/matchingGames", checkUserRol, createMatchingGame);
router.post("/currentMatchingGame/:matchingGameId", checkUserRol, completeCurrentGame);
router.get("/matchingGame/:id", checkUserRol, getMatchingGameById);
router.delete("/matchingGame/:matchingGameId", checkUserRol, deleteMatchingGame);

export default router;
