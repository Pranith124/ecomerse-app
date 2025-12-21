import { Order } from "../models/order.model";
import { Review } from "../models/review.model";


export async function createReview(req,res){
    try {
        const {productId,rating,comment,orderId}= req.body;
        if(!rating || rating<1 || rating>5)
        {
            return res.status(400).json({error:"Rating must be between 1 and 5"});
        }

        const user = req.user;
        const order= await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        if(order.clerkId !== user.clerkId){
            return res.status(403).json({message:"You are not authorized to review this order"});
        }

        if(order.status !=='delivered'){
            return res.status(400).json({message:"Cannot review an order that is not delivered"});
        }

        const productInorder= order.orderItems.find((item) => item.product.toString()=== productId.toString());

        if(!productInorder){
            return res.status(400).json({message:"Product not found in the order"});
        }

        const existingReview= await Review.findOne({productId,userId:user._id});
        if(existingReview){
            return res.status(400).json({message:"You have already reviewed this product for this order"});
        }

        const review =await Review.create({
            productId,
            userId:user._id,
            orderId,
            rating,
        })

        const product= await Product.findById(productId);
        const reviews= await Review.find({productId});
        const TotalRating = reviews.reduce((sum,rev) => sum + rev.rating,0);
        product.averageRating= TotalRating / reviews.length;
        product.totalReviews= reviews.length;
        await product.save();
        res.status(201).json({message:"Review created successfully",review});

    } catch (error) {
        console.error("Error creating review",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteReview(req,res){
    try {
        const {reviewId}=req.params;
        const user=req.user;

        const review= await Review.findById(reviewId);
        if(!review){
            return res.status(404).json({message:"Review not found"});
        }

        if(review.userId.toString() !== user._id.toString()){
            return res.status(403).json({message:"You are not authorized to delete this review"});
        }

        const productId= review.productId;
        await review.findByIdAndDelete(reviewId);

        const reviews= await Review.find({productId});
        const totalRating= reviews.reduce((sum,rev) => sum + rev.rating,0);
        await Product.findByIdAndUpdate(productId,{
            averageRating: reviews.length ? totalRating / reviews.length : 0,
            totalReviews: reviews.length,
        });
    } catch (error) {
        
    }
}