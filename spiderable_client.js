/* global UI */
/* global Meteor */
/* global Spiderable */
// We want to provide a deteriministic indicator of when the page is 'done'
// This is non-trivial: e.g. an infinite stream of tweets is never done.
//
// We do this instead:
//   We are done sometime after all initial subscriptions are ready
//   Initial subscriptions are those started in the top-level script execution,
//   or from a Meteor.startup callback when Meteor.startup is called in
//   top-level script execution.
//
// Note that we don't guarantee that we won't wait longer than we have to;
// extra subscriptions may be made, and extra data past the minimum may be
// received.
//
// We set this 'started' flag as Package.spiderable.Spiderable._initialSubscriptionsStarted
// This is used by our phantomjs to determine when the subscriptions are started;
// it then polls until all subscriptions are ready.

Spiderable.isPhantom = function() {
  return ((window.phantom !== undefined) || (window._phantom !== undefined));
};

Spiderable._initialSubscriptionsStarted = false;

var startupCallbacksDone = function () {
  Spiderable._initialSubscriptionsStarted = true;
};

// This extra indirection is how we get called last
var topLevelCodeDone = function () {
  // We'd like to use Meteor.startup here I think, but docs/behaviour of that is wrong
  Meteor._setImmediate(function () { startupCallbacksDone(); });
};

Meteor.startup(function () { 
  
  topLevelCodeDone(); 


  if (Meteor.isClient && Router) {
    Router.onBeforeAction(function() {
  			Spiderable.resetReady(this.ready());
  			this.next();	
  		});
    Router.onAfterAction(function() {
  			Spiderable.resetReady(this.ready());
  		});
  }

});


UI.registerHelper('isPhantom', function (object) {
  return Spiderable.isPhantom();
});  

Spiderable._isReady = true;

Spiderable.resetReady = function(to) {
  if (to === undefined) {
    to = false;
  }
  Spiderable._isReady = to;
};

Spiderable.isReady = function() {
  return  Spiderable._isReady;
};

