import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asynchandeler } from "../utils/asyncHandeler.js";
import apiResponse from "../utils/apiResponse.js";

const signUp = asynchandeler(async (req, res, next) => {
  const { name, email, password } = req?.body;

  const user = await User.findOne({ email });
  if (user) throw new apiError(500, "user allready exist");

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(newUser._id)
  if (!createdUser) throw new apiError(500, "could not create user");
  
  const accessToken = await generateAccessToke(createdUser?._id);
  if (!accessToken) throw new apiError(500, "something went wrong");

  const loggedUser = await User.findById(createdUser._id).select("-password");
  if (!loggedUser) throw new apiError(500, "could not find user");


  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new apiResponse(200, loggedUser, "User Created"));
});

const generateAccessToke = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(500, "can not find user to generate access token");
  }

  const accessToken = await user.generateAccessToken();
  user.accessToken = accessToken;
  await user.save({
    validateBeforeSave: false,
  });

  return accessToken;
};

const logIn = asynchandeler(async (req, res, next) => {
  const { email, password } = req?.body;
  if (!email || !password)
    throw new apiError(500, "enter complete credentials");
  const userInDb = await User.findOne({ email });
  if (!userInDb) throw new apiError(500, "no user registered");
  if (!(await userInDb.isPasswordCorrect(password)))
    throw new apiError(403, "incorrect password or email");

  const loggedUser = await User.findById(userInDb._id).select(" -password");
  if (!loggedUser) throw new apiError(500, "could not find user");

  const accessToken = await generateAccessToke(loggedUser?._id);
  if (!accessToken) throw new apiError(500, "something went wrong");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new apiResponse(200, loggedUser, "user logged in"));
});

const logOut = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  if (!user) throw new apiError(403, "unauthorized access");

  const response = await user.updateOne({
    $set: {
      accessToken: null,
    },
  });
  if (!response) {
    throw new apiError(500, "something went wrong");
  }
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(200, user, "logged out");
});

const updateUser = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new apiError(403, "unauthorized access");

  const userToUpdate = await User.findById(user._id);
  const { name, email, password } = req?.body;
  if(!(userToUpdate.email == email)) {
    throw new apiError(500, "Could Not Update User, Try Logging In Again")
  }
  userToUpdate.name = name;
  userToUpdate.email = email;
  password && (userToUpdate.password = password) ;
  await userToUpdate.save();

  const updatedUser = await User.findById(userToUpdate._id).select(
    "-password -accessToken"
  );

  if (!updatedUser) throw new apiError(500, "could not update user");
  res.status(200).json(new apiResponse(200, updatedUser, "user updated"));
});

const getAllUsers = asynchandeler(async (req, res, next) => {
  const users = await User.find({});
  if (!users) throw new apiError(400, "no users");
  res.status(200).json(new apiResponse(200, users, "all users"));
});

export { signUp, logIn, logOut, updateUser, getAllUsers };
