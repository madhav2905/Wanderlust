const User=require("../models/user")

module.exports.renderSignup=(req,res)=>{
    res.render("auth/signup.ejs")
}

module.exports.createUser=async(req,res,next)=>{
    try {
        let {email,username,password}=req.body
        const newUser=new User({email,username})
        const registeredUser=await User.register(newUser,password)
        req.login(registeredUser,(error)=>{
            if (error) {
                return next(error)
            }
            req.flash("success","Welcome to Wanderlust!")
            res.redirect("/listings")
        })
    } catch (error) {
        if (error.code === 11000) {
            req.flash("error", "This email is already registered. Please use a different email.")
        } else {
            req.flash("error",error.message)   
        }
        res.redirect("/signup")
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("auth/login.ejs")
}

module.exports.loginUser=(req,res) => {
    req.flash("success", "Welcome back to Wanderlust!")
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logoutUser=(req,res,next)=>{
    req.logout((error)=>{
        if (error) {
            return next(error)
        }
        req.flash("success","Logged you out!")
        res.redirect("/listings")
    })
}