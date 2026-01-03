if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express= require("express");
const app=express();
const mongoose=require("mongoose");

const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const ExpressError = require('./utils/ExpressError');

const listingRouter= require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



const   dbUrl=process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET || process.env.SECRETE,
    },  
    touchAfter: 24 * 3600 // time in seconds after which the session will be updated
});

store.on("error", (err)=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionoptions = {
    store,
    secret: process.env.SECRET || process.env.SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: oneWeekFromNow,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
};



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user || null;
    next();
});


app.get("/",(req,res)=>{
    res.redirect("/listings");
});
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/test",(req,res)=>{
    console.log(req.headers);
    res.send(req.headers);
})



//error handling middleware
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let{statuscode=500,message="something went wrong"}=err;
   // res.status(statuscode).send(message);
   res.status(statuscode).render("error.ejs", {message});
});


const PORT = process.env.PORT || 8080;

// Start server only after DB connection is established
main()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });