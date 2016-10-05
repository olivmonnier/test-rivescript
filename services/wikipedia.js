var wikipedia = require('node-wikipedia');

var wikiSearch = function(terms, callback) {
  wikipedia.page.data(terms, { content: true }, function(response) {
    callback.call(this, null, response);
  });
}

module.exports = function(rs) {
  rs.setSubroutine('wikipedia', function(rs, args) {
    return new rs.Promise(function(resolve, reject) {
      wikiSearch(args.join(' '), function(error, data) {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.stringify({
            msg: 'I found these page',
            ext: {data: data}
          }), null, 2);
        }
      });
    })
  });
}
