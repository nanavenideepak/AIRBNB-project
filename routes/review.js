const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/WrapAsync.js");
const ExpressError = require('../utils/ExpressError');
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {validateReview,Isloggedin,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js");



//post review  route
router.post("/", Isloggedin,validateReview,wrapAsync(reviewController.createReview));



//delete review route
router.delete("/:reviewId",Isloggedin,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;