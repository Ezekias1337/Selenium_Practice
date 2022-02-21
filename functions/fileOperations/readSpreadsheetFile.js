const xlsx = require("xlsx");
const colors = require("colors");
const promptUploadOrScanDirectory = require("../userPrompts/individual/promptUploadDirectory");
const promptFileName = require("../userPrompts/individual/promptFileName");
const removeQuotesFromObjectKeys = require("../general/removeQuotesFromObjectKeys");

const readSpreadsheetFile = async () => {
  const uploadDirectoryPreSlashCheck = await promptUploadOrScanDirectory();
  const slashChecker = uploadDirectoryPreSlashCheck.charAt(
    uploadDirectoryPreSlashCheck.length - 1
  );

  let uploadDirectory = "";

  if (slashChecker === "/" || slashChecker === "\\") {
    uploadDirectory = uploadDirectoryPreSlashCheck;
  } else {
    uploadDirectory = uploadDirectoryPreSlashCheck + "\\";
  }

  const fileName = await promptFileName(uploadDirectory);
  const fileNameConcatenated = uploadDirectory.concat(fileName);
  const fileNameBackSlashesSwapped = fileNameConcatenated.replace(/\\/g, "/");
  console.log("\n");
  console.log("Using file: ", colors.green.bold(fileNameBackSlashesSwapped));
  console.log("\n");

  let workbook = xlsx.readFile(fileNameBackSlashesSwapped);
  let sheetNameList = workbook.SheetNames;
  let worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

  const arrayOfObjects = [];

  for (const item of Object.entries(worksheet)) {
    const arrayOfObjectsKeysParsed = removeQuotesFromObjectKeys(item[1]);
    arrayOfObjects.push(arrayOfObjectsKeysParsed);
  }

  return arrayOfObjects;
};

module.exports = readSpreadsheetFile;
