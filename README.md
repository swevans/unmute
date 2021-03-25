# unmute.js
Enables web audio playback with the ios mute switch on

unmute is a disgusting hack that helps..
  1) automatically resume web audio contexts on user interaction
  2) ios only: web audio play on the media channel rather than the ringer channel
  3) ios only: disable the media playback widget and airplay.
  4) automatically pause and resume web audio when the page is hidden.
 
Auto resuming works by checking context state and calling resume during any resumable event.
 
Media channel playback and media widget disabling work by playing an airplay-disabled silent html audio track in the background.
 
Automatic pausing when the page is hidden is supported by both the page visibility api AND blur events because ios has a poor implementation of the page visibility api.
 
This is all really gross and apple should really fix their janky browser. This code isn't optimized in any fashion, it is just whipped up to help someone out on stack overflow, its just meant as an example.

Enjoy this gross hack. If you like it, you're welcome to buy me a coffee :)

<a href="https://www.buymeacoffee.com/sevans" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Demo
See: https://spencer-evans.com/share/github/unmute/

Give it a run in your favorite janky ios browser, safari. Let the track load and hit play. Audio should be playing. It should pause if you switch tabs / minimize the window / lock the device and resume when you return to it. If you're on ios it should playing even with the mute switch on AND you should not see a media playback widget. Enjoy.

## Usage
- Load the unmute.js or unmute.min.js script.
- After it is loaded and you've created a web audio context, call unmute(myContext); to enable unmute.
- Play tracks using the context like you normally would.

```javascript
// Create an audio context instance if WebAudio is supported
let context = (window.AudioContext || window.webkitAudioContext) ?
  new (window.AudioContext || window.webkitAudioContext)() : null;
// Pass it to unmute if the context exists... ie WebAudio is supported
if (context) unmute(context);
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
