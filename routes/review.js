const express=require("express")
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utility/wrapAsync")
const { isLoggedIn,isAuthor } = require("../middleware")
const reviewController=require("../controller/review")

router.post("/",isLoggedIn,wrapAsync(reviewController.createReview))

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router