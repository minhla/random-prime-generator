var express = require("express");
var app = express();
var path = require("path");

var server = require("http").createServer(app);
app.set("port", process.env.HEROKU_NODEJS_PORT || process.env.PORT || 3333);
app.set("ip", process.env.HEROKU_NODEJS_IP || process.env.IP || "0.0.0.0");

app.use(express.static("static"));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "./pages"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index");
});

const checkInput = (input) => {
  var message = "";
  if (input < 1) {
    message = "User Error!  User Error! Please Try Again!";
  }
  return message;
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const isPrime = (n) => {
  var flag = true;

  if (n < 2) {
    flag = false;
  } else if (n == 2) {
    flag = true;
  } else if (n % 2 == 0) {
    flag = false;
  } else {
    for (var i = 3; i < Math.sqrt(n); i += 2) {
      if (n % i == 0) {
        flag = false;
        break;
      }
    }
  }

  return flag;
};

const randomPrimeNumber = async (max) => {
  const number = getRandomInt(max);
  const primeNumber = await isPrime(number);
  if (primeNumber) {
    return number;
  }
  return randomPrimeNumber(max);
};

app.post("/", async (req, res) => {
  const max_value = req.body.max_value;
  const isValidate = checkInput(max_value);
  if (isValidate) {
    return res.render("index", {
      error: true,
      message: isValidate,
    });
  }

  const result = await randomPrimeNumber(max_value);

  res.render("index", { result: JSON.stringify(result), max_value });
});

server.listen(app.get("port"), app.get("ip"), function () {
  console.log(
    "Server listening at %s:%d ",
    server.address().address,
    server.address().port
  );
});
