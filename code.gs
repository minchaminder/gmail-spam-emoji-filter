function moveToTrashSpamEmailsWithEncodedEmojisInSender() {
  var spamThreads = GmailApp.getSpamThreads();

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);

      if (containsEncodedEmoji(senderName)) {
        Logger.log("Moving to trash: " + senderName); // Log only if the sender name contains encoded emoji
        messages[j].moveToTrash(); // Move the email to trash
      }
    }
  }
}

function permanentlyDeleteSpamEmailsWithEncodedEmojisInSender() {
  var spamThreads = GmailApp.getSpamThreads();
  var emailsToDelete = [];

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);

      if (containsEncodedEmoji(senderName)) {
        Logger.log("Preparing to delete: " + senderName); // Log only if the sender name contains encoded emoji
        messages[j].moveToTrash(); // Move the email to trash
        emailsToDelete.push(messages[j].getId());
      }
    }
  }

  Logger.log("Emails to delete: " + emailsToDelete.length);
  if (emailsToDelete.length > 0) {
    // Permanently delete emails in the trash
    deleteEmailsInTrash(emailsToDelete);
  } else {
    Logger.log("No emails to delete.");
  }
}

// Helper function to permanently delete specific emails using Gmail API
function deleteEmailsInTrash(emailIds) {
  if (!emailIds || emailIds.length === 0) {
    Logger.log("No email IDs provided for deletion.");
    return;
  }

  const baseUrl = 'https://www.googleapis.com/gmail/v1/users/me/messages/';
  const accessToken = ScriptApp.getOAuthToken();

  emailIds.forEach(emailId => {
    const url = baseUrl + emailId;
    const options = {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      muteHttpExceptions: true
    };
    try {
      const response = UrlFetchApp.fetch(url, options);
      Logger.log(`Deleted email ID: ${emailId}, response: ${response.getContentText()}`);
    } catch (e) {
      Logger.log(`Failed to delete email ID: ${emailId}, error: ${e.message}`);
    }
  });
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
        Logger.log("Found encoded emoji: " + senderName); // Log only if the sender name contains encoded emoji
      }
    }
  }
}
