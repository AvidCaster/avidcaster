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
