// const mongoose = require("mongoose");
// const Schema=mongoose.Schema;

// const reviweSchema= new Schema({
//     comments: String,
//     rating : {
//         type : Number,
//         min : 1,
//         max : 5
//     },
//     createdAt:{
//         type: Date,
//         default: Date.now(),
//     },
// });

// module.exports= mongoose.model("Review", reviweSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {  // Changed from "comments" to "comment"
        type: String,
        required: true  // Ensure the comment is required
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now  // Removed parentheses
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
});

module.exports = mongoose.model("Review", reviewSchema);
