const { selectquetion,addquestion,updatequestion,deletequestion } = require("./msg.controller");
  
  const router = require("express").Router();
 
  router.get("/selectquetion",selectquetion)
  router.post("/addquestion",addquestion)
  router.put("/updatequestion",updatequestion)
  router.delete("/deletequestion",deletequestion)

  
  module.exports = router;
  