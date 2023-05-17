//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoDB",  {useNewUrlParser: true});

const itemSchema = {
  name : String
};

const Item = mongoose.model('Item',itemSchema);

const item1 = new Item({
  name: "Buy food"
});

const item2 = new Item({
  name: "Buy Book"
});

const item3 = new Item({
  name : "Read Book"
});

const defaultItems = [item1, item2 , item3 ];

     

const workItems = [];

app.get("/", async (req, res,error)=> {
  const foundItems =  await Item.find({})
  if(foundItems.length === 0)
  {
    Item.insertMany(defaultItems) ? console.log("Successfully saved default items in DB") : console.log(error)
    res.redirect("/");
  }
  else
  {
    res.render("list", {listTitle: "Today", newListItems: foundItems})
  }
  
});
 
app.post("/", async(req, res) =>{
  const newItem = req.body.newItem;

  const item = new Item({
    name: newItem
  });
  const addedItem = await item.save();
  console.log(addedItem);
  res.redirect("/")
});

app.post("/delete", async(req, res) => {
  const itemId = req.body.checkbox;
  const delitem = await Item.findByIdAndRemove(itemId);
  res.redirect("/"); 
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
