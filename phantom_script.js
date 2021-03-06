// 'url' is assigned to in a statement before this.
var page = require('webpage').create();
var stderr = require('system').stderr;

var isReady = function () {
  return page.evaluate(function () {
    var packageName = 'redsift:spiderable';

    if (typeof Meteor === 'undefined'
        || Meteor.status === undefined
        || !Meteor.status().connected) {
      return false;
    }
    if (typeof Package === 'undefined'
        || Package[packageName] === undefined
        || Package[packageName].Spiderable === undefined
        || !Package[packageName].Spiderable._initialSubscriptionsStarted) {
      return false;
    }
    Tracker.flush();
    var ddp = DDP._allSubscriptionsReady();
    var custom = Package[packageName].Spiderable.isReady();
    return ddp && custom;
  });
};

var dumpPageContent = function () {
  var out = page.content;
  out = out.replace(/<script[^>]+>(.|\n|\r)*?<\/script\s*>/ig, '');
  out = out.replace('<meta name="fragment" content="!">', '');
  console.log(out);
};

page.open(url, function(status) {
  if (status === 'fail')
    phantom.exit();
});

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  // lineNum and sourceId are not set
  stderr.write('[page] ' + msg);
};

page.onError = function (msg, trace) {
    stderr.write('[error]' + msg);
    trace.forEach(function(item) {
        stderr.write('  ' + item.file + ':' + item.line);
    });
};

setInterval(function() {
  if (isReady()) {
    dumpPageContent();
    phantom.exit();
  }
}, 100);

