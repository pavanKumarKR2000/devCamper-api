const express = require("express");
const router = express.Router();
const {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp=require("../models/Bootcamp");
const advancedResults=require("../middlewares/advancedResults")

/** include other resource routers */
const courseRouter = require("./courses");
const reviewRouter=require("./reviews");
/** protect middleware */
const {protect,authorize}=require("../middlewares/auth");

/** re-route into other resource routers */
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
 .route("/radius/:zipcode/:distance")
 .get(getBootcampsInRadius);

router
.route("/")
.get(advancedResults(Bootcamp,"courses"),getBootcamps)
.post(protect,authorize("publisher","admin"),createBootcamp);
 
router
.route("/:id/photo")
.put(protect,authorize("publisher","admin"),bootcampPhotoUpload);


router
  .route("/:id")
  .get(getBootcamp)
  .put(protect,authorize("publisher","admin"),updateBootcamp)
  .delete(protect,authorize("publisher","admin"),deleteBootcamp);

module.exports = router;
