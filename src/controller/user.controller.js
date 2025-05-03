import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asynchandeler } from "../utils/asyncHandeler.js";
import apiResponse from "../utils/apiResponse.js";

const signUp = asynchandeler(async (req, res, next) => {
  const { name, email, password } = req?.body;

  const user = await User.findOne({email})
  if(user) throw new apiError(500, "user allready exist")

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(newUser._id).select('-password -accessToken');
  if (!createdUser) throw new apiError(500, "could not create user");

  res.status(200).json(new apiResponse(200, createdUser));
});

const generateAccessToke = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(500, "can not find user to generate access token");
  }

  const accessToken = await user.generateAccessToke();
  user.accessToken = accessToken;
  user.save({
    validateBeforeSave: false,
  });

  return accessToken;
};

const logIn = asynchandeler(async (req, res, next) => {
  /**
   * email password
   * check email exist or not then check password
   * if correct
   *      generate access token
   *      store cookie in backend into user document
   *      set cookies
   *      return user
   * else throw error
   *
   */

  const { email, password } = req.body;
  if (!email || password) throw new apiError(500, "enter complete credentials");
  const userInDb = User.findOne({ email });
  if (!(await userInDb.isPasswordCorrecr(password)))
    throw new apiError(403, "incorrect password or email");

  const loggedUser = await User.findById(userInDb._id).select(
    "-accessToken -password"
  );
  if (!loggedUser) throw new apiError(500, "could not find user");

  const accessToken = await generateAccessToke(loggedUser._id);
  if (!accessToken) throw new apiError(500, "something went wrong");

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new apiResponse(200, loggedUser, "user logged in"));
});

const logOut = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select(
    "-accessToken password"
  );
  if (!user) throw new apiError(403, "unauthorized access");

  const response = await user.updateOne({
    $set: {
      accessToken: null,
    },
  });
  if (!response) {
    throw new apiError(500, "something went wrong");
  }

  optinos = {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(200, user, "logged out");
});

export { signUp, logIn, logOut };
