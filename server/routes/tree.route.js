import getTree from "../controllers/tree.js";
import { Router } from "express";


const router = Router()

router.route('/').get(getTree)

export default router