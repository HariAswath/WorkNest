import {User} from '../models/user.model.js';
import {ApiResponse} from "../utils/api-response.js";
import {ApiError} from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    
    if(existedUser) {
        throw new ApiError(409, "user with this email or username already exists");
    }

    const user = await User.create({
        email,
        username,
        password,
        isEmailVerified: false
    });

    const {unHashedToken, hashedToken , tokenExpiry} = user.generateTemporaryToken();
});