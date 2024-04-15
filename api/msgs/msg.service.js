const pool = require("../../config/db");

module.exports = {
    addquestion: (data, callBack) => {
    pool.query(
      "INSERT INTO `question&answer` (`ProductId`, `Question`, `Answer`, `QuestionNo`) VALUES (?, ?, ?, ?)",
      [
        data.ProductId,
        data.SaveQuestion,   
        data.SaveAnswer,
        data.QuestionNo
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  selectquetion: (ProductId, callBack) => {
    pool.query(
      "SELECT * FROM `question&answer` WHERE `ProductId` = ?",
      [ProductId],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updatequestion: (data, callBack) => {
    pool.query(
      "UPDATE `question&answer` SET `Question` = ?, `Answer` = ? WHERE `ProductId` = ? AND `QuestionNo` = ?",
      [
        data.SaveQuestion,
        data.SaveAnswer,
        data.ProductId,
        data.QuestionNo
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  deletequestion: (data, callBack) => {
    pool.query(
      "DELETE FROM `question&answer` WHERE `ProductId` = ? AND `QuestionNo` = ?",
      [
        data.ProductId,
        data.QuestionNo
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  }
};
