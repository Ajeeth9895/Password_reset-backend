const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRound = 10;
const secreteKey = "qw#e4t$Y58I*op9"
const secreteKeyReset = "qw#e4t$Y58I*r5U9aW"


//to hide password using hash
const hashPassword = async (password) => {
 
    //based on document of bcrypt
    let salt = await bcrypt.genSalt(saltRound);
    // console.log(salt);
    let hash = await bcrypt.hash(password, salt);
    // console.log(hash);
    return hash;
};


//compare both passwords
const hashCompare = (password, hash) => {
    return bcrypt.compare(password, hash);
};

//jwt(json web token) use to create token for authentication and session time
const createToken = ({ firstName, lastName, email, role }) => {
    let token = jwt.sign({ firstName, lastName, email, role }, secreteKey, {
        expiresIn: '30m'
    });
    return token;
};

//forget password validation token
const forgetPasswordToken = ({ firstName, lastName, email }) => {
    let token = jwt.sign({ firstName, lastName, email }, secreteKeyReset, {
        expiresIn: '30m'
    });
    return token;
};

//decode token 
const decodeToken = (token) => {
    let data = jwt.decode(token);
    return data;
};

//decode forget password token
const decodePasswordToken = (token) => {
    let data = jwt.decode(token);
    return data;
};


//validation
const validate = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1]
            let data = decodeToken(token)

            if ((Math.floor(Date.now() / 1000) <= data.exp)) {
                next()
            } else {
                res.status(401).send({
                    message: "Token Expired"
                })
            }

        } else {
            res.status(401).send({
                message: "Token Not Found"
            })
        }


    } catch (error) {
        console.log(error);
    }
}

//admin validation
const roleAdmin = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1]
            let data = decodeToken(token)
         
            if ((data.role === 'admin')) {
                next()
            } else {
                res.status(401).send({
                    message: "Token Expired"
                })
            }

        } else {
            res.status(401).send({
                message: "Token Not Found"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { hashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin, forgetPasswordToken, decodePasswordToken}
