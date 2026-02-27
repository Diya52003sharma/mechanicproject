const router = require("express").Router();
const customerController = require("../apis/customer/customerController");
const multer = require("multer");
const vechicleController = require("../apis/vehicle/vehicleController")


const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzzlrvdsy",
  api_key: "248254378685488",
  api_secret: "WBWwbcJB_QfkU1TsuWS32qY4kf8",
});

router.post("/register", customerController.register);
router.post("/login", customerController.login);



const storage = multer.memoryStorage(); // Store file in memory
const profileUpload = multer({ storage });

router.use(require("../middleware/tokenChecker"));

router.post(
  "/update",
  customerController.update
);
router.post("/change-password", customerController.changePassword);
router.post("/permanent-delete", customerController.permanentDelete);



// vehicle
router.post('/vehicle/add',vechicleController.add)
router.post('/vehicle/update',vechicleController.update)
router.post('/vehicle/change-status',vechicleController.changeStatus)
router.post('/vehicle/delete',vechicleController.deleteVehicle)



// booking
const bookingController = require('../apis/booking/bookingController')

router.post('/booking/add',bookingController.add)
router.post("/request/pay", bookingController.pay)


module.exports = router;

