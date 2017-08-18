const CaloriesAPI = require("./CaloriesAPI.js")

let api = new CaloriesAPI();

api.search("möhren", function(res){
    console.log(res);
});