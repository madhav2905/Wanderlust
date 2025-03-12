const mongoose=require("mongoose")
const Review=require("./review")
const cloudinary=require("cloudinary").v2

const listingSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        filename: {type: String, required: true},
        url: {type: String, required: true}
    },
    price:{
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    location:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

listingSchema.post("findOneAndDelete",async function(doc){
    if (doc) {
        await Review.deleteMany({ _id: {$in: doc.reviews}})

        if (doc.image && doc.image.filename) {
            await cloudinary.uploader.destroy(doc.image.filename);
        }
    }
})

const Listing=mongoose.model("Listing",listingSchema)

module.exports=Listing