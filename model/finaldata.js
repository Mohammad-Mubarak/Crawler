const mongoose = require("mongoose");

const finaldata  = new mongoose.Schema({
    seed_url:String,
    current_url:String,
    html:String,
    base64_image:String
});

module.exports = mongoose.model("crawler", finaldata );
