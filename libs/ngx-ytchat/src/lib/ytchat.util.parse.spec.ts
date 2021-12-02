import { parseChat } from './ytchat.util.parse';

xdescribe('ytchat.utils.member.month.chat', () => {
  const author = 'Mike Tyson';
  const textMessage = 'Hello world';
  const avatarUrl = `https://yt4.ggpht.com/ytc/AKedOLSnlIuga-vlYhtxHT1MXe8aLhk-wT89EkJqiQ=s256-c-k-c0x00ffffff-no-rj`;
  const chatHtml = `<yt-live-chat-text-message-renderer class="style-scope yt-live-chat-item-list-renderer avidcaster-dispatched" id="CjkKGkNQZjM4SjdieGZRQ0ZRUEt3UW9kMWIwTXFBEhtDSW1CMFl2WXhmUUNGVEJDVHdRZHNoa0x6ZzE%3D" author-type="moderator">
  <!--css-build:shady-->
  <yt-img-shadow id="author-photo" class="no-transition style-scope yt-live-chat-text-message-renderer" height="24" width="24" loaded="" style="background-color: transparent;">
     <!--css-build:shady--><img id="img" class="style-scope yt-img-shadow" alt="" height="24" width="24" src="${avatarUrl}">
  </yt-img-shadow>
  <div id="content" class="style-scope yt-live-chat-text-message-renderer">
     <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">1:10 PM</span>
     <yt-live-chat-author-chip class="style-scope yt-live-chat-text-message-renderer">
        <!--css-build:shady--><span id="author-name" dir="auto" class="moderator style-scope yt-live-chat-author-chip">${author}<span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span></span>
        <span id="chat-badges" class="style-scope yt-live-chat-author-chip">
           <yt-live-chat-author-badge-renderer class="style-scope yt-live-chat-author-chip" aria-label="Moderator" type="moderator" shared-tooltip-text="Moderator">
              <!--css-build:shady-->
              <div id="image" class="style-scope yt-live-chat-author-badge-renderer">
                 <yt-icon class="style-scope yt-live-chat-author-badge-renderer">
                    <svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                       <g class="style-scope yt-icon">
                          <path d="M9.64589146,7.05569719 C9.83346524,6.562372 9.93617022,6.02722257 9.93617022,5.46808511 C9.93617022,3.00042984 7.93574038,1 5.46808511,1 C4.90894765,1 4.37379823,1.10270499 3.88047304,1.29027875 L6.95744681,4.36725249 L4.36725255,6.95744681 L1.29027875,3.88047305 C1.10270498,4.37379824 1,4.90894766 1,5.46808511 C1,7.93574038 3.00042984,9.93617022 5.46808511,9.93617022 C6.02722256,9.93617022 6.56237198,9.83346524 7.05569716,9.64589147 L12.4098057,15 L15,12.4098057 L9.64589146,7.05569719 Z" class="style-scope yt-icon"></path>
                       </g>
                    </svg>
                    <!--css-build:shady-->
                 </yt-icon>
              </div>
           </yt-live-chat-author-badge-renderer>
        </span>
     </yt-live-chat-author-chip>
     <span id="message" dir="auto" class="style-scope yt-live-chat-text-message-renderer">
        ${textMessage} <a href="foobar.com" target="_blank">foobar.com</a> <img class="small-emoji emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer" src="https://www.youtube.com/s/gaming/emoji/828cb648/emoji_u1f642.svg" alt="🙂" shared-tooltip-text=":slightly_smiling_face:" id="emoji-2">
        <tp-yt-paper-tooltip class="style-scope yt-live-chat-text-message-renderer" role="tooltip" tabindex="-1" style="--paper-tooltip-delay-in:0ms; inset: -54.9886px auto auto 305.49px;">
           <!--css-build:shady-->
           <div id="tooltip" class="style-scope tp-yt-paper-tooltip hidden">
              :slightly_smiling_face:
           </div>
        </tp-yt-paper-tooltip>
     </span>
     <span id="deleted-state" class="style-scope yt-live-chat-text-message-renderer"></span><a id="show-original" href="#" class="style-scope yt-live-chat-text-message-renderer"></a>
  </div>
  <div id="menu" class="style-scope yt-live-chat-text-message-renderer">
     <yt-icon-button id="menu-button" class="style-scope yt-live-chat-text-message-renderer" touch-feedback="">
        <!--css-build:shady-->
        <button id="button" class="style-scope yt-icon-button" aria-label="Comment actions">
           <yt-icon icon="more_vert" class="style-scope yt-live-chat-text-message-renderer">
              <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                 <g class="style-scope yt-icon">
                    <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z" class="style-scope yt-icon"></path>
                 </g>
              </svg>
              <!--css-build:shady-->
           </yt-icon>
        </button>
        <yt-interaction id="interaction" class="circular style-scope yt-icon-button">
           <!--css-build:shady-->
           <div class="stroke style-scope yt-interaction"></div>
           <div class="fill style-scope yt-interaction"></div>
        </yt-interaction>
     </yt-icon-button>
  </div>
  <div id="inline-action-button-container" class="style-scope yt-live-chat-text-message-renderer" aria-hidden="true">
     <div id="inline-action-buttons" class="style-scope yt-live-chat-text-message-renderer"></div>
  </div>
</yt-live-chat-text-message-renderer>
`;

  it('should parse yt-live-chat-text-message-renderer', () => {
    const el = document.createElement('div');
    el.innerHTML = chatHtml;
    const info = parseChat(el, 'yt-live-chat-text-message-renderer');
    expect(info.author).toEqual(author);
    expect(info.avatarUrl).toEqual(avatarUrl);
    console.log(info);
  });
});

describe('ytchat.utils.member.month.chat', () => {
  const donation = '£1.79';
  const author = 'Mike Tyson';
  const textMessage = 'Hello world';
  const avatarUrl = `https://yt4.ggpht.com/ytc/AKedOLSnlIuga-vlYhtxHT1MXe8aLhk-wT89EkJqiQ=s256-c-k-c0x00ffffff-no-rj`;
  const chatHtml = `
<yt-live-chat-paid-message-renderer class="style-scope yt-live-chat-item-list-renderer" id="ChwKGkNPdTFrNG4xeGZRQ0ZjNzV3UW9kZGpRQXR3" allow-animations="" style="--yt-live-chat-paid-message-primary-color:rgba(0,229,255,1); --yt-live-chat-paid-message-secondary-color:rgba(0,184,212,1); --yt-live-chat-paid-message-header-color:rgba(0,0,0,1); --yt-live-chat-paid-message-author-name-color:rgba(0,0,0,0.701961); --yt-live-chat-paid-message-timestamp-color:rgba(0,0,0,0.501961); --yt-live-chat-paid-message-color:rgba(0,0,0,1);"><!--css-build:shady--><div id="card" class="style-scope yt-live-chat-paid-message-renderer">
  <div id="header" class="style-scope yt-live-chat-paid-message-renderer">

      <yt-img-shadow id="author-photo" height="40" width="40" class="style-scope yt-live-chat-paid-message-renderer no-transition" style="background-color: transparent;" loaded=""><!--css-build:shady--><img id="img" class="style-scope yt-img-shadow" alt="" height="40" width="40" src="${avatarUrl}"></yt-img-shadow>
    <dom-if restamp="" class="style-scope yt-live-chat-paid-message-renderer"><template is="dom-if"></template></dom-if>
    <dom-if class="style-scope yt-live-chat-paid-message-renderer"><template is="dom-if"></template></dom-if>
    <div id="header-content" class="style-scope yt-live-chat-paid-message-renderer">
      <div id="header-content-primary-column" class="style-scope yt-live-chat-paid-message-renderer">
        <div id="author-name" class="style-scope yt-live-chat-paid-message-renderer">${author}</div>
        <div id="purchase-amount-column" class="style-scope yt-live-chat-paid-message-renderer">
          <yt-img-shadow id="currency-img" height="16" width="16" class="style-scope yt-live-chat-paid-message-renderer no-transition" hidden=""><!--css-build:shady--><img id="img" class="style-scope yt-img-shadow" alt="" height="16" width="16"></yt-img-shadow>
          <div id="purchase-amount" class="style-scope yt-live-chat-paid-message-renderer">
            <yt-formatted-string class="style-scope yt-live-chat-paid-message-renderer">${donation}</yt-formatted-string>
          </div>
        </div>
      </div>
      <span id="timestamp" class="style-scope yt-live-chat-paid-message-renderer">3:06 PM</span>
    </div>
    <div id="menu" class="style-scope yt-live-chat-paid-message-renderer">
      <yt-icon-button id="menu-button" class="style-scope yt-live-chat-paid-message-renderer" touch-feedback=""><!--css-build:shady--><button id="button" class="style-scope yt-icon-button" aria-label="Comment actions">
        <yt-icon icon="more_vert" class="style-scope yt-live-chat-paid-message-renderer"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z" class="style-scope yt-icon"></path></g></svg><!--css-build:shady--></yt-icon>
      </button><yt-interaction id="interaction" class="circular style-scope yt-icon-button"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></yt-icon-button>
    </div>
  </div>
  <div id="content" class="style-scope yt-live-chat-paid-message-renderer">
    <div id="message" dir="auto" class="style-scope yt-live-chat-paid-message-renderer">${textMessage}</div>
    <div id="input-container" class="style-scope yt-live-chat-paid-message-renderer">
      <dom-if class="style-scope yt-live-chat-paid-message-renderer"><template is="dom-if"></template></dom-if>
    </div>
    <yt-formatted-string id="deleted-state" class="style-scope yt-live-chat-paid-message-renderer"><!--css-build:shady--></yt-formatted-string>
    <div id="footer" class="style-scope yt-live-chat-paid-message-renderer"></div>
  </div>
</div>
<div id="buy-flow-button" class="style-scope yt-live-chat-paid-message-renderer" hidden=""></div>
<div id="inline-action-button-container" class="style-scope yt-live-chat-paid-message-renderer" aria-hidden="true">
  <div id="inline-action-buttons" class="style-scope yt-live-chat-paid-message-renderer"></div>
</div>
</yt-live-chat-paid-message-renderer>`;

  it('should parse yt-live-chat-paid-message-renderer', () => {
    const el = document.createElement('div');
    el.innerHTML = chatHtml;
    const info = parseChat(el, 'yt-live-chat-paid-message-renderer');
    expect(info.author).toEqual(author);
    expect(info.avatarUrl).toEqual(avatarUrl);
    expect(info.donation).toEqual(donation);
    console.log(info);
  });
});
