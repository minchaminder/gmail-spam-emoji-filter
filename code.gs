// Define where to look for emojis: "sender", "subject", "both", or "either"
var searchScope = "either";

function processSpamEmails() {
  var spamThreads = GmailApp.getSpamThreads();

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);
      var subject = messages[j].getSubject();
      var shouldProcess = false;

      Logger.log("Checking email from: " + senderName + " with subject: " + subject);

      if (searchScope === "sender" && containsEncodedEmoji(senderName)) {
        shouldProcess = true;
      } else if (searchScope === "subject" && containsEmoji(subject)) {
        shouldProcess = true;
      } else if (searchScope === "both" && containsEncodedEmoji(senderName) && containsEmoji(subject)) {
        shouldProcess = true;
      } else if (searchScope === "either" && (containsEncodedEmoji(senderName) || containsEmoji(subject))) {
        shouldProcess = true;
      }

      if (shouldProcess) {
        Logger.log("Moving to trash: " + senderName + " - " + subject);
        messages[j].moveToTrash();
      }
    }
  }
}

function permanentlyDeleteProcessedEmails() {
  var spamThreads = GmailApp.getSpamThreads();
  var emailsToDelete = [];

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);
      var subject = messages[j].getSubject();
      var shouldDelete = false;

      Logger.log("Checking email from: " + senderName + " with subject: " + subject);

      if (searchScope === "sender" && containsEncodedEmoji(senderName)) {
        shouldDelete = true;
      } else if (searchScope === "subject" && containsEmoji(subject)) {
        shouldDelete = true;
      } else if (searchScope === "both" && containsEncodedEmoji(senderName) && containsEmoji(subject)) {
        shouldDelete = true;
      } else if (searchScope === "either" && (containsEncodedEmoji(senderName) || containsEmoji(subject))) {
        shouldDelete = true;
      }

      if (shouldDelete) {
        Logger.log("Preparing to delete: " + senderName + " - " + subject);
        messages[j].moveToTrash();
        emailsToDelete.push(messages[j].getId());
      }
    }
  }

  Logger.log("Emails to delete: " + emailsToDelete.length);
  if (emailsToDelete.length > 0) {
    deleteEmailsInTrash(emailsToDelete);
  } else {
    Logger.log("No emails to delete.");
  }
}

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
      method: 'DELETE',
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

function extractSenderName(rawContent) {
  var senderMatch = rawContent.match(/From: (.*?)</);
  return senderMatch ? senderMatch[1].trim() : '';
}

function containsEncodedEmoji(text) {
  const encodedEmojiRegex = /=\?utf-8\?Q\?.*?=([0-9A-F]{2})/i;
  return encodedEmojiRegex.test(text);
}

function containsEmoji(text) {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
}

function testExtractAndLogProcessedEmails() {
  var spamThreads = GmailApp.getSpamThreads();

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);
      var subject = messages[j].getSubject();
      var shouldLog = false;

      Logger.log("Checking email from: " + senderName + " with subject: " + subject);

      if (searchScope === "sender" && containsEncodedEmoji(senderName)) {
        shouldLog = true;
      } else if (searchScope === "subject" && containsEmoji(subject)) {
        shouldLog = true;
      } else if (searchScope === "both" && containsEncodedEmoji(senderName) && containsEmoji(subject)) {
        shouldLog = true;
      } else if (searchScope === "either" && (containsEncodedEmoji(senderName) || containsEmoji(subject))) {
        shouldLog = true;
      }

      if (shouldLog) {
        Logger.log("Found encoded emoji: " + senderName + " - " + subject);
      }
    }
  }
}
