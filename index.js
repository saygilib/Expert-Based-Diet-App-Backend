const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/expert", (req, res) => {
  const python = spawn("python3", [
    "./ExpertSystem/Diet_ExpertSystem.py",
    req.body.height,
    req.body.weight,
    req.body.age,
    req.body.gender,
    req.body.activity,
    req.body.diseases,
  ]);

  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    console.log(data.toString());
    res.send(data);
  });

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on("exit", (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });
});

app.post("/postUserInfo", (req, res) => {
  fs.readFile("userInfo.json", (err, data) => {
    if (err) throw err;
    else {
      var json = JSON.parse(data);
      var userID = json.users[json.users.length - 1].id + 1;
      var data2 = {
        id: userID,
        name: req.body.name,
        weight: req.body.weight,
        height: req.body.height,
        gender: req.body.gender,
        age: req.body.age,
        activity: req.body.activity,
        diseases: req.body.diseases,
      };
      json.users.push(data2);
      console.log(json);
      fs.writeFile("userInfo.json", JSON.stringify(json, null, 2), (err) => {
        if (err) throw err;
        else {
          console.log("File saved");
          res.send({
            message: "File saved",
          });
        }
      });
    }
  });
});

app.get("/getUserInfo", (req, res) => {
  fs.readFile("userInfo.json", (err, data) => {
    if (err) throw err;
    else {
      res.send(JSON.parse(data));
      console.log(JSON.parse(data));

      let user = JSON.parse(data);
      console.log(user.name);
    }
  });
});

app.post("/alterUser", (req, res) => {
  fs.readFile("userInfo.json", (err, data) => {
    if (err) throw err;
    else {
      var json = JSON.parse(data);
      var data2 = {
        id: req.body.id,
        name: req.body.name,
        weight: req.body.weight,
        height: req.body.height,
        gender: req.body.gender,
        age: req.body.age,
        activity: req.body.activity,
        diseases: req.body.diseases,
      };
      json.users[req.body.id - 1] = data2;
      console.log(json);
      fs.writeFile("userInfo.json", JSON.stringify(json, null, 2), (err) => {
        if (err) throw err;
        else {
          console.log("File saved");
          res.send({
            message: "File saved",
          });
        }
      });
    }
  });
});

app.post("/deleteUser", (req, res) => {
  fs.readFile("userInfo.json", (err, data) => {
    if (err) throw err;
    else {
      var json = JSON.parse(data);
      json.users.splice(req.body.id - 1, 1);
      console.log(json);
      fs.writeFile("userInfo.json", JSON.stringify(json, null, 2), (err) => {
        if (err) throw err;
        else {
          console.log("File saved");
          res.send({
            message: "File saved",
          });
        }
      });
    }
  });
});
app.get("/getRec", (req, res) => {
  fs.readFile("userRecommendations.json",(err,data)=>{
    if(err) throw err;
    else{
      res.status(202).send(JSON.parse(data).data[0]);
    }
  })

});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
