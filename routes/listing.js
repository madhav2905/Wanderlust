const express=require("express")
const router=express.Router()
const wrapAsync=require("../utility/wrapAsync")
const { isLoggedIn,isOwner } = require("../middleware")
const listingController=require("../controller/listing")
const multer=require("multer")
const { storage } = require("../cloudConfig")
const upload=multer({storage})

router.route("/")
    .get(listingController.index)
    .post(isLoggedIn,upload.single("image"),wrapAsync(listingController.createListing))

router.get("/new",isLoggedIn,listingController.newListing)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("image"),wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))

module.exports=router