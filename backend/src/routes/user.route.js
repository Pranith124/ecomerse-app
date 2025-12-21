import { Router } from "express";
import { addAddress, addWishlist, deleteAddress, getAddress, getWishlist, removeFromWishlist, updateAddress } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router =Router();

router.use(protectRoute)

router.post("/addresses",addAddress);
router.get("/addresses",getAddress);
router.put("/addresses/:addressId",updateAddress);
router.delete("/addresses/:addressId",deleteAddress);

router.post('wishlist',addWishlist);
router.delete('wishlist/:productId',removeFromWishlist);
router.get('wishlist',getWishlist);

export default router;