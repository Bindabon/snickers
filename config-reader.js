//TODO: make this a class instead of a singleton
var fs = require('fs'),
    alarm = require('./alarm');

var CONFIG_LOAD_INTERVAL = 60*1000;

var config, timer;

function loadConfig(sync, callback) {
  if (!callback) {
    callback = function() {};
  }
  if (sync) {
    try {
      config = JSON.parse(fs.readFileSync('config.json'));
    } catch(e) {
      callback(e);
      return;
    }
    callback(null);
  } else {
    fs.readFile('config.json', function(err, data) {
      if (err) {
        callback('error reading config.json', err);
      } else {
        try {
          config = JSON.parse(data.toString());
        } catch(e) {
          callback(e);
          return;
        }
        callback(null);
      }
    });
  }
}

function getConfig(domain) {
  if (config && config.domains && config.domains[domain]) {
    alarm.debug('config' + domain + JSON.stringify(config));
    return config.domains[domain];
  } else {
    alarm.debug('config not found' + domain + JSON.stringify(config));
    return {};
  }
}git clone https://github.com/michielbdejong/snickers-proxy
cd snickers-proxy
npm install
cp example/config.json .
sudo cp -r example/snitch /etc
sudo mkdir -p /data/domains

module.exports.init = function(callback) {
  loadConfig(true, function(err) {
    if (err) {
      callback(err);
    } else {
      timer = setInterval(loadConfig, CONFIG_LOAD_INTERVAL);
      callback(null);
    }
  });
};
module.exports.exit = function() {
  clearInterval(timer);
};
module.exports.getConfig = getConfig;
