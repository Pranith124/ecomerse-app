import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";

const router = Router();

router.post('/',protectRoute,createReview);
router.get('/:productId',protectRoute,deleteReview);

export default router;