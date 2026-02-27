const User = require("../apis/user/userModel")
const bcrypt = require("bcrypt")


User.findOne({ email: "admin@gmail.com" }).then((adminData) => {
    if (adminData) {
        console.log("Admin Already exist");
    }
    else {
        let admin = new User()
        admin.autoId = 1
        admin.name = "Admin"
        admin.email = "admin@gmail.com"
        admin.userType = 1
        admin.password = bcrypt.hashSync('123', 10)
        admin.save().then(() => {
            console.log('Admin Created');
        }).catch((err) => {
            console.log('Error in creating admin', err);
        })
    }
}).catch((err) => {
    console.log("Error in finding admin", err);
})





