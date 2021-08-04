const fs = require("fs");
var request = require("request");
const apiDocPath = "./api-docs";
require("dotenv").config(); // We require dotenv so that we can use process.env.

// Ajouter le endpoint du nouveau microservice à appeler ici.
const backendList = ["customers", "bookmarks"];

backendList.forEach(microServiceName => {
  return request(
    { url: process.env.API_BASE_URL + "/" + microServiceName + "/v0/api-docs", rejectUnauthorized: false },
    function(error, response, body) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error("error:", error);
        return null;
      }
      return fs.writeFileSync(apiDocPath + "/" + microServiceName + ".json", JSON.stringify(JSON.parse(body)));
    },
  );
});
