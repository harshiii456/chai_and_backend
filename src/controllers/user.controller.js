import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async (userId) => {
  try{
    const user = await User.findById(userId);
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return { accessToken, refreshToken };

  }catch(error){
    throw new ApiError(500, "something went wrong while generating refresh and access token");
  }
}

// user registration controller
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  console.log("📩 Incoming registration request:", email);

  // validate input fields
  if ([fullName, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user exists (by username or email)
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // get local file paths from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // avatar is required
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload avatar and coverImage (if provided) to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // create new user
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password, // will be hashed inside User model pre-save hook
    username: username.toLowerCase(),
  });

  // fetch user without password and refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // send success response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    //username or email
    // find user
    //password check 
    //access and refresh token generation
    //send cookies

    const{email, username, password} = req.body

    if(!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    if(!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    })

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "user does not exist or password is incorrect");
    }

    const {accessToken, refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure:true
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200,{
      user: loggedInUser,
      accessToken,
      refreshToken
    }, "User logged in successfully"
    )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)   // ✅ fixed
    .clearCookie("refreshToken", options)  // ✅ fixed
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser,
  loginUser,
  logoutUser
 };
