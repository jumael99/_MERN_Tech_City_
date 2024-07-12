import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModel.js'
import * as console from "node:console";
import jwt from "jsonwebtoken";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler( async (req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email} );

    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1ds'
        });

        // Set JWT as HTTP-Only cookie
        res.cookie('jwt', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(401);
        throw new error('Invalid email or password')
    }

});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler( async (req,res) => {
    res.send('auth user');
});

// @desc    Logout user & clear cookie
// @route   POST /api/users
// @access  Private
const logoutUser = asyncHandler( async (req,res) => {
    res.send('logout user');
});


// @desc    Get User profile
// @route   Get /api/users/profile
// @access  Private
const getUserProfile = asyncHandler( async (req,res) => {
    res.send('get user profile');
});

// @desc    Update User profile, will update it with token
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler( async (req,res) => {
    res.send('update user profile');
});

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler( async (req,res) => {
    res.send('update user profile');
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler( async (req,res) => {
    res.send('get user By id');
});

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler( async (req,res) => {
    res.send('delete user');
});

// @desc    Update users
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler( async (req,res) => {
    res.send('delete user');
});

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    logoutUser
}