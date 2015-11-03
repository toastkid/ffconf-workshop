var CURTAIN = (function () {
  //Setup the public object
  var curtain = {};
  //Public Vars
  curtain.hidden = '';
  curtain.visibilityChange = '';
  curtain.hiddenInterval = '';
  //setting up defaults.
  curtain.delaySetting = '1s';
  curtain.durationSetting = '0.8s';
  curtain.timerSetting = true;
  curtain.curtainIdentifier = '.curtain';
  curtain.exitIdentifier = '.curtain-exit';
  curtain.countIdentifier = '.curtain-count';
  //Public Functions
  //Check browser for API variations.
  curtain.checkBrowser = function () {
    if (typeof window.document.hidden !== 'undefined') {
      //Modern
      curtain.hidden = 'hidden';
      curtain.visibilityChange = 'visibilitychange';
    } else if (typeof window.document.mozHidden !== 'undefined') {
      //Old Mozilla
      curtain.hidden = 'mozHidden';
      curtain.visibilityChange = 'mozvisibilitychange';
    } else if (typeof window.document.msHidden !== 'undefined') {
      //Microsoft - PerfectShitForever(TM)
      curtain.hidden = 'msHidden';
      curtain.visibilityChange = 'msvisibilitychange';
    } else if (typeof window.document.webkitHidden !== 'undefined') {
      //Older WebCats
      curtain.hidden = 'webkitHidden';
      curtain.visibilityChange = 'webkitvisibilitychange';
    }
  };
  //Fires on hidden state, changes css transistions and Z-index.
  //This is initial state that the shit transistions from.
  curtain.hiddenState = function () {
    //Checking to see if the countdown is running
    if (curtain.hiddenInterval) {// clear that shit.
      window.clearInterval(curtain.hiddenInterval);
      curtain.hiddenInterval = '';
    }
    $(curtain.curtainIdentifier).css({
      'transition': 'all 0s',
      'transition-delay': '0s',
      'z-index': '1',
      'width': '100%',
      'transform':'translateX(0px)'
    });
  };
  //Fires on visible state, changes css transistions and Z-index.
  //This is the updated state that the shit transisitions to.
  curtain.returnState = function (delayTime, wipeDuration) {
    window.setTimeout(function(){//to avoid race condition? I guess...?
      $(curtain.curtainIdentifier).css({
        'transition': 'all ' + wipeDuration,
        'transition-delay': delayTime,
        'z-index': '0',
        'width':'0%',
        'transform':'translateX(-800px)'
      });
    }, 10);
  };
  //clone and delete original. We need to do this because you can't just 'interrupt'
  //css transistions, you have to actually remove/clone the WHOLE element inline. Shitty.
  //Makes sense I guess. Kinna. Not really. Maybe. I have to put the sausage and cheese cart back.
  //The ol' DOM switch-a-roo...
  curtain.cloneElement = function () {
    var cur = $(curtain.curtainIdentifier),
    newcur = cur.clone(true);
    cur.before(newcur);
    $('.' + cur.attr('class') + ':last').remove();
  };
  //bind the & jquery click even to the exit.
  curtain.startExit = function () {
    $(curtain.exitIdentifier).click( function () {
      curtain.cloneElement();
      curtain.hiddenState();
      curtain.wipe('0', curtain.durationSetting);
    });
  };
  // Countdown Timer, in seconds
  curtain.countdown = function (counttime) {
    // stript text from the numbers.
    // check to make sure timer is true
    if (curtain.timerSetting) {
      var re = /[^\d\.]/;
      var count = counttime.replace(re,'');
      //set up for the callback so we can cancel the interval
      curtain.hiddenInterval = window.setInterval(function() {
        count--;
        if (count >= 0) {
          $(curtain.countIdentifier).html(count);
        }
        if (count === 0) {
          $(curtain.countIdentifier).html('');
        }
      }, 1000);
    }
  };
  //Lets update the css via the event listener.
  curtain.wipe = function (delay, duration) {
    if (window.document[curtain.hidden]) {//Is the DOM hidden? Are you on another Tab?
      curtain.hiddenState();

    } else { // DOM is shown. We can see it!
      $(curtain.countIdentifier).html('');//clear the counter.
      curtain.returnState(delay,duration);
      curtain.countdown(delay);
    }
  };
  //Grabs the settings from the DOM using $'s attr. function.
  curtain.getSettings = function () {
    //check for settings. if not, then just go exit with defaults.
    if ($(curtain.curtainIdentifier).attr('curtain-delay')) {
      curtain.delaySetting = $(curtain.curtainIdentifier ).attr('curtain-delay');
    }
    if ($(curtain.curtainIdentifier).attr('curtain-duration')) {
      curtain.durationSetting = $(curtain.curtainIdentifier ).attr('curtain-duration');
    }
    if ($(curtain.curtainIdentifier).attr('timer') === 'true') {//TODO: Refactor
      curtain.timerSetting = true;
    } else {
      curtain.timerSetting = false;
    }
  };
  //return the object for use.
  curtain.init = function (){
    //Fire the first check
    curtain.checkBrowser();
    //grab settings from the dom
    curtain.getSettings();
    //attach the exit function to an element in the dom.
    curtain.startExit();
    //Attach Listener
    window.document.addEventListener(curtain.visibilityChange, function () {//Damn you Javascript. THANKS, OBAMA./s
      //animation function
      curtain.wipe(curtain.delaySetting, curtain.durationSetting);
    }, false);
  };
  //Push that shit out the door.
  return curtain;
}());
CURTAIN.init();
