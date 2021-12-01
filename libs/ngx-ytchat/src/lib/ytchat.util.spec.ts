import { ytGetMessageInfo } from './ytchat.util';
const ytPaidAmount = '$25.00';
const ytMessageText = `I'm a message`;
const ytAuthorName = 'Mike Tyson';
const ytAuthorImage =
  'https://yt4.ggpht.com/ytc/AKedOLT9IYRR7w9xIsVWU6lm2cduCMOAdhEsC9VLUdf5dbRwqSbPquDozmOResxgcKBd=s32-c-k-c0x00ffffff-no-rj';
const ytMembership = `Welcome to Tier 1!`;
const ytMemberMonth = `Member for 11 months`;
const ytMemberSecondary = `Champion Club`;

const ytPaidMemberChat = `<yt-live-chat-paid-message-renderer class="style-scope yt-live-chat-item-list-renderer" id="ChwKGkNOS1E0Ym1od19RQ0ZlTV9yUVlkendvQ3ZR" allow-animations="" style="--yt-live-chat-paid-message-primary-color:rgba(245,124,0,1); --yt-live-chat-paid-message-secondary-color:rgba(230,81,0,1); --yt-live-chat-paid-message-header-color:rgba(255,255,255,0.87451); --yt-live-chat-paid-message-author-name-color:rgba(255,255,255,0.701961); --yt-live-chat-paid-message-timestamp-color:rgba(255,255,255,0.501961); --yt-live-chat-paid-message-color:rgba(255,255,255,0.87451);"><!--css-build:shady--><div id="card" class="style-scope yt-live-chat-paid-message-renderer">
  <div id="header" class="style-scope yt-live-chat-paid-message-renderer">

      <yt-img-shadow id="author-photo" height="40" width="40" class="style-scope yt-live-chat-paid-message-renderer no-transition" style="background-color: transparent;" loaded=""><!--css-build:shady--><img id="img" class="style-scope yt-img-shadow" alt="" height="40" width="40" src="${ytAuthorImage}"></yt-img-shadow>
    <dom-if restamp="" class="style-scope yt-live-chat-paid-message-renderer"><template is="dom-if"></template></dom-if>
    <dom-if class="style-scope yt-live-chat-paid-message-renderer"><template is="dom-if"></template></dom-if>
    <div id="header-content" class="style-scope yt-live-chat-paid-message-renderer">
      <div id="header-content-primary-column" class="style-scope yt-live-chat-paid-message-renderer">
        <div id="author-name" class="style-scope yt-live-chat-paid-message-renderer">${ytAuthorName}</div>
        <div id="purchase-amount-column" class="style-scope yt-live-chat-paid-message-renderer">
          <yt-img-shadow id="currency-img" height="16" width="16" class="style-scope yt-live-chat-paid-message-renderer no-transition" hidden=""><!--css-build:shady--><img id="img" class="style-scope yt-img-shadow" alt="" height="16" width="16"></yt-img-shadow>
          <div id="purchase-amount" class="style-scope yt-live-chat-paid-message-renderer">
            <yt-formatted-string class="style-scope yt-live-chat-paid-message-renderer">$25.00</yt-formatted-string>
          </div>
        </div>
      </div>
      <span id="timestamp" class="style-scope yt-live-chat-paid-message-renderer">1:46 PM</span>
    </div>
    <div id="menu" class="style-scope yt-live-chat-paid-message-renderer">
      <yt-icon-button id="menu-button" class="style-scope yt-live-chat-paid-message-renderer" touch-feedback=""><!--css-build:shady--><button id="button" class="style-scope yt-icon-button" aria-label="Comment actions">
        <yt-icon icon="more_vert" class="style-scope yt-live-chat-paid-message-renderer"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z" class="style-scope yt-icon"></path></g></svg><!--css-build:shady--></yt-icon>
      </button><yt-interaction id="interaction" class="circular style-scope yt-icon-button"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></yt-icon-button>
    </div>
  </div>
  <div id="content" class="style-scope yt-live-chat-paid-message-renderer">
    <div id="message" dir="auto" class="style-scope yt-live-chat-paid-message-renderer">${ytMessageText} </div>
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

const ytMemberChat = `<div id="header" class="style-scope yt-live-chat-membership-item-renderer">

<yt-img-shadow id="author-photo" height="40" width="40" class="style-scope yt-live-chat-membership-item-renderer no-transition" loaded="" style="background-color: transparent;"><!--css-build:shady--><img id="img" class="style-scope yt-img-shadow" alt="" height="40" width="40" src="${ytAuthorImage}"></yt-img-shadow>
<dom-if restamp="" class="style-scope yt-live-chat-membership-item-renderer"><template is="dom-if"></template></dom-if>
<dom-if class="style-scope yt-live-chat-membership-item-renderer"><template is="dom-if"></template></dom-if>
<div id="header-content" class="style-scope yt-live-chat-membership-item-renderer">
<div id="header-content-primary-column" class="style-scope yt-live-chat-membership-item-renderer">
  <div id="header-content-inner-column" class="style-scope yt-live-chat-membership-item-renderer">

      <yt-live-chat-author-chip class="style-scope yt-live-chat-membership-item-renderer"><!--css-build:shady--><span id="author-name" dir="auto" class="member style-scope yt-live-chat-author-chip">${ytAuthorName}<span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span></span><span id="chat-badges" class="style-scope yt-live-chat-author-chip"><yt-live-chat-author-badge-renderer class="style-scope yt-live-chat-author-chip" aria-label="New member" type="member" shared-tooltip-text="New member"><!--css-build:shady--><div id="image" class="style-scope yt-live-chat-author-badge-renderer"><img src="https://yt3.ggpht.com/j7jOdnVZ37bDdJmFBsNVWWG1iaqt9XY2lMzOn_zfRFG7JpFPmpuc__j0ayEsDqCeS0-AAf1vu44=s16-c-k" class="style-scope yt-live-chat-author-badge-renderer" alt="New member"></div></yt-live-chat-author-badge-renderer></span></yt-live-chat-author-chip>
    <dom-if restamp="" class="style-scope yt-live-chat-membership-item-renderer"><template is="dom-if"></template></dom-if>
    <div id="header-primary-text" class="style-scope yt-live-chat-membership-item-renderer"></div>
  </div>
  <div id="header-subtext" class="style-scope yt-live-chat-membership-item-renderer">${ytMembership}</div>
</div>
<div id="timestamp" class="style-scope yt-live-chat-membership-item-renderer">2:26 PM</div>
</div>
<div id="menu" class="style-scope yt-live-chat-membership-item-renderer">
<yt-icon-button id="menu-button" class="style-scope yt-live-chat-membership-item-renderer" touch-feedback=""><!--css-build:shady--><button id="button" class="style-scope yt-icon-button" aria-label="Comment actions">
  <yt-icon icon="more_vert" class="style-scope yt-live-chat-membership-item-renderer"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z" class="style-scope yt-icon"></path></g></svg><!--css-build:shady--></yt-icon>
</button><yt-interaction id="interaction" class="circular style-scope yt-icon-button"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></yt-icon-button>
</div>
</div>`;

const ytRegularChat = `<yt-live-chat-text-message-renderer class="style-scope yt-live-chat-item-list-renderer" id="CjsKGkNKYU01ZU90d19RQ0ZkS0s1UWNkVE9VR21nEh1DSzczck55ZndfUUNGUmpOZ2dvZGVrUUp1dy0xOQ%3D%3D" author-type="member">
<!--css-build:shady-->
<yt-img-shadow id="author-photo" class="no-transition style-scope yt-live-chat-text-message-renderer" height="24" width="24" loaded="" style="background-color: transparent;">
   <!--css-build:shady--><img id="img" class="style-scope yt-img-shadow" alt="" height="24" width="24" src="${ytAuthorImage}">
</yt-img-shadow>
<div id="content" class="style-scope yt-live-chat-text-message-renderer">
   <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">2:41 PM</span>
   <yt-live-chat-author-chip class="style-scope yt-live-chat-text-message-renderer">
      <!--css-build:shady--><span id="author-name" dir="auto" class="member style-scope yt-live-chat-author-chip">${ytAuthorName}<span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span></span>
      <span id="chat-badges" class="style-scope yt-live-chat-author-chip">
         <yt-live-chat-author-badge-renderer class="style-scope yt-live-chat-author-chip" aria-label="Member (6 months)" type="member" shared-tooltip-text="Member (6 months)">
            <!--css-build:shady-->
            <div id="image" class="style-scope yt-live-chat-author-badge-renderer"><img src="https://yt3.ggpht.com/NjOEmGu9J0Z2tQCGXdfl4mRYsBXsVicwGnlzvxhQ2hJg5d_X8qW8GIPBYiCpwz2Wooe6_anSTg=s16-c-k" class="style-scope yt-live-chat-author-badge-renderer" alt="Member (6 months)"></div>
         </yt-live-chat-author-badge-renderer>
      </span>
   </yt-live-chat-author-chip>
   <span id="message" dir="auto" class="style-scope yt-live-chat-text-message-renderer"> ${ytMessageText} </span><span id="deleted-state" class="style-scope yt-live-chat-text-message-renderer"></span><a id="show-original" href="#" class="style-scope yt-live-chat-text-message-renderer"></a>
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
</yt-live-chat-text-message-renderer>`;

const ytMemberWithMonthChat = `<yt-live-chat-membership-item-renderer class="style-scope yt-live-chat-item-list-renderer" id="Ci8KLUNKN090N3lndF9RQ0ZjeERtQW9kNGprQ1ZRLUxveU1lc0lELTMyNzY3NzgzOA%3D%3D" has-primary-header-text=""><!--css-build:shady--><div id="card" class="style-scope yt-live-chat-membership-item-renderer">
<div id="header" class="style-scope yt-live-chat-membership-item-renderer">

    <yt-img-shadow id="author-photo" height="40" width="40" class="style-scope yt-live-chat-membership-item-renderer no-transition" style="background-color: transparent;" loaded=""><!--css-build:shady--><img id="img" class="style-scope yt-img-shadow" alt="" height="40" width="40" src="${ytAuthorImage}"></yt-img-shadow>
  <dom-if restamp="" class="style-scope yt-live-chat-membership-item-renderer"><template is="dom-if"></template></dom-if>
  <dom-if class="style-scope yt-live-chat-membership-item-renderer"><template is="dom-if"></template></dom-if>
  <div id="header-content" class="style-scope yt-live-chat-membership-item-renderer">
    <div id="header-content-primary-column" class="style-scope yt-live-chat-membership-item-renderer">
      <div id="header-content-inner-column" class="style-scope yt-live-chat-membership-item-renderer">

          <yt-live-chat-author-chip class="style-scope yt-live-chat-membership-item-renderer"><!--css-build:shady--><span id="author-name" dir="auto" class="member style-scope yt-live-chat-author-chip">${ytAuthorName}<span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span></span><span id="chat-badges" class="style-scope yt-live-chat-author-chip"><yt-live-chat-author-badge-renderer class="style-scope yt-live-chat-author-chip" aria-label="Member (6 months)" type="member" shared-tooltip-text="Member (6 months)"><!--css-build:shady--><div id="image" class="style-scope yt-live-chat-author-badge-renderer"><img src="https://yt3.ggpht.com/NjOEmGu9J0Z2tQCGXdfl4mRYsBXsVicwGnlzvxhQ2hJg5d_X8qW8GIPBYiCpwz2Wooe6_anSTg=s16-c-k" class="style-scope yt-live-chat-author-badge-renderer" alt="Member (6 months)"></div></yt-live-chat-author-badge-renderer></span></yt-live-chat-author-chip>
        <dom-if restamp="" class="style-scope yt-live-chat-membership-item-renderer"><template is="dom-if"></template></dom-if>
        <div id="header-primary-text" class="style-scope yt-live-chat-membership-item-renderer">${ytMemberMonth}</div>
      </div>
      <div id="header-subtext" class="style-scope yt-live-chat-membership-item-renderer">${ytMemberSecondary}</div>
    </div>
    <div id="timestamp" class="style-scope yt-live-chat-membership-item-renderer">3:06 PM</div>
  </div>
  <div id="menu" class="style-scope yt-live-chat-membership-item-renderer">
    <yt-icon-button id="menu-button" class="style-scope yt-live-chat-membership-item-renderer" touch-feedback=""><!--css-build:shady--><button id="button" class="style-scope yt-icon-button" aria-label="Comment actions">
      <yt-icon icon="more_vert" class="style-scope yt-live-chat-membership-item-renderer"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z" class="style-scope yt-icon"></path></g></svg><!--css-build:shady--></yt-icon>
    </button><yt-interaction id="interaction" class="circular style-scope yt-icon-button"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></yt-icon-button>
  </div>
</div>
<div id="content" class="style-scope yt-live-chat-membership-item-renderer">
  <div id="message" dir="auto" class="style-scope yt-live-chat-membership-item-renderer">${ytMessageText}</div>
  <div id="input-container" class="style-scope yt-live-chat-membership-item-renderer">
    <dom-if class="style-scope yt-live-chat-membership-item-renderer"><template is="dom-if"></template></dom-if>
  </div>
  <yt-formatted-string id="deleted-state" class="style-scope yt-live-chat-membership-item-renderer"><!--css-build:shady--></yt-formatted-string>
</div>
</div>
<div id="footer-button" class="style-scope yt-live-chat-membership-item-renderer" hidden=""></div>
<div id="inline-action-button-container" class="style-scope yt-live-chat-membership-item-renderer" aria-hidden="true">
<div id="inline-action-buttons" class="style-scope yt-live-chat-membership-item-renderer"></div>
</div>
</yt-live-chat-membership-item-renderer>`;

describe('ytchat.utils.member.paid', () => {
  it('should extract info from paid member chat', () => {
    const chatInfo = ytGetMessageInfo(ytPaidMemberChat);
    expect(chatInfo.authorName).toEqual(ytAuthorName);
    expect(chatInfo.authorImage).toEqual(
      ytAuthorImage.replace('s32', 's256').replace('s64', 's256')
    );
    expect(chatInfo.message).toEqual(ytMessageText);
    expect(chatInfo.donation).toEqual(ytPaidAmount);
    expect(chatInfo.membership).toEqual('');
  });
});

describe('ytchat.utils.member', () => {
  it('should extract info from member chat', () => {
    const chatInfo = ytGetMessageInfo(ytMemberChat);
    expect(chatInfo.authorName).toEqual(ytAuthorName);
    expect(chatInfo.authorImage).toEqual(
      ytAuthorImage.replace('s32', 's256').replace('s64', 's256')
    );
    expect(chatInfo.message).toEqual('');
    expect(chatInfo.donation).toEqual('');
    expect(chatInfo.membership).toEqual(ytMembership);
  });
});

describe('ytchat.utils.regular.chat', () => {
  it('should extract info from regular chat', () => {
    const chatInfo = ytGetMessageInfo(ytRegularChat);
    expect(chatInfo.authorName).toEqual(ytAuthorName);
    expect(chatInfo.authorImage).toEqual(
      ytAuthorImage.replace('s32', 's256').replace('s64', 's256')
    );
    expect(chatInfo.message).toEqual(ytMessageText);
    expect(chatInfo.donation).toEqual('');
    expect(chatInfo.membership).toEqual('');
  });
});

describe('ytchat.utils.member.month.chat', () => {
  it('should extract info from member month chat', () => {
    const chatInfo = ytGetMessageInfo(ytMemberWithMonthChat);
    expect(chatInfo.authorName).toEqual(ytAuthorName);
    expect(chatInfo.authorImage).toEqual(
      ytAuthorImage.replace('s32', 's256').replace('s64', 's256')
    );
    expect(chatInfo.message).toEqual(ytMessageText);
    expect(chatInfo.donation).toEqual('');
    expect(chatInfo.membership).toEqual(`${ytMemberMonth} ${ytMemberSecondary}`);
  });
});
