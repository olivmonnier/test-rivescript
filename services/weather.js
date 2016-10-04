var request = require('request');

var getWeather = function(location, callback) {
  request.get({
    url: 'http://api.openweathermap.org/data/2.5/weather',
    qs: {
      q: location,
      APPID: '6460241df9136925432064ac70416d05'
    },
    json: true
  }, function(error, response) {
    if (response.statusCode !== 200) {
      callback.call(this, response.body);
    } else {
      callback.call(this, null, response.body);
    }
  });
};

module.exports = function(rs) {  
  rs.setSubroutine('getWeather', function (rs, args)  {
    return new rs.Promise(function(resolve, reject) {
      getWeather(args.join(' '), function(error, data){
        if(error) {
          reject(error);
        } else {
          resolve(data.weather[0].description);
        }
      });
    });
  });

  rs.setSubroutine('checkForRain', function(rs, args) {
    return new rs.Promise(function(resolve, reject) {
      getWeather(args.join(' '), function(error, data){
        if(error) {
          reject(error);
        } else {
          var rainStatus = data.rain ? 'yup :(' : 'nope';
          resolve(rainStatus);
        }
      });
    });
  });
}
