const mongoose=require("mongoose")
const Listing=require("./models/listing")
const Review=require("./models/review")
const ExpressError=require("./utility/ExpressError")

module.exports.isLoggedIn=(req,res,next)=>{
    if (req.isAuthenticated()) {
        return next()
    }
    req.session.redirectUrl=req.originalUrl
    req.flash("error", "You must be logged in to do that")
    res.redirect("/login")
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400,"Invalid Listing ID"))
    }
    let listing=await Listing.findById(id)
    if (!listing) {
        return next(new ExpressError(404, "Listing Not Found"))
    }
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error","You don't have permission to perform the following action")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return next(new ExpressError(400,"Invalid Review ID"))
    }
    let review=await Review.findById(reviewId)
    if (!review) {
        return next(new ExpressError(404, "Review Not Found"))
    }
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error","You don't have permission to perform the following action")
        return res.redirect(`/listings/${id}`)
    }
    next()
}