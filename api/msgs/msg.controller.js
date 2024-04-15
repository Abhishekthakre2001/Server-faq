const { selectquetion,addquestion,updatequestion,deletequestion } = require('./msg.service')
module.exports = {
    selectquetion: (req, res) => {
        const { ProductId } = req.query;
        selectquetion(ProductId, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found"
            });
          }
          return res.json({
            success: 1,
            data: results
          });
        });
      },
      addquestion: (req,res) => {
        const body = req.body;
        addquestion(body, (err,results)=>{
            if (err) {
                console.log(err);
                return;
              }
              if (!results) {
                return res.json({
                  success: 0,
                  message: "Record not Found"
                });
              }
              return res.json({
                success: 1,
                data: results
              });
            });
      },
      updatequestion: (req,res) => {
        const body = req.body;
        updatequestion(body, (err,results)=>{
            if (err) {
                console.log(err);
                return;
              }
              if (!results) {
                return res.json({
                  success: 0,
                  message: "Record not Found"
                });
              }
              return res.json({
                success: 1,
                data: results
              });
            });
      },
      deletequestion: (req,res) => {
        const body = req.body;
        deletequestion(body, (err,results)=>{
            if (err) {
                console.log(err);
                return;
              }
              if (!results) {
                return res.json({
                  success: 0,
                  message: "Record not Found"
                });
              }
              return res.json({
                success: 1,
                data: results
              });
            });
      },
}