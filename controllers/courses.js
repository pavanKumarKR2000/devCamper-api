const Course = require("../models/Course");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");

//@desc Get courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
//@access Public
const getCourses = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['courses']
  // #swagger.description = 'end point to get all courses'

  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc Get course
//@route GET /api/v1/courses/:id
//@access Public
const getCourse = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['courses']
  // #swagger.description = 'end point to get a course'

  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ success: true, data: course });
});

//@desc Add course
//@route POST /api/v1/bootcamps/:bootcampId/courses
//@access Private
const addCourse = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['courses']
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
  // #swagger.description = 'end point to add a course'

  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.id}`),
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

//@desc Update course
//@route PUT /api/v1/courses/:id
//@access Private
const updateCourse = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['courses']
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
  // #swagger.description = 'end point to update a course'

  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

//@desc Delete course
//@route DELETE /api/v1/courses/:id
//@access Private
const deleteCourse = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['courses']
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
  // #swagger.description = 'end point to delete a bootcamp'

  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
