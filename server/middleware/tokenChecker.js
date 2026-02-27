const jwt = require("jsonwebtoken")
const secret = "abc@123"

const check = (req, res, next) => {
    let token = req.headers.authorization
    if (token) {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                res.send({
                    success: false,
                    status: 401,
                    message: "Unauthorized Access"
                })
            }
            else {
                req.user=data
                next()
            }
        })
    }
    else {
        res.send({
            success: false,
            status: 404,
            message: "No Token Found"

        })
    }
}

module.exports = check