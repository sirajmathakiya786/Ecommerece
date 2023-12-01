const mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const chai = require("chai");
const fs = require("fs");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const should = chai.should();
const path = require("path");
const index = require("../index");
const { expect } = chai;
chai.use(chaiHttp);
chai.should();
let userJwtToken, adminJwtToken, sellerJwtToken, myPassword;
let token;
async function passwordencrypt(password) {
  let salt = await bcrypt.genSalt(10);
  let passwordHash = bcrypt.hash(password, salt);
  return passwordHash;
}

// for insert data manual
before(async () => {
  const password = "admin@123";

  await mongoose.connect("mongodb://localhost:27017/referalproject", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  //  password
  myPassword = await passwordencrypt(password);
  await mongoose.connection.collection("admins").insertOne({
    role: "admin",
    name: "Admin Test",
    email: "mailto:admin@test.com",
    password: myPassword,
  });
});

// general
//email id alredy exist
// describe("Email already exist", () => {
//   it("should throw message email already exists", (done) => {
//         chai
//           .request(index)
//           .post("/users/add")
//           .send({
//             role: "seller",
//             firstName: "First",
//             lastName: "Seller",
//             email: "dsvds@gmail.com",
//             password: "first@123",
//             phone: "9724050201",
//             refer: "sruoxG",
//           })
//           .end((err, res) => {
//             expect(res).to.have.status(400);
//             expect(res.body.message).to.equal('User with this email already exists');
//             done();
//           });
//       });
// });

describe("User Login API", () => {
  it("should return 200 with user details and JWT token if login is successful", (done) => {
    chai
      .request(index)
      .post("/users/login")
      .send({ email: "virtual@gmail.com", password: "Virtual@123" })
      .end((err, res) => {
        userJwtToken = res.body.token;
        console.log(sellerJwtToken);
        expect(res).to.have.status(200);
        done();
      });
  });
});

// describe("Product name alredy exists", ()=>{
//   it("should throw message productName already exists", (done)=>{
//     chai
//     .request(index)
//     .post('/product/add')
//     .set("token", sellerJwtToken)
//     .send({
//       productName: "Aldsvhjlen Solly",
//       description: "this is allan solly",
//       date: "2023-10-03",
//       reviews: "1",
//       price: "6520",
//       stock: 2
//     })
//     .end((err, res) => {
//       expect(res).to.have.status(400);
//       expect(res.body.message).to.equal('ProductName Alredy Exists');
//       done();
//     });
//   })
// })

describe("Common Product Get", ()=>{
  it("should throw message product Get", (done)=>{
    chai
    .request(index)
    .get("/product/common-product")
    .set("token", userJwtToken)
    .end((err, res) => {
      //userJwtToken = res.body.token;
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Success');
      done();
    });
  })
})

describe("Add Cart", ()=>{
  it("should throw message add cart", (done)=>{
    chai
    .request(index)
    .post('/cart/add')
    .send({
      productId: "6549d2bf9b564383b062a9b1",
      quantity: "10",
    })
    .end((err, res)=>{
      expect(res).to.have.status(201)
    })
  })
})


//password formate
// describe("Valid password formate", () => {
//   it("should create a user with a valid password format", (done) => {
//         chai
//           .request(server)
//           .post("/api/user/register")
//           .send({
//             role: "seller",
//             name: "Rakesh Patel",
//             email: "mailto:rakesh@example.com",
//             password: "Admin@123456",
//             phone: "1000000075",
//            address: {
//               address_Line_1: "Ahmedabad",
//               City: "Ahmedabad",
//               State: "Gujarat",
//               PostalCode: "380061",
//               Country: "India",
//             },
//             referral: "04U0IoEb",
//           })
//           .end((err, res) => {
//             expect(res).to.have.status(400);
//             expect(res.body.message).to.equal("Password at least 1 upperCase, lowerCase, numeric, special character and minimum 6 character must be");
//             done();
//           });
//   });
// });

// user access
//create user
// describe("Create User API", () => {
//   it("should create a new user", (done) => {
//         chai
//           .request(server)
//           .post("/api/user/register")
//           .send({
//             name: "Rakesh Patel",
//             email: "mailto:rakesh@example.com",
//             password: "Admin@123",
//             phone: "1000000009",
//             address: {
//               address_Line_1: "Ahmedabad",
//               City: "Ahmedabad",
//               State: "Gujarat",
//               PostalCode: "380061",
//               Country: "India",
//             },
//             referral: "04U0IoEb",
//           })
//           .end((err, res) => {
//             expect(res).to.have.status(201);
//             expect(res.body.message).to.equal("User created successfully");
//             done();
//           });
//   });
// });
