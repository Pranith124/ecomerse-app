import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Review } from "../models/review.model";

export async function createOrder(req,res){
    try{
        const user =req.user;
        const {orderItems,shippingAddress,paymentResult,totalPrice}= req.body;

        if(!orderItems || orderItems.length===0){
            return res.status(400).json({error:"No order items provided"});
        }

        for(const item of orderItems){
            const product = await Product.findById(item.product._id);
            if(!product){
                return res.status(404).json({message:`Product with id ${item.product._id} not found`});
            }
            if(product.stock < item.quantity){
                return res.status(400).json({message:`Insufficient stock for product ${product.name}`});
            }
        }

        const order =await Order.create({
            user:user._id,
            clerkId:user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice, 
        });

        for(const item of orderItems){
            await Product.findByIdAndUpdate(item.product._id,{
                $inc:{stock:-item.quantity},
            });
        }

        res.status(201).json({message:"Order created successfully",order});

    }catch(error){
        console.error("Error creating order",error);
        res.status(500).json({message:"Internal server error"});

    }
}

export async function getUserOrders(req,res){
    try {
        const user=req.user;
        const orders= await Order.find({clerkId:user.clerkId}).populate("orderItems.product").sort({createdAt:-1});

        const orderWithReviewStatus=  await Promise.all(
            orders.map(async(order)=>{
                const review =await Review.findOne({order:order._id})
                return {
                    ...order.toObject(),
                    hasReview: !!review,
                }
            })
        )

        res.status(200).json({orders:orderWithReviewStatus});

        
    } catch (error) {
        console.error("Error fetching user orders",error);
        res.status(500).json({message:"Internal server error"});
    }
}