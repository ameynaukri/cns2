/**
 * do something with the index
 */

exports.index = function (req, res) {
  res.render('index'
    , {
      title: 'Asthetic'
    });
};
