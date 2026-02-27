const router = require("express").Router();
const mechanicController = require("../apis/mechanic/mechanicController");
const multer = require("multer");

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/register", mechanicController.register);
router.post("/login", mechanicController.login);

router.use(require("../middleware/tokenChecker"));


router.post("/change-password", mechanicController.changePassword);
router.post(
  "/update-profile",
  upload.single("certificate"),
  mechanicController.updateProfile
);

// service 
// const serviceController = require("../apis/service/serviceController")
// router.post('/service/add',serviceController.add)
// router.post('/service/update',serviceController.update)

// booking
const bookingController = require("../apis/booking/bookingController")
router.post('/booking/update-status',bookingController.updateStatus)


module.exports = router;
