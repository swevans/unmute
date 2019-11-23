# unmute
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

Enjoy this gross hack.
