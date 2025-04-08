const express = require("express");
const cors = require("cors");
const app = express();

// Use CORS middleware to allow all origins :)
// #TODO: When deploying frontend to a dedicated URL, add just that URL in the allowed list
app.use(cors());

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
