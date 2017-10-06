function getSqlString(text, type) {
  switch(type) {
    case 'string': return "'" + text + "'";
    case 'number': return text;
    case 'boolean': return text ? 1 : 0;
    default: return text;
  }
}

function sendMail(email, subject, htmlBody) {
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  });
}

function unifyString(text) {
  var regEx = new RegExp(' ', 'g')
  return text.replace(regEx, "").toLowerCase();
}

function getDataFromUrl(url) {
  var id = getIdFromUrl(url);
  var xlsFile = DriveApp.getFileById(id);
  var xlsBlob = xlsFile.getBlob();
  var xlsFilename = xlsFile.getName();
  var destFolders = [];
  var spreadSheet = convertExcel2Sheets(xlsBlob, xlsFilename, destFolders);
  return spreadSheet.getActiveSheet().getDataRange().getValues();
}

function getIdFromUrl(url) {
  var split = url.split("=");
  return split[1];
}