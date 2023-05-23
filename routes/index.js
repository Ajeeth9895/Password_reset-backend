var express = require('express');
var router = express.Router();
const {UserModel} = require("../schema/userSchema")
const { hashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin, forgetPasswordToken, decodePasswordToken } = require('../config/auth');
const {dbUrl} = require("../config/dbConfig")
const mongoose = require('mongoose');
const {passwordEmail} = require("../service/passwordEmail")

//frontend deployed link
const url = "https://beautiful-shortbread-5030de.netlify.app"

//connect to DB
mongoose.connect(dbUrl)


//create user
router.post('/signUp', async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      req.body.password = await hashPassword(req.body.password);
      let doc = new UserModel(req.body);
      await doc.save();
      res.status(201).send({
        message: "User Added successfully please login",
      });
    } else {
      res.status(400).send({
        message: "Email already exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});



//login
router.post("/login", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      if (await hashCompare(req.body.password, user.password)) {
        let token = await createToken({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });

        res.status(200).send({
          message: "Login successfully",
          token
        });
      } else {
        res.status(400).send({
          message: "Invalid Credential",
        });
      }
    } else {
      res.status(400).send({
        message: "Email does not exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//send email
router.post("/send-email", async (req, res) => {

  try {
 
    let user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      let token = await forgetPasswordToken({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      const setUserToken = await UserModel.findByIdAndUpdate({ _id: user._id }, { token: token });


      await passwordEmail({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        message: `${url}/${user._id}/${setUserToken.token}`
      })

      res.status(200).send({
        message: "Email send successfully",
      });

    } else {
      res.status(400).send({
        message: "Email does not exists",
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});


//verify token for reset password
router.get("/reset-password/:id/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const data = await decodePasswordToken(token);

    if ((Math.floor(Date.now() / 1000) <= data.exp)) {
      res.status(200).send({
        message: "Valid user"
      })
    } else {
      res.status(401).send({
        message: "Token expired"
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});


//creating new password
router.post("/change-password/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const password = req.body.password

    const changePass = await hashPassword(password);

    const updatePassword = await UserModel.updateOne({ _id: _id }, { $set: { password: changePass } });

    res.status(200).send({
      message: 'Password updated successfully'
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

module.exports = router;
