const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc Get all users
// @route POST /api/v1/auth/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['users']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
 // #swagger.description = 'end point to get all users'
            
    res.status(200).json(res.advancedResults);
});

// @desc Get single user
// @route GET /api/v1/auth/users/:id
// @access Private/Admin
const getUser = asyncHandler(async (req, res, next) => {
     // #swagger.tags = ['users']
     /* #swagger.security = [{
            "bearerAuth": []
    }] */
  // #swagger.description = 'end point to get an user'

    const user=await User.findById(req.params.id);
    res.status(200).json({
        success:true,
        data:user
    });
});

// @desc Create user
// @route POST /api/v1/auth/users
// @access Private/Admin
const createUser = asyncHandler(async (req, res, next) => {
     // #swagger.tags = ['users']
     /* #swagger.security = [{
            "bearerAuth": []
    }] */
 // #swagger.description = 'end point to create an user'

    const user=await User.create(req.params.id);
    res.status(201).json({
        success:true,
        data:user
    });
});

// @desc Update user
// @route PUT /api/v1/auth/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
     // #swagger.tags = ['users']
     /* #swagger.security = [{
            "bearerAuth": []
    }] */
   // #swagger.description = 'end point to update an user'

    const user=await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        success:true,
        data:user
    });
});

// @desc Delete user
// @route DELETE /api/v1/auth/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
     // #swagger.tags = ['users']
     /* #swagger.security = [{
            "bearerAuth": []
    }] */
 // #swagger.description = 'end point to delete an user'

    await User.findByIdAndUpdate(req.params.id);
    res.status(200).json({
        success:true,
        data:{}
    });
});

module.exports={getUsers,getUser,createUser,updateUser,deleteUser};