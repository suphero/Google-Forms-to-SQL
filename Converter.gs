function convertExcel2Sheets(excelFile, filename, arrParents) {
  var parents = arrParents || [];
  if (!parents.isArray) parents = [];

  var uploadParams = getUploadParams(excelFile);
  var uploadResponse = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v2/files/?uploadType=media&convert=true', uploadParams);
  var fileDataResponse = JSON.parse(uploadResponse.getContentText());
  var payloadData = getPayloadData(filename, parents);
  var updateParams = getUpdateParams(payloadData);

  UrlFetchApp.fetch('https://www.googleapis.com/drive/v2/files/' + fileDataResponse.id, updateParams);
  return SpreadsheetApp.openById(fileDataResponse.id);
}

function getUploadParams(excelFile){
  return {
    method: 'post',
    contentType: 'application/vnd.ms-excel',
    contentLength: excelFile.getBytes().length,
    headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: excelFile.getBytes()
  };
}

function getUpdateParams(payloadData){
  return {
    method: 'put',
    headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
    contentType: 'application/json',
    payload: JSON.stringify(payloadData)
  };
}

function getPayloadData(filename, parents){
  var payloadData = { title: filename, parents: [] };
  if (parents.length) {
    for (var i = 0; i < parents.length; i++) {
      try {
        var folder = DriveApp.getFolderById(parents[i]);
        payloadData.parents.push({
          id: parents[i]
        });
      } catch (e) {}
    }
  }
  return payloadData;
}