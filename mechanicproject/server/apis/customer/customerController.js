const Customer = require("./customerModal");
const User = require("../user/userModel");
const bcrypt = require("bcrypt");
const { uploadImg } = require("../../utilities/helper");
const jwt = require("jsonwebtoken");
const secret = "abc@123";

const register = (req, res) => {
  let validationErrors = [];
  if (!req.body.name) validationErrors.push("Name is required");
  if (!req.body.email) validationErrors.push("Email is required");
  if (!req.body.password) validationErrors.push("Password is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  User.findOne({ email: req.body.email })
    .then((userData) => {
      if (userData) {
        return res.send({
          success: false,
          status: 409,
          message: "Email Already Exists",
        });
      }
      return User.countDocuments();
    })
    .then(async (totalUsers) => {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      let totalCustomers= await Customer.countDocuments()
      const newUser = new User({
        autoId: totalCustomers + 1,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        userType: 3, // customer
      });
      return newUser.save();
    })
    .then((savedUser) => {
      const newCustomer = new Customer({
        userId: savedUser._id,
        name: req.body?.name,
      });
      return newCustomer.save().then((savedCustomer) => {
        savedUser.customerId = savedCustomer._id;
        return savedUser.save().then(() => savedCustomer);
      });
    })
    .then((savedCustomer) => {
      return res.send({
        success: true,
        status: 201,
        message: "Customer Registered Successfully",
        data: savedCustomer,
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const login = async (req, res) => {
  console.log(req.body);
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

const update = (req, res) => {
  let validationErrors = [];

  if (!req.body.name) validationErrors.push("name is required");
  if (!req.body.contactNo) validationErrors.push("contactNo is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Customer.findOne({ userId: req.user?._id })
    .then((customerData) => {
      if (!customerData) throw new Error("Customer not found");

      return customerData;
    })
    .then((customerData) => {
      if (req.body.contactNo) customerData.contactNo = req.body.contactNo;

      return customerData.save();
    })
    .then(async (customerData) => {
      const user = await User.findOne({ _id: customerData?.userId });
      user.name = req.body?.name;
      user.save().then(() => {
        return res.send({
          success: true,
          message: "profile is updated",
          data: customerData,
        });
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const all = (req, res) => {
  Customer.find(req.body)
    .populate("userId")
    .then((customers) =>
      Customer.countDocuments(req.body).then((total) => ({ customers, total }))
    )
    .then(({ customers, total }) => {
      return res.send({
        status: 200,
        success: true,
        message: "customers Loaded Successfully",
        total,
        data: customers,
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const single = (req, res) => {
  if (!req.body._id) {
    return res.send({
      success: false,
      status: 400,
      message: "_id is required",
    });
  }

  Customer.findOne({ userId: req.body._id })
    // .populate("userId")
    .then((customerData) => {
      console.log(customerData);
      if (!customerData) {
        throw new Error("Customer not found");
      }

      return res.send({
        status: 200,
        success: true,
        message: "Customer Loaded Successfully",
        data: customerData,
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const changeStatus = (req, res) => {
  let validationErrors = [];
  if (!req.body._id) validationErrors.push("_id is required");
  if (req.body.status !== false && req.body.status !== true)
    validationErrors.push("Status is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Customer.findOne({ userId: req.body._id })
    .then((customerData) => {
      if (!customerData) throw new Error("Customer not found");

      customerData.status = req.body.status;
      return customerData.save();
    })
    .then((updateCustomer) => {
      return User.findOne({ _id: req.body._id }).then((userData) => {
        if (!userData) throw new Error("User not found");

        userData.status = req.body.status;
        return userData
          .save()
          .then((updatedUser) => ({ updateCustomer, updatedUser }));
      });
    })
    .then(({ updateCustomer, updatedUser }) => {
      return res.send({
        success: true,
        status: 200,
        message: "Status Updated Successfully",
        data: { updateCustomer, updatedUser },
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
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
      if (!user) throw new Error("Customer not found");

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

const permanentDelete = (req, res) => {
  if (!req.body._id) {
    return res.send({
      status: 400,
      success: false,
      message: "_id is required",
    });
  }

  Customer.findOne({ _id: req.body?._id })
    .then((customer) => {
      if (!customer)
        return res.send({ success: false, message: "customer not found" });
      else
        User.findOne({ _id: customer?.userId }).then(async (user) => {
          await customer.deleteOne();
          await user.deleteOne();

          return res.send({ success: true, message: "customer deleted!" });
        });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

module.exports = {
  register,
  login,
  update,
  all,
  single,
  changeStatus,
  permanentDelete,
  changePassword,
};
