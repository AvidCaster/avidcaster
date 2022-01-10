# <a href="chat/manager/admin"><img style="margin-bottom: -6px" width="30" src="./assets/images/logos/logo-small.png"></a> `AvidCaster's Chat Manager - Overview`

## `Description`

`Avidcaster`'s chat manager provides a better live chat management experience and as well as lower-third [video chat overlay](chat/manager/admin).

## `Overview`

**Instructors'** (`professors & teachers`) attempt in trying to use zoom's/hangout's/skype's `multicast` feature with `20+ students` can be a daunting task that creates `split-minds` which makes the teaching very difficult if not totally ineffective.

**Our tests** indicate that a better way is, to `broadcast` the video downstream, and let the students ask questions via `live chats`.

**This way** the instructor can focus on teaching, first; and address the "related" questions in a timely manner, out-of-band.

**To further simplify** the process, we've created a **Live Chat Manager**, that supports `YouTube` and `Twitch` Live Chats. The Live Chat Manager, includes powerful filters, to ensure the instructor is not overwhelmed with cross-talk noise amongst the audience. This way, the students can readily communicate amongst themselves, and only relevant chats are pushed up to the instructor.

**With remote classroom** requirements during the covid pandemic, The AvidCaster Live Chat Manager could be a game-changer, that may bring a calmer "state of mind" to both the teachers and the students alike.

## `Viewer` - Chat Overlay (seen by live stream viewers)

The following image is what the end user sees on a YouTube Live Video stream with chat overlay.

<p align="center">
<img src="./assets/images/howto/ChatOverlay.png" alt="Viewer Overlay" style="margin: 0 auto; width:100%;"/>
</p>

<br/>

## `Chat Manager Admin` - Chat Manager Dashboard (controlled by live stream owner / admin)

The following image is the control panel used by the admin/owner of the YouTube Live Video stream.

<p align="center">
<img src="./assets/images/howto//ChatManagerAdmin.png" alt="Admin Overlay" style="margin: 0 auto; width:100%;"/>
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

# `Admin` - Video Switcher Settings (advance)

### Chat Overlay Setup - `ATEM`

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
