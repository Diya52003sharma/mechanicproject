const Booking = require("../booking/bookingModal");
const mechanicModal = require("../mechanic/mechanicModal");
const Services = require("../service/serviceModal");
const mongoose = require('mongoose');
const Razorpay = require("razorpay");
require('dotenv').config();

const add = async(req, res) => {
  console.log(req.body);
  let validationErrors = [];

  if (!req.body.services?.length) validationErrors.push("Services is required");
  if (!req.body.appointmentDate)
    // array of services idvalidationErrors.push("services is required");
    validationErrors.push("appointmentDate is required");
  if (!req.body.mechanicId) validationErrors.push("mechanicId is required");
  if (!req.body.vehicleId) validationErrors.push("vehicleId is required");
  if (!req.body.customerId) validationErrors.push("customerId is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  let servicesId = await req.body?.services.map(id => new mongoose.Types.ObjectId(id));

  mechanicModal.findOne({_id:req.body.mechanicId}).then(async(profile) => {
    if(profile) {
      let services = profile.services;
      let total = services.reduce((total, service) => {
        
        if (servicesId.some(id => id.equals(service.serviceId))) {
          console.log(service, '\nprint');
          return total + (service?.price || 0);
        }
        return total;
      }, 0);
    
      total = total + total * 0.18;
      console.log('Total with GST:', total);
      console.log(req.body.mechanicId);
  
      const newBooking = new Booking({
        allServices: req.body.services,
        appointmentDate: req.body?.appointmentDate,
        mechanicId: req.body?.mechanicId,
        vehicleId: req.body?.vehicleId,
        customerId: req.body?.customerId,
        totalWithGST: total,
      });
      newBooking.mechanicId = req.body.mechanicId;
  
      newBooking
        .save()
        .then(() => {
          return res.send({
            success: true,
            message: "booking added successfully",
            data: newBooking,
          });
        })
        .catch((err) => {
          return res.send({ success: false, status: 500, message: err.message });
        });

    } else {
      
    }
  });
};

const updateStatus = (req, res) => {
  let validationErrors = [];

  if (!req.body._id) validationErrors.push("_id is required");
  if (!req.body.bookingStatus)
    validationErrors.push("bookingStatus is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Booking.findOne({ _id: req?.body?._id })
    .then((booking) => {
      if (!booking) {
        return res.send({ success: false, message: "booking not found" });
      }

      booking.bookingStatus = req.body.bookingStatus;

      return booking;
    })
    .then((booking) => {
      booking.save().then(() => {
        return res.send({
          success: true,
          message: "booking updated!",
          data: booking,
        });
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const single = (req, res) => {
  let validationErrors = [];

  if (!req.body._id) validationErrors.push("_id is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Booking.findOne({ _id: req.body?._id })
    .populate("mechanicId")
    .populate("vehicleId")
    .populate("customerId")
    .populate("allServices")
    .then((booking) => {
      if (!booking) {
        return res.send({ success: false, message: "Booking not found" });
      } else {
        return res.send({
          success: true,
          message: "booking found successfully ",
          data: booking,
        });
      }
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const all = (req, res) => {
  console.log(req.body);
  Booking.find({ ...req?.body })
    .populate("mechanicId")
    .populate("vehicleId")
    // .populate("customerId")
    .populate({
      path: "customerId",
      populate: {
        path: "userId",
        model: "user", // Make sure this matches your user model name
      },
    })
    .then((vehicles) => {
      return res.send({
        success: true,
        message: "Booking get",
        data: vehicles,
      });
    })
    .catch((err) => {
      return res.send({
        success: false,
        status: 500,
        message: err.message,
      });
    });
};

// single invoice

const singleInvoice = (req, res) => {
  let validationErrors = [];

  if (!req.body._id) validationErrors.push("_id is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Booking.findOne({ _id: req.body?._id })
    .populate("mechanicId")
    .populate("vehicleId")
    .populate("customerId")
    .populate("allServices")
    .then((booking) => {
      return res.send({ success: true, message: "invoice get", data: booking });
    })
    .catch((err) => {
      return res.send({
        success: false,
        status: 500,
        message: err.message,
      });
    });
};

const getAllInvoice = (req, res) => {
  Booking.find({ ...req.body })
    .populate("mechanicId")
    .populate("vehicleId")
    .populate("customerId")
    .populate("allServices")
    .then((booking) => {
      return res.send({ success: true, message: "invoice get", data: booking });
    })
    .catch((err) => {
      return res.send({
        success: false,
        status: 500,
        message: err.message,
      });
    });
};

const updateFeedback = (req,res)=>{
  const formData = req.body;
  if(!formData._id) {
    return res.send({ success: false, message: "Booking Id Required", });
  } else if(!formData.userType) {
    return res.send({ success: false, message: "userType Required", });
  } else if (!formData.feedback) {
    return res.send({ success: false, message: "feedback required"});
  } else {
      Booking.findOne({_id:formData._id}).then((booking)=>{
        if(formData.userType==2) {
          booking.mechanicFeedback = formData.feedback;
        }

        if(formData.userType==3) {
          booking.customerFeedback = formData.feedback;
        }
        
        booking.save().then((saved)=>{
          return res.send({
            success: true,
            status: 200,
            message: 'Feedback Added Successfully',
            data:saved
          });
        }).catch((err)=>{
          return res.send({
            success: false,
            status: 500,
            message: err.message,
          });  
        })


      }).catch(err=>{
        return res.send({
          success: false,
          status: 500,
          message: err.message,
        });
      })
  }
}

const pay = async (req, res) => {
  try {
      const { _id } = req.body;

      if (!_id) {
          return res.status(400).json({
              success: false,
              message: "_id is required."
          });
      }

      const r = await Booking.findById(_id);
      if (!r) {
          return res.status(404).json({
              success: false,
              message: "Request not found."
          });
      }

      const razorpay = new Razorpay({
          key_id: process.env.KEY_ID,
          key_secret: process.env.API_SECRET
      });

      const options = {
          amount: r.totalWithGST * 100, 
          currency: "INR",
          receipt: "receipt_order_" + Date.now()
      };

      const order = await razorpay.orders.create(options);

      r.paymentDone = true;
      r.transactionDetail = order.id;
      r.paymentAt = Date.now();

      await r.save();

      return res.status(200).json({
          success: true,
          message: "Razorpay order created",
          order,
          totalAmount: r.totalWithGST
      });

  } catch (err) {
      console.error(" Razorpay Error:", err);
      return res.status(500).json({
          success: false,
          message: err.message || "Server error occurred"
      });
  }
};
module.exports = {
  add,
  single,
  all,
  updateStatus,
  singleInvoice,
  getAllInvoice,
  updateFeedback,
  pay
};
