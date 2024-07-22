function deleteSpamEmailsWithEncodedEmojisInSender() {
  // Get the spam threads
  var spamThreads = GmailApp.getSpamThreads();
  
  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();
    
    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);
      
      if (containsEncodedEmoji(senderName)) {
        Logger.log(senderName); // Log only if the sender name contains encoded emoji
        messages[j].moveToTrash();
      }
    }
  }
}

// Helper function to extract sender name from raw content
function extractSenderName(rawContent) {
  var senderMatch = rawContent.match(/From: (.*?)</);
  return senderMatch ? senderMatch[1].trim() : '';
}

// Helper function to check if the sender name contains any encoded emoji
function containsEncodedEmoji(text) {
  const encodedEmojiRegex = /=\?utf-8\?Q\?.*?=([0-9A-F]{2})/i;
  return encodedEmojiRegex.test(text);
}

// Run a test to log the sender names for verification
function testExtractAndLogSenderNamesWithEncodedEmojis() {
  var spamThreads = GmailApp.getSpamThreads();
  
  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();
    
    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);
      
      if (containsEncodedEmoji(senderName)) {
        Logger.log(senderName); // Log only if the sender name contains encoded emoji
      }
    }
  }
}
