const mongoose=require("mongoose")
const Listing=require("../models/listing")
const ExpressError=require("../utility/ExpressError")
const cloudinary=require("cloudinary").v2
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient=mbxGeocoding({ accessToken: process.env.MAPBOX_API_KEY })


module.exports.index=async (req, res) => {
    let query=req.query.q || ""
    let listings;

    if (query) {
        listings=await Listing.find({
            title: { $regex: query, $options: "i" }
        })
    } else {
        listings=await Listing.find({})
    }

    res.render("listings/index.ejs", { listings,query })
}

module.exports.newListing=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=async (req,res,next)=>{
    let {id}=req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400,"Invalid Listing ID"))
    }
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
    if (!listing) {
        return next(new ExpressError(404,"Listing Not Found"))
    }
    res.render("listings/show.ejs",{listing})
}

module.exports.createListing=async (req,res,next)=>{
    if (!req.user) {
        return next(new ExpressError(401, "You must be logged in to create a listing"));
    }

    let {title,description,price,location,country}=req.body

    if (!title || !description || !price || !location || !country) {
        return next(new ExpressError(400, "All fields are required"));
    }

    let geoData;
    try {
        let response = await geocodingClient.forwardGeocode({
            query: `${location}, ${country}`,
            limit: 1
        }).send();

        if (response.body.features.length === 0) {
            return next(new ExpressError(400, "Invalid location"));
        }

        geoData = response.body.features[0].geometry.coordinates;
    } catch (error) {
        return next(new ExpressError(500, "Geocoding failed"));
    }

    let newListing=new Listing({title,description,price,location,country,geometry: { type: "Point", coordinates: geoData }})
    newListing.owner=req.user._id

    if (req.file) {
        newListing.image={
            filename: req.file.filename,
            url: req.file.path
        }
    } else {
        return next(new ExpressError(400, "Image is required"))
    }

    await newListing.save()
    req.flash("success","Listing Created Successfully!")
    res.redirect("/listings")
}

module.exports.editListing=async (req,res,next)=>{
    let {id}=req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400,"Invalid Listing ID"))
    }
    let listing=await Listing.findById(id)
    if (!listing) {
        return next(new ExpressError(404,"Listing Not Found"))
    }
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateListing=async (req,res,next)=>{
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400, "Invalid Listing ID"))
    }

    let listing=await Listing.findById(id)
    if (!listing) {
        return next(new ExpressError(404,"Listing Not Found"))
    }

    let { title, description, price, location=listing.location, country=listing.country } = req.body
    let updatedData = { title, description, price, location, country }

    if (location !== listing.location || country !== listing.country) {
        try {
            let response = await geocodingClient.forwardGeocode({
                query: `${location}, ${country}`,
                limit: 1
            }).send();

            if (response.body.features.length === 0) {
                return next(new ExpressError(400, "Invalid location"));
            }

            updatedData.geometry = {
                type: "Point",
                coordinates: response.body.features[0].geometry.coordinates
            };
        } catch (error) {
            console.error("Geocoding Error:", error);
            return next(new ExpressError(500, "Geocoding failed"));
        }
    }

    if (req.file) {
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        updatedData.image={
            filename: req.file.filename,
            url: req.file.path
        }
    }

    let updatedListing=await Listing.findByIdAndUpdate(id, updatedData, { new: true })
    
    if (!updatedListing) {
        return next(new ExpressError(404, "Failed to update listing"));
    }

    req.flash("success", "Listing Updated Successfully!")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing=async (req,res,next)=>{
    let {id}=req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400,"Invalid Listing ID"))
    }
    let deletedListing=await Listing.findByIdAndDelete(id)
    if (!deletedListing) {
        return next(new ExpressError(404,"Listing Not Found"))
    }

    if (deletedListing.image && deletedListing.image.filename) {
        await cloudinary.uploader.destroy(deletedListing.image.filename);
    }
    
    req.flash("success","Listing Deleted Successfully!")
    res.redirect("/listings")
}