const express= require("express");
const router= express.Router();
const wrapAsync=require("../utils/WrapAsync.js");

const Listing=require("../models/listing.js");
const {Isloggedin,isOwner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({  storage })


router.route("/").get( wrapAsync(listingcontroller.index))
.post(Isloggedin, upload.single("listing[image]"),validateListing, wrapAsync(listingcontroller.createListing));






//new route
router.get("/new", Isloggedin,listingcontroller.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingcontroller.showListing))
.put(Isloggedin,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingcontroller.updateListing))
.delete(Isloggedin,isOwner,wrapAsync(listingcontroller.deleteListing));




//edit route
router.get("/:id/edit", Isloggedin,isOwner,wrapAsync(listingcontroller.renderEditForm));




module.exports=router;