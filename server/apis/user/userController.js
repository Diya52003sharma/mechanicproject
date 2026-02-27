const User = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bookingModal = require("../booking/bookingModal");
const mechanicModal = require("../mechanic/mechanicModal");
const vehicleModal = require("../vehicle/vehicleModal");
const serviceModal = require("../service/serviceModal");
const Customer = require("../customer/customerModal");
const secret = "abc@123";

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
    res.send({
      success: false,
      status: 422,
      message: "Validation Error" + validationError,
    });
  } else {
    await User.findOne({ email: req.body.email })
      .then((userData) => {
        if (!userData) {
          res.send({
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
              res.send({
                success: true,
                status: 200,
                message: "Login Successfully",
                data: userData,
                token: token,
              });
            } else {
              res.send({
                success: false,
                status: 400,
                message: "Invalid Password",
              });
            }
          } else {
            res.send({
              success: false,
              status: 400,
              message: "Your Account is blocked Please contact admin",
            });
          }
        }
      })
      .catch((err) => {
        res.send({
          success: false,
          status: 400,
          message: err.message,
        });
      });
  }
};

const updateStatus = async (req, res) => {
  let validationError = "";
  if (!req.body._id) {
    validationError += " _id is required ";
  }
  if (!req.body.status?.toString()) {
    validationError += " status is required ";
  }
  if (validationError) {
    res.send({
      success: false,
      status: 422,
      message: "Validation Error" + validationError,
    });
  }

  User.findOne({ _id: req.body?._id }).then((user) => {
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    } else {
      user.status = req.body?.status;

      user.save().then(() => {
        return res.send({
          success: true,
          message: "user status updated",
          data: user,
        });
      });
    }
  });
};


const Dashboard = async(req,res)=>{
  if(true) {

    totalBookings = await bookingModal.countDocuments({});
    totalServices = await serviceModal.countDocuments({});
    totalMechanics = await mechanicModal.countDocuments({isApproved:true});
    totalCustoemers = await Customer.countDocuments({});
    totalVehicles = await vehicleModal.countDocuments({});

    return res.status(200).send({
      message:'Dashboard Loaded',
      success:true,
      totalBookings:totalBookings, 
      totalServices:totalServices,
      totalMechanics:totalMechanics,
      totalCustomers:totalCustoemers,
      totalVehicles:totalVehicles
    })
  } else {

  }
}

module.exports = {
  login,
  updateStatus,
  Dashboard
};
