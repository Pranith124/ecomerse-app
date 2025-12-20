import mongoose from "mongoose";

const orderItemsSchema= new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    image:{
        type:String,
        required:true,
    },
})

const shippingAddressSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    streetAddress:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true,
    },
    State:{
        type:String,
        required:true,
    },
    zipCode:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true
    }
})

const orderSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    clerkId:{
        type:String,
        required:true,
    },
    orderItems:[orderItemsSchema],
    shippingAddress:{
        type:shippingAddressSchema,
        required:true,
    },
    paymentResult:{
        id:String,
        status:String,
    },
    totalPrice:{
        type:Number,
        required:true,
        min:0,
    },
    status:{
        type:String,
        enum:["Pending","shipped","delivered" ],
        default:"Pending",
    },
    deliveryAt:{
        type:Date,
    },
    shippedAt:{
        type:Date,
    }
},{timestamps:true});


export const order=mongoose.model("Order",orderSchema);