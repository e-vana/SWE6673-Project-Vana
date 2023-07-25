const fs = require("fs");
const path = require("path");

function readTests(cb) {
  let methodTestResultsArray = [];
  let testResults = {
    pass: 0,
    fail: 0,
    total: 0,
  };
  let files = fs.readdirSync("./tests");
  if (!files || files.length == 0 || typeof files == undefined) {
    throw "There was a problem reading this directory";
  }
  testResults.total = files.length;
  let filesProcessed = 0;
  files.forEach((file) => {
    const filePath = path.join("./tests", file);
    let fname = file.split(".txt")[0];
    let fileData = fs.readFileSync(filePath, "utf-8");
    if (!fileData) {
      throw "Error reading file data.";
    }
    let fileContents = fileData.split("\n");
    let passFailOfThisTest = fileContents[0].includes("true");
    if (passFailOfThisTest) {
      testResults.pass++;
    } else {
      testResults.fail++;
    }
    fileContents.forEach((line, index) => {
      if (index != 0) {
        let s = line.split("\r")[0];
        let z = s.split(":");
        s = z[0] + z[1];
        let containedInMethodTestResultArray = false;
        methodTestResultsArray.forEach((m) => {
          if (m.methodName == s) {
            containedInMethodTestResultArray = true;
            if (passFailOfThisTest) {
              m.passingFileIds.push(fname);
            } else {
              m.failingFileIds.push(fname);
            }
          }
        });
        if (containedInMethodTestResultArray == false) {
          let pl = {
            methodName: s,
            passingFileIds: [],
            failingFileIds: [],
          };
          if (passFailOfThisTest) {
            pl.passingFileIds.push(fname);
          } else {
            pl.failingFileIds.push(fname);
          }
          methodTestResultsArray.push(pl);
        }
      }
    });
  });
  let data = {
    methods: methodTestResultsArray,
    testSuiteInformation: testResults,
  };
  let w = fs.writeFileSync(
    "./listOfMethods.json",
    JSON.stringify(data),
    "utf-8"
  );
}
readTests();
