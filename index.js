//===----------------------------------------------------------------------===//
//
//                         Violet Server Data Analyzer
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const a_database = require('./api/database');

function getMapSize(x) {
  var len = 0;
  for (var count in x) len++;
  return len;
}

var conn = a_database();
var qr = conn.query(
    'SELECT * FROM viewtotal WHERE UserAppId IS NOT NULL AND UserAppId <> "test"',
    function(error, results, fields) {
      console.log(results.length);

      var userData = {};
      for (var i = 0; i < results.length; i++) {
        if (!(results[i].UserAppId in userData))
          userData[results[i].UserAppId] = new Set();
        userData[results[i].UserAppId].add(results[i].ArticleId);
      }

      var articleData = {};
      Object.keys(userData).forEach(function(key) {
        for (var article1 of userData[key].values()) {
          if (!(article1 in articleData)) articleData[article1] = {};
          for (var article2 of userData[key]) {
            if (article1 == article2) continue;
            if (!(article2 in articleData[article1]))
              articleData[article1][article2] = 0;
            articleData[article1][article2]++;
          }
        }
      });

      var t_rank = [];
      Object.keys(articleData).forEach(function(article1) {
        Object.keys(articleData[article1]).forEach(function(article2) {
          if (articleData[article1][article2] >= 1) {
            t_rank.push([articleData[article1][article2], article1, article2]);
          }
        });
      });

      t_rank.sort(function(a, b) {
        return a[0] - b[0];
      });
      for (var e of t_rank) console.log(e);
    });
