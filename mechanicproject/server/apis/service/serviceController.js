const Service = require("../service/serviceModal");

const add = (req, res) => {
  let validationErrors = [];

  if (!req.body.title) validationErrors.push("title is required");
  if (!req.body.description) validationErrors.push("description is required");
  if (!req.body.price) validationErrors.push("price is required");
  if (!req.body.duration) validationErrors.push("duration is required");
  if (req.body?.type !== "commercial" && req.body?.type !== "private") {
    return res.send({
      success: false,
      message: "type must be 'commercial' or 'private'",
    });
  }

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  const newService = new Service({
    addedById: req.user?._id,
    title: req.body?.title,
    description: req.body?.description,
    price: req.body?.price,
    duration: req.body?.duration,
    type: req?.body?.type,
  });

  newService
    .save()
    .then(() => {
      return res.send({
        success: true,
        message: "service added successfully",
        data: newService,
      });
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const update = (req, res) => {
  let validationErrors = [];

  if (!req.body._id) validationErrors.push("_id is required");
  if (!req.body.title) validationErrors.push("title is required");
  if (!req.body.description) validationErrors.push("description is required");
  if (!req.body.price) validationErrors.push("price is required");
  if (!req.body.duration) validationErrors.push("duration is required");
  if (req.body?.type !== "commercial" && req.body?.type !== "private") {
    return res.send({
      success: false,
      message: "type must be 'commercial' or 'private'",
    });
  }

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Service.findOne({ _id: req?.body?._id })
    .then((service) => {
      if (!service) {
        return res.send({ success: false, message: "service not found" });
      }

      service._id = req.body?._id;
      service.title = req.body?.title;
      service.description = req.body?.description;
      service.price = req.body?.price;
      service.duration = req?.body?.duration;
      service.type = req?.body?.type;

      return service;
    })
    .then((service) => {
      service.save().then(() => {
        return res.send({
          success: true,
          message: "service updated!",
          data: service,
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

  Service.findOne({ _id: req.body?._id })
    .then((service) => {
      if (!service) {
        return res.send({ success: false, message: "Service not found" });
      } else {
        return res.send({
          success: true,
          message: "service found successfully ",
          data: service,
        });
      }
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

const all = (req, res) => {
  Service.find({ ...req?.body })
    .then((services) => {
      return res.send({
        success: true,
        message: "Service get",
        data: services,
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

const deleteService = (req, res) => {
  let validationErrors = [];

  if (!req.body._id) validationErrors.push("_id is required");

  if (validationErrors.length > 0) {
    return res.send({ success: false, status: 400, message: validationErrors });
  }

  Service.findOne({ _id: req.body?._id })
    .then(async (service) => {
      if (!service) {
        return res.send({ success: false, message: "Service not found" });
      } else {
        await service.deleteOne();
        return res.send({
          success: true,
          message: "service deleted successfully ",
        });
      }
    })
    .catch((err) => {
      return res.send({ success: false, status: 500, message: err.message });
    });
};

module.exports = { add, single, update, all, deleteService };
