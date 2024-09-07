import { Router } from "express";

//local imports
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../controllers/user.controller";

const router = Router();

router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.delete("/user/:id", deleteUser);

export default router;
