# AvidCaster `YouTube` Chat Overlay <img style="margin-bottom: -6px" width="30" src="./assets/images/logos/logo-small.png">

## `Description`

[Avidcaster](/) `YouTube` feature works with YouTube in providing a low-cost lower-third video chat overlay.

## `Overview`

### `Viewer` - Chat Overlay (seen by live stream viewers)

The following image is what the end user sees on a YouTube Live Video stream with chat overlay.

<p align="center">
<img src="./assets/images/howto/OverlayViewer.png" alt="Viewer Overlay" style="margin: 0 auto; width:100%;"/>
</p>

<br/>

### `Admin` - Chat Overlay (controlled by live stream owner / admin)

The following image is the control panel used by the admin/owner of the YouTube Live Video stream.

<p align="center">
<img src="./assets/images/howto//OverlayAdmin.png" alt="Admin Overlay" style="margin: 0 auto; width:100%;"/>
</p>

# `Features`

### `Admin - Chat Overlay Controller`

The following image is the control panel and its details

<p align="center">
<img src="./assets/images/howto/OverlayAdminDetails.png" alt="Admin Overlay Details" style="margin: 0 auto; width:100%;"/>
</p>

### `Admin Features`

- Direction
  - Left to Right, Right to Left Support
- Chat
  - Test Chat
  - Clear Chat
  - Highlight (`word1 word2 word2`)
    - Highlights a chat if it contains any of the given words
  - Filter (`word1 word2 word2`)
    - Fades out all chats except those containing the given words
  - Superchat support
    - Placing the donation amount next to the name
- Fireworks
  - Start
    - Automatic
      - Superchat triggered
    - Manual
      - Birthday
      - Best question
      - New members
  - Stop
    - Automatic
      - On next chat insert
    - Manual
      - At any time, admin driver
  - Enable / Disable
    - Prevents auto start of fireworks on superchat, etc
- Audio (Yay!)
  - Start
    - Automatic
      - Superchat triggered
    - Manual
      - Birthday
      - Best question
      - New members
  - Stop
    - Automatic
      - On next chat insert
    - Manual
      - At any time, admin driver
  - Enable / Disable
    - Prevents auto start of audio on superchat, etc
- Declutter / Reclutter
  - Declutter to clean up the chat window to quickly find chat items
  - Reclutter to put everything back to interact with YouTube chat
- Fullscreen
  - Toggle fullscreen
    - On - ready to be cropped with `mask` feature of video switcher such as ATEM or OBS etc.
    - Off - ready to move the browser window around
- Home
  - Takes you back to [Avidcaster](https://avidcaster.net) main page

<br/>

# `Admin` - Video Switcher Settings

### Video Switcher Setup - `ATEM`

The following image is the ATEM Software Control, depicting, the downstream luma key setup. Tweak the mask to match your setup.

<p align="center">
<img src="./assets/images/howto//ATEM.png" alt="Admin Overlay Details" style="margin: 0 auto; width:100%;"/>
</p>

#### `Switcher Settings Details`

- Upstream Key

  - Luma
  - Fill & Key (source)
    - Select the computer running the chat
  - Mask
    - Ensure the chrome tab containing the cast is in fullscreen
    - Tweak values to position your chat while cutting the top portion
  - Clip / Gain
    - Tweak to get best result

- Downstream Key
  - Similar to Luma, but Downstream is OnAir
  - Tweak `mask` for proper positioning
