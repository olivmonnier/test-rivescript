var Youtube = require('youtube-node');

var yt = new Youtube();
yt.setKey('AIzaSyA8UFoMWx8wWQxkCgri95mrXqwVILcFXqk');

var ytSearch = function(terms, nbResults, callback) {
  yt.search(terms, nbResults, function(error, result) {
    if (error) {
      callback.call(this, result);
    } else {
      callback.call(this, null, result);
    }
  });
}

module.exports = function(rs) {
  rs.setSubroutine('youtube', function(rs, args) {
    return new rs.Promise(function(resolve, reject) {
      ytSearch(args.join(' '), 10, function(error, data) {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.stringify({
            msg: 'I found these videos',
            ext: {data: {videos: data.items}}
          }), null, 2);
        }
      });
    });
  });
}
