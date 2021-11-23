# unmute.js
Enables web audio playback with the ios mute switch on

unmute is a disgusting hack that helps..
	1. automatically resume web audio contexts on user interaction
	2. automatically pause and resume web audio when the page is hidden.
	3. ios only: web audio play on the media channel rather than the ringer channel
	4. ios only: disable the media playback widget and airplay when:

WebAudio is automatically resumed by checking context state and resuming whenever possible.

WebAudio pausing is accomplished by watching the page visilibility API. When on iOS, page focus
is also used to determine if the page is in the foreground because Apple's page vis api implementation is buggy.

iOS Only: Forcing WebAudio onto the media channel (instead of the ringer channel) works by playing
a short, high-quality, silent html audio track continuously when web audio is playing.

iOS Only: Hiding the media playback widgets on iOS is accomplished by completely nuking the silent
html audio track whenever the app isn't in the foreground.

iOS detection is done by looking at the user agent for iPhone, iPod, iPad. This detects the phones fine, but
apple likes to pretend their new iPads are computers (lol right..). Newer iPads are detected by finding 
mac osx in the user agent and then checking for touch support by testing navigator.maxTouchPoints > 0.

This code isn't optimized in any fashion, it is just whipped up to help someone out on stack overflow, its just meant as an example.

In an ideal world, Apple would fix their janky browser. In the real world, this is probably *by design* on Apple's part to reduce the capabilities of web apps and push users onto their absurdly profitable and monopolistic app store.

Quirks:
- The audio channel control may not kick back on immediately. Example: when you begin playback with the mute switch on, switch tabs, then switch back, the audio will be playing, but it will be muted. The user must interact with the page to begin hearing the audio again. This doesn't apply when the allowBackgroundPlayback option is specified.
- iOS displays audio playback controls on its lockscreen. The default unmute behavior does an excellent job at hiding these from the user. Specifying the allowBackgroundPlayback option will cause these controls to be displayed. There is no way to remove them, even though they don't do anything meaningful.

Enjoy this gross hack. If you like it, you're welcome to buy me a coffee :)

<a href="https://www.buymeacoffee.com/sevans" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Demo
See: https://spencer-evans.com/share/github/unmute/

Give it a run in your favorite janky ios browser, safari. Let the track load and hit play. Audio should be playing. It should pause if you switch tabs / minimize the window / lock the device and resume when you return to it. If you're on ios it should playing even with the mute switch on AND you should not see a media playback widget. Enjoy.

## Usage
- Load the unmute.js or unmute.min.js script.
- After it is loaded and you've created a web audio context, call unmute(myContext); to enable unmute.
- Play tracks using the context like you normally would.
- You can optionally specify to allow background playback or force iOS behavior on all devices and browsers, neither is recommended but may be required for some use cases.

```javascript
// Create an audio context instance if WebAudio is supported
let context = (window.AudioContext || window.webkitAudioContext) ?
  new (window.AudioContext || window.webkitAudioContext)() : null;
  
// Decide on some parameters
let allowBackgroundPlayback = false; // default false, recommended false
let forceIOSBehavior = false; // default false, recommended false
// Pass it to unmute if the context exists... ie WebAudio is supported
if (context)
{
  // If you need to be able to disable unmute at a later time, you can use the returned handle's dispose() method
  // if you don't need to do that (most folks won't) then you can simply ignore the return value
  let unmuteHandle = unmute(context, allowBackgroundPlayback, forceIOSBehavior);
  
  // ... at some later point you wish to STOP unmute control
  unmuteHandle.dispose();
  unmuteHandle = null;
  
}
```

## Troubleshooting
- If you run into errors creating an AudioContext, you might be using a browser that doesn't support WebAudio (Thanks Internet Explorer!). See: https://caniuse.com/#feat=audio-api
- If unmute is throwing errors, there is a strong chance that something other than a real instance of AudioContext was passed to unmute. 
    - Are you using any other audio frameworks? They often wrap the AudioContext with their own version of it. That won't work. unmute needs the real mccoy. Check the other audio framework to see if that is the case. They probably offer some method of getting the real context.
    - Are you using a polyfill for AudioContext? If so, it better be the real thing! Polyfilling with an empty function will not work.
    - Are you using a polyfill framework? If so, you'll need to check that WebAudio is actually supported and not being polyfilled with an empty function.

## Change Log
- 3/24/2021
  - added support for detecting new ipads that use a mac user agent.. this fix may not be entirely necessary, but it works for now
  - fixed bug that prevented chrome from resuming audio when the page is reloaded while in the background
