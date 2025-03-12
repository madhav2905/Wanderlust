const express=require("express")
const router=express.Router()
const wrapAsync=require("../utility/wrapAsync")
const passport=require("passport")
const { saveRedirectUrl } = require("../middleware")
const authController=require("../controller/auth")

router.route("/signup")
  .get(authController.renderSignup)
  .post(wrapAsync(authController.createUser))

router.route("/login")
  .get(authController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: { type: 'error', message: "Invalid credentials. Please try again!" },
    }),
    authController.loginUser
  )

router.get("/logout",authController.logoutUser)

module.exports=router