const Listing=require("../models/listing")
const Review=require("../models/review")

module.exports.createReview=async (req,res)=>{
    const listing=await Listing.findById(req.params.id)
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    const {rating,comment}=req.body
    if (!rating || !comment) {
        return res.status(400).send("Rating and comment are required.");
    }
    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).send("Rating must be a number between 1 and 5.");
    }
    if (typeof comment!=="string") {
        return res.status(400).send("Comment must be a string.");
    }
    const newReview=new Review({rating,comment})
    newReview.author=req.user._id
    await newReview.save()
    listing.reviews.push(newReview)
    await listing.save()
    req.flash("success","Review Created Successfully!")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview=async (req,res,next)=>{
    const {id,reviewId}=req.params
    const deletedReview=await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
        return next(new ExpressError(404, "Review not found."));
    }
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    req.flash("success","Review Deleted Successfully!")
    res.redirect(`/listings/${id}`)
}