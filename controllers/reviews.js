const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");


//@desc Get reviews
//@route GET /api/v1/reviews
//@route GET /api/v1/bootcamps/:bootcampId/reviews
//@access Public
const getReviews = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['reviews']
 // #swagger.description = 'end point to get all reviews of a bootcamp'

    if (req.params.bootcampId) {
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });
  
      return res.status(200).json({
        success: true,
        count:reviews.length,
        data:reviews,
      });
    } else {
      res.status(200).json(res.advancedResults);    
    }
  });

//@desc Get review
//@route GET /api/v1/reviews/:id
//@access Public
const getReview = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['reviews']
  // #swagger.description = 'end point to get a review'

   const review=await Review.findById(req.params.id).populate({
    path:"bootcamp",
    select:"name description"
   });

   if(!review){
      return next(new ErrorResponse(`No review found with the id of ${req.params.id}`,404));
   }

   res.status(200).json({
    success:true,
    data:review
   })
});

//@desc Add review
//@route GET /api/v1/bootcamps/:bootcampId/reviews
//@access Private
const addReview = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['reviews']
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
 // #swagger.description = 'end point add a review'

    req.body.bootcamp=req.params.bootcampId;
    req.body.user=req.user.id;
 
    const bootcamp=await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`,404))
    }

    const review=await Review.create(req.body);

    res.status(201).json({
     success:true,
     data:review
    })
 });

//@desc Update review
//@route GET /api/v1/reviews/:id
//@access Private
const updateReview = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['reviews']
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
 // #swagger.description = 'end point to update a review'

    let review=await Review.findById(req.params.id);

    if(!review){
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`,404));
    }

    /** make sure review belongs to user or user is an admin */
    if(review.user.toString()!==req.user.id&&req.user.role!=="admin"){
        return next(new ErrorResponse("Unathorized",401));
    }

    review=await Review.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })


    res.status(200).json({
     success:true,
     data:review
    })
 });


//@desc Delete review
//@route DELETE /api/v1/reviews/:id
//@access Private
const deleteReview = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['reviews']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    // #swagger.description = 'end point to delete a review'

    const review=await Review.findById(req.params.id);

    if(!review){
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`,404));
    }

    /** make sure review belongs to user or user is an admin */
    if(review.user.toString()!==req.user.id&&req.user.role!=="admin"){
        return next(new ErrorResponse("Unathorized",401));
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
     success:true,
     data:{}
    })
 });
 


  module.exports={getReviews,getReview,addReview,updateReview,deleteReview};