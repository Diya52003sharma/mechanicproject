const router = require("express").Router();
const mechanicController = require("../apis/mechanic/mechanicController");
const customerController = require("../apis/customer/customerController");
const vehicleController = require("../apis/vehicle/vehicleController");
const serviceController = require("../apis/service/serviceController");
const bookingController = require("../apis/booking/bookingController");

// mechanic
router.post("/mechanic/single", mechanicController.single);
router.post("/mechanic/all", mechanicController.all);

// customer
router.post("/customer/all", customerController.all);
router.post("/customer/single", customerController.single);

// vehicle
router.post("/vehicle/single", vehicleController.single);
router.post("/vehicle/all", vehicleController.all);

// service
router.post("/service/single", serviceController.single);
router.post("/service/all", serviceController.all);

// booking
router.post("/booking/single", bookingController.single);
router.post("/booking/all", bookingController.all);

// invoicd
router.post("/invoice/single", bookingController.singleInvoice);
router.post("/invoice/all", bookingController.getAllInvoice);

router.post('/booking/updateFeedback',bookingController.updateFeedback);

module.exports = router;
