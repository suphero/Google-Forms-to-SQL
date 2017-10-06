var DATABASE_NAME = "DATABASE_NAME";
var TABLE_NAME = "TABLE_NAME";

var TEST_EMAIL = "TEST_EMAIL";
var TEST_FILE_TYPE = "TEST_FILE_TYPE";
var TEST_FILE_PATH = "TEST_FILE_DRIVE_PATH" // File path in google drive starts with https://drive.google.com/open?id=

function onFormSubmit(e) {
  var submitDate = e.values[0];
  var email = e.values[1];
  var fileType = e.values[2];
  var excelPath = e.values[3];
  
  var userData = getDataFromUrl(excelPath);
  var mappedData = mapUserData(userData);
  var scriptFromData = generateScript(mappedData);
  var subject = fileType + " result script submitted at " + submitDate;
  
  sendMail(email, subject, scriptFromData);
}

function testFormSubmit() {
  var e = {values:  [
    (new Date()).toString(),
    TEST_EMAIL,
    TEST_FILE_TYPE,
    TEST_FILE_PATH
  ]};
  onFormSubmit(e);
}

function mapUserData(data) {
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var item = [];
    for(var j = 0; j < data[i].length; j++) {
      var trimmedHeader = unifyString(data[0][j].toString());
      var cellData = data[i][j].toString();
      
      if(trimmedHeader === unifyString("Column One")) item.columnOne = cellData;
      if(trimmedHeader === unifyString("Column Two")) item.columnTwo = cellData;
      if(trimmedHeader === unifyString("Column Three")) item.columnThree = cellData;
      if(trimmedHeader === unifyString("Column Four")) item.columnFour = cellData;
      if(trimmedHeader === unifyString("Column Five")) item.columnFive = cellData;
      if(trimmedHeader === unifyString("Column Six")) item.columnSix = cellData;
      if(trimmedHeader === unifyString("Column Seven")) item.columnSeven = cellData;
      if(trimmedHeader === unifyString("Column Eight")) item.columnEight = cellData;
      if(trimmedHeader === unifyString("Column Nine")) item.columnNine = cellData;
      if(trimmedHeader === unifyString("Column Ten")) item.columnTen = cellData;
    }
    result.push(item);
  }
  return result;
}

function generateScript(data) {
  var headerScriptText = generateHeaderScript();
  var dataScriptText = generateDataScript(data);
  return [headerScriptText, dataScriptText].join("<br/>");
}

function generateHeaderScript() {
  var script = [];
  script.push("USE " + DATABASE_NAME);
  script.push("GO");
  script.push("INSERT INTO " + TABLE_NAME);
  script.push("VALUES");
  
  return script.join("<br/>");
}

function generateDataScript(data) {
  var dataScript = [];
  for (var i = 0; i < data.length; i++) {
    var line = data[i];
    
    var innerScript = [];
    innerScript.push(getSqlString(line.columnOne, 'string'));
    innerScript.push(getSqlString(line.columnTwo, 'number'));
    innerScript.push(getSqlString(line.columnThree, 'boolean'));
    innerScript.push(getSqlString(line.columnFour, 'string'));
    innerScript.push(getSqlString(line.columnFive, 'number'));
    innerScript.push(getSqlString(line.columnSix, 'boolean'));
    innerScript.push(getSqlString(line.columnSeven, 'string'));
    innerScript.push(getSqlString(line.columnEight, 'number'));
    innerScript.push(getSqlString(line.columnNine, 'boolean'));
    innerScript.push(getSqlString(line.columnTen, 'string'));
    
    var innerScriptText = "(" + innerScript.join(",") + ")";
    dataScript.push(innerScriptText);
  }
  return dataScript.join(",<br/>");
}