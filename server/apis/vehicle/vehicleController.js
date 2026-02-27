const Vehicle = require("../vehicle/vehicleModal");

const add = (req, res) => {
  let validationErrors = [];

  if (!req.body.userId) validationErrors.push("userId is required");
  if (!req.body.manufacturingName)
    validationErrors.push("manufacturingName is required");
  if (!req.body.modelName) validationErrors.push("modelName is required");
  if (!req.body.modelYear) validationErrors.push("modelYear is required");
  if (!req.body.ownerName) validationErrors.push("ownerName is required");
  if (!req.body.RTONo) validationErrors.push("RTONo is required");
  if (req.body?.type !== "commercial" && req.body?.type !== "private") {
    return res.send({
      success: false,
      message: "type must be 'commercial' or 'private'",
    });
  }

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  const newVehicle = new Vehicle({
    addedById: req.body?.userId,
    manufacturingName: req.body?.manufacturingName,
    modelName: req.body?.modelName,
    modelYear: req.body?.modelYear,
    ownerName: req.body?.ownerName,
    RTONo: req.body?.RTONo,
    type: req?.body?.type,
  });

  newVehicle
    .save()
    .then(() => {
      return res.send({
        success: true,
        message: "vehicle added successfully",
        data: newVehicle,
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

  Vehicle.findOne({ _id: req.body?._id })
    .then((vehicle) => {
      if (!vehicle) {
        return res.send({ success: false, message: "Vehicle not found" });
      } else {
        return res.send({
          success: true,
          message: "vehicle found successfully ",
          data: vehicle,
        });
      }
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const update = (req, res) => {
  let validationErrors = [];

  if (!req.body._id) validationErrors.push("_id is required");
  if (!req.body.manufacturingName)
    validationErrors.push("manufacturingName is required");
  if (!req.body.modelName) validationErrors.push("modelName is required");
  if (!req.body.modelYear) validationErrors.push("modelYear is required");
  if (!req.body.ownerName) validationErrors.push("ownerName is required");
  if (!req.body.RTONo) validationErrors.push("RTONo is required");
  if (req.body?.type !== "commercial" && req.body?.type !== "private") {
    return res.send({
      success: false,
      message: "type must be 'commercial' or 'private'",
    });
  }

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Vehicle.findOne({ _id: req?.body?._id })
    .then((vehicle) => {
      if (!vehicle) {
        return res.send({ success: false, message: "vehicle not found" });
      }

      vehicle.manufacturingName = req.body?.manufacturingName;
      vehicle.modelName = req.body?.modelName;
      vehicle.modelYear = req.body?.modelYear;
      vehicle.ownerName = req.body?.ownerName;
      vehicle.RTONo = req.body?.RTONo;
      vehicle.type = req?.body?.type;

      return vehicle;
    })
    .then((vehicle) => {
      vehicle.save().then(() => {
        return res.send({
          success: true,
          message: "vehicle updated!",
          data: vehicle,
        });
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const changeStatus = (req, res) => {
  let validationErrors = [];

  if (!req.body._id) validationErrors.push("_id is required");
  if (req.body.status !== true && req.body.status !== false)
    validationErrors.push("status is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Vehicle.findOne({ _id: req.body?._id })
    .then(async (vehicle) => {
      if (!vehicle) {
        return res.send({ success: false, message: "Vehicle not found" });
      } else {
        vehicle.status = req.body?.status;

        await vehicle.save().then(() => {
          return res.send({
            success: true,
            message: "vehicle status changed ",
            data: vehicle,
          });
        });
      }
    })
    .catch((err) => {
      return res.send({
        success: false,
        status: 500,
        message: err.message,
      });
    });
};

const all = (req, res) => {
  Vehicle.find({ ...req.body})
    .then((vehicles) => {
      return res.send({
        success: true,
        message: "Vehicles Fetch Successfully",
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

const deleteVehicle = (req, res) => {
  let validationErrors = [];

  if (!req.body._id) validationErrors.push("_id is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Vehicle.findOne({ _id: req.body?._id })
    .then(async (vehicle) => {
      if (!vehicle) {
        return res.send({ success: false, message: "Vehicle not found" });
      } else {
        await vehicle.deleteOne();
        return res.send({ success: true, message: "Vehicle  deleted" });
      }
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

module.exports = { add, single, update, changeStatus, all, deleteVehicle };
