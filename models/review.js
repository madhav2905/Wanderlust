const mongoose=require("mongoose")

const reviewSchema=new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Review=mongoose.model("Review",reviewSchema)

module.exports=Review