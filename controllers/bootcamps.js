const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middlewares/async");
const path=require("path");

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Create new bootcamp
//@route POST /api/v1/bootcamps
//@access Private
const createBootcamp = asyncHandler(async (req, res, next) => {

  /** add user to req.body */
  req.body.user=req.user.id;

  /** checked for published bootcamp */
  const publishedBootcamp=await Bootcamp.findOne({user:req.user.id});

  /** if the user is not an admin,they can only add one bootcamp */
  if(publishedBootcamp&&req.user.role!=="admin"){
    return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`,400));
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});
//@desc Update bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

  /** make sure that updating user is the bootcamp owner or an admin*/
  if(req.user.id!==bootcamp.user.toString()&&req.user.role!=="admin"){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to modify the bootcamp`,401));
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

//@desc delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

   /** make sure that deleting user is the bootcamp owner or an admin */
   if(req.user.id!==bootcamp.user.toString()&&req.user.role!=="admin"){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete the bootcamp`,401));
  }

  bootcamp.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

//@desc Get bootcamps within a radius
//@route DELETE /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  /** get latitude and longitude from geocoder */
  const loc = await geocoder.geocode(zipcode);

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  console.log({ lat, lng });

  /** calculate radius using radians */
  /** divide dist by radius of earth */
  /** earth radius=3963 miles or 6378 km */

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

//@desc upload photo for bootcamp
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private
const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

   /** make sure that deleting user is the bootcamp owner or an admin */
   if(req.user.id!==bootcamp.user.toString()&&req.user.role!=="admin"){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete the bootcamp`,401));
  }

  if(!req.files){
    return next(new ErrorResponse("Please upload a photo",400));
  }

  const file= req.files.file;

  /** make sure the image is a photo */
  if(!file.mimetype.startsWith("image")){
    return next(new ErrorResponse("Please upload an image file",400));
  }

  /** check filesize */
  if(file.size>process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400));
  }

  /** create a custom file name */
  file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`;

  console.log("file name",file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async(err)=>{
    if(err){
      console.log(err);
      return next(new ErrorResponse(`something went wrong while uploading file`,500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name});

    res.status(200).json({ success: true, data:file.name});
  } )

 
});

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
};
