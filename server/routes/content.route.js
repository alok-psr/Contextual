
import { newFile,existingFile } from "../controllers/content.js";
import {Router} from "express"

const router = Router()

router.route("/").put(existingFile)
router.route("/new").put(newFile)

export default router