require('dotenv').config();
const routes = require('./routes/routes');
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cors = require('cors');


mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const User = require("./models/userModel");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes)
app.post("/register", (request, response) => {
    
    bcrypt
      .hash(request.body.password, 10)
      .then((hashedPassword) => {
        
        const user = new User({
            
          email: request.body.email,
          username: request.body.username,
          password: hashedPassword,
        });
  
        
        user
          .save()
         
          .then((result) => {
            response.status(201).send({
              message: "User Created Successfully",
              result,
            });
          })
          
          .catch((error) => {
            response.status(500).send({
              message: "Error creating user",
              error,
            });
          });
      })
      .catch((e) => {
        response.status(500).send({
          message: "Password was not hashed successfully",
          e,
        });
      });
  });

  app.post("/login", (request, response) => {
    User.findOne({ email: request.body.email })
  
      .then((user) => {
        bcrypt
          .compare(request.body.password, user.password)
  
          .then((passwordCheck) => {
  
            if(!passwordCheck) {
              return response.status(400).send({
                message: "Passwords does not match",
                error,
              });
            }
  
            //   create JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                userName: user.username,
                userEmail: user.email,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );
  
            response.status(200).send({
              message: "Login Successful",
              email: user.email,
              token,
            });
          })
          .catch((error) => {
            response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          });
      })
      .catch((e) => {
        response.status(404).send({
          message: "Email not found",
          e,
        });
      });
  });
  
  


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})