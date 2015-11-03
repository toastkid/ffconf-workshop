#Curtain.js

##About
Display content for comback intersitials.
This leverages the [Page Visibility API that is provided by all *decently* modern browsers](http://caniuse.com/#feat=pagevisibility).

##Install
Use Bower.
```
bower install curtain.js
```
or if you want to add it directly to your bower.json...
```
bower install curtain.js --save
```

##Setup
This requires jQuery.

Include `curtain.js` and `curtain.css` in your project.
`curtain.css` goes in your `<head>`, like so:
```HTML
<link href="bower_components/curtain.js/dist/css/curtain.min.css" rel="stylesheet">
```
Then, include `curtain.js` in your *hot* `<body>`, ideally near the closing tag after the call to jQuery.
```HTML
<script src="bower_components/curtain.js/dist/js/curtain.dist.min.js"></script>
```
Then after your openining `<body>` tag, place a `<div>` with the Curtain class:

So the most basic document would look something like this:
```HTML
<!DOCTYPE html>
<html>
  <head>
    <link href="bower_components/curtain.js/dist/css/curtain.min.css" rel="stylesheet">
  </head>
  <body>
    <section class="curtain" curtain-delay="0.5s" curtain-duration="1s" timer="true">
      <button class="curtain-exit">Exit</button>
      <span class="curtain-count"></span>
    </section>
    <div>
      <!-- page content -->
    </div>
    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/curtain.js/dist/js/curtain.dist.min.js"></script>
  </body>
</html>
```
This script is self instating, so it should just run on load. That may change. It may not. Let me know.

###Configuring the Curtain
Let me give you a quick rundown.
####Delay
The delay controls how long the curtain is closed. You must provide the value in the "```number```s" format. If none is provided, the curtain will inherit it's defaults.
```HTML
curtain-delay="3s"
```
####Duration
The delay controls how long it takes the curtain to open. You must provide the value in the "```number```s" format. If none is provided, the curtain will, again, inherit it's defaults.
```HTML
curtain-duration="1s"
```
####Timer
Timer settings controls the display of the countdown timer. ```true``` it will display, ```false``` it will be hidden, even if you've setup the markup container for the timer.
```HTML
timer="true"
```
The second requirement for the timer to work properly is to have the timer container setup. This markup must be within the curtain itself.
```HTML
<span class="curtain-count"><!-- Timer gets injected here. --></span>
```
####Exit
The option to close the curtain. Just add a link or, *preferably* a button, within the curtain, with this markup...
```HTML
<button class="curtain-exit"><!-- Awesome Exit Text --></button>
```
**Note:** You could, in theory, bind this to any element you want, just using the class.

##UX Considerations
The key here is to get the duration and delay tuned correctly **especially** if you start to use it for ads. There is a sweetspot for this sort of thing. The hardest part is finding it.
