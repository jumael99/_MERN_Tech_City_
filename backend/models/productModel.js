import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    name:{
        type:String,
        required:true,
    },
    rating: {
        type:Number,
        required:true,
    },
    comment: {
        type:String,
        required:true,
    },

}, {
    timestamps:true
})

/*The User created the product not same user in review*/

const productSchema = new mongoose.Schema({
    /*user: every prod conn user.which user added that prod*/
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User", /*which collection this coming from*/
    },
    name: {
        type:String,
        required:true,
    },
    image: {
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    reviews:[reviewSchema], /*we'll have a reviewSchema*/
    rating:{
        type:Number,
        required:true,
        default:0
    },
    numReviews:{
        type:Number,
        required:true,
        default:0
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    countInStock: {
        type:Number,
        required:true,
        default:0
    }
}, {
    timestamps:true,
});

const Product = mongoose.model("Product", productSchema);
export default Product;