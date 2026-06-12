const router = require("express").Router();
const userController = require("../apis/user/userController");
const mechanicController = require("../apis/mechanic/mechanicController");
const customerController = require("../apis/customer/customerController");

router.use(require("../middleware/tokenChecker"));

router.post("/user/update-status", userController.updateStatus);
router.post("/dashboard", userController.Dashboard);

// service
const serviceController = require("../apis/service/serviceController");
router.post("/service/add", serviceController.add);
router.post("/service/update", serviceController.update);

router.post("/mechanic/delete", mechanicController.deleteMechanic);
router.post("/mechanic/updateStatus", mechanicController.updateStatus);
router.post("/customer/delete", customerController.permanentDelete);
router.post("/service/delete", serviceController.deleteService);

module.exports = router;
