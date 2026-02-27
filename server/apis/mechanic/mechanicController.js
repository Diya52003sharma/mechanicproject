const User = require("../user/userModel");
const bcrypt = require("bcrypt");
const Mechanic = require("./mechanicModal");
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../../utilities/helper");
const secret = "abc@123";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzzlrvdsy",
  api_key: "248254378685488",
  api_secret: "WBWwbcJB_QfkU1TsuWS32qY4kf8",
});

const register = (req, res) => {
  let validationErrors = [];

  if (!req.body.name) validationErrors.push("Name is required");
  if (!req.body.email) validationErrors.push("Email is required");
  if (!req.body.password) validationErrors.push("Password is required");
  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  User.findOne({ email: req.body.email })
    .then(async (userData) => {
      if (userData) {
        return res.send({
          success: false,
          status: 409,
          message: "Email Already Exists",
        });
      }

      let userCount = await User.countDocuments();

      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        autoId: userCount + 1,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        userType: 2, // Mechanic
      });

      newUser.save().then((savedUser) => {

        Mechanic.countDocuments().then((totalMechanics) => {

          const newMechanic = new Mechanic({
            autoId: totalMechanics + 1,
            userId: savedUser._id,
          });

          newMechanic.save().then((saved) => {
            return res.send({
              success: true,
              status: 201,
              message: "Mechanic Registered Successfully",
              data: newMechanic,
            });
          });
        }).catch((err) => {
          return res.send({ success: false, status: 500, message: err.message });
        });
      }).catch((err) => {
        return res.send({ success: false, status: 500, message: err.message });
      });

    }).catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const login = async (req, res) => {
  let validationError = "";
  if (!req.body.email) {
    validationError += " email is required ";
  }
  if (!req.body.password) {
    validationError += " password is required ";
  }
  if (!!validationError) {
    return res.send({
      success: false,
      status: 422,
      message: "Validation Error" + validationError,
    });
  } else {
    await User.findOne({ email: req.body.email })
      .then((userData) => {
        if (!userData) {
          return res.send({
            success: false,
            status: 404,
            message: "User Does not exist",
          });
        } else {
          if (userData.status == true) {
            var isMatch = bcrypt.compareSync(
              req.body.password,
              userData.password
            );
            if (isMatch) {
              let payload = {
                _id: userData._id,
                name: userData.name,
                userType: userData.userType,
                email: userData.email,
              };

              let token = jwt.sign(payload, secret);
              return res.send({
                success: true,
                status: 200,
                message: "Login Successfully",
                data: userData,
                token: token,
              });
            } else {
              return res.send({
                success: false,
                status: 400,
                message: "Invalid Password",
              });
            }
          } else {
            return res.send({
              success: false,
              status: 400,
              message: "Your Account is blocked Please contact admin",
            });
          }
        }
      })
      .catch((err) => {
        return res.send({
          success: false,
          status: 400,
          message: err.message,
        });
      });
  }
};

const single = (req, res) => {
  let validationErrors = [];
  if (!req.body._id) validationErrors.push("_id is required");
  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Mechanic.findOne({ userId: req.body?._id })
    .populate("services.serviceId")
    .then((mechanic) => {
      if (!mechanic)
        return res.send({ success: false, message: "mechanic not found" });
      else
        return res.send({
          success: true,
          message: "mechanic found",
          data: mechanic,
        });
    });
};

const changePassword = (req, res) => {
  let validationErrors = [];

  if (!req.body.oldPassword) validationErrors.push("Old password is required");
  if (!req.body.newPassword) validationErrors.push("New password is required");
  if (!req.body.confirmPassword)
    validationErrors.push("Confirm password is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  User.findOne({ _id: req.user?._id })
    .then((user) => {
      if (!user) throw new Error("user not found");

      return bcrypt
        .compare(req.body.oldPassword, user.password)
        .then((isMatch) => {
          if (!isMatch) throw new Error("Incorrect Password");
          if (req.body.newPassword !== req.body.confirmPassword)
            throw new Error("Passwords do not match");

          return bcrypt
            .hash(req.body.newPassword, 10)
            .then((hashedPassword) => {
              user.password = hashedPassword;
              return user.save();
            });
        });
    })
    .then((user) => {
      return res.send({
        success: true,
        status: 200,
        message: "Password changed Successfully",
        data: user,
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const all = (req, res) => {
  Mechanic.find({ ...req?.body })
    .populate("services.serviceId", 'title')
    .then((mechanics) => {
      return res.send({
        success: true,
        message: "Mechanics Loaded",
        data: mechanics,
      });
    });
};

const updateProfile = (req, res) => {
  let validationErrors = [];

  if (!req.body.shopName) validationErrors.push(" shopName is required");
  if (!req.body.ownerName) validationErrors.push(" ownerName is required");
  if (!req.body.type) validationErrors.push(" type is required");
  if (!req.body.contactNo) validationErrors.push(" contactNo is required");
  if (!req.body.services?.length)
    validationErrors.push(" services is required");
  if (!req.body.specialization)
    validationErrors.push(" specialization is required");
  if (req.body.type == "commercial" && req.body.type == "private")
    validationErrors.push(" type 'commercial' or 'private' is required");
  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  User.findOne({ _id: req.user?._id }).then(async (user) => {
    if (!user) {
      return res.send({ success: false, message: "user not found" });
    } else {
      console.log("-");
      console.log("-");
      console.log("-");
      console.log("-");
      console.log("-");
      console.log(req?.body?.services);
      console.log(req?.body?.ownerName);
      console.log(req?.body?.address);
      console.log(req?.body?.type);
      console.log(req?.body?.contactNo);
      console.log(req?.body?.shopCertificate);
      console.log("-");

      if (req?.body?.name) {
        user.name = req?.body?.name;
        await user.save();
      }
      Mechanic.findOne({ userId: user?._id }).then(async (mechanic) => {
        // if certificate then upload in cloudinary
        let certificateUrl;
        if (req.file) {
          certificateUrl = await uploadImage(req.file.path);
        }

        if (!mechanic) {
          if (!req.file)
            return res.send({
              success: false,
              message: "certificate is required",
            });

          const newMechanic = new Mechanic({
            shopName: JSON.parse(req.body?.shopName),
            ownerName: JSON.parse(req.body?.ownerName),
            address: JSON.parse(req.body?.address),
            type: JSON.parse(req.body?.type),
            contactNo: JSON.parse(req.body?.contactNo),
            shopCertificate: certificateUrl,
            specialization: JSON.parse(req.body?.specialization),
            services: JSON.parse(req.body?.services),
            shopCertificate: certificateUrl
          });

          newMechanic.save().then(() => {
            return res.send({
              success: true,
              message: "profile updated",
              data: newMechanic,
            });
          });
        } else {
          mechanic.shopName = JSON.parse(req.body?.shopName);
          mechanic.ownerName = JSON.parse(req.body?.ownerName);
          mechanic.address = JSON.parse(req.body?.address);
          mechanic.type = JSON.parse(req.body?.type);
          mechanic.contactNo = JSON.parse(req.body?.contactNo);
          mechanic.shopCertificate = certificateUrl;
          mechanic.specialization = JSON.parse(req.body?.specialization);
          mechanic.services = JSON.parse(req.body?.services);

          mechanic.save().then(() => {
            return res.send({
              success: true,
              message: "profile updated",
              data: mechanic,
            });
          });
        }
      });
    }
  });
};

const deleteMechanic = (req, res) => {
  let validationErrors = [];
  if (!req.body._id) validationErrors.push("_id is required");
  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Mechanic.findOne({ _id: req.body?._id })
    .then((mechanic) => {
      if (!mechanic)
        return res.send({ success: false, message: "mechanic not found" });
      else
        User.findOne({ _id: mechanic?.userId }).then(async (user) => {
          await mechanic.deleteOne();
          await user.deleteOne();

          return res.send({ success: true, message: "mechanic deleted!" });
        });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};


const updateStatus = (req, res) => {
  const formData = req.body;
  if (!formData._id) {
    return res.send({ success: false, message: "Mechanic ID required" });
  } else {
    Mechanic.findOne({ userId: req.body?._id })
      .then((mechanic) => {
        if (!mechanic)
          return res.send({ success: false, message: "Mechanic not found" });
        else

          mechanic.isApproved = formData.approved ?? false;
        mechanic.save().then(async (user) => {
          return res.send({ success: true, message: "Mechanic Status Updated" });

        });
      })
      .catch((err) => {
        return res.send({ success: false, status: 500, message: err.message });
      });

  }
}

module.exports = {
  register,
  single,
  changePassword,
  login,
  updateProfile,
  all,
  deleteMechanic,
  updateStatus
};
