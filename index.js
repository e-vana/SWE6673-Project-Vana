import fs from "fs";
import path from "path";
import { tarantula } from "./utility/tarantula.js";
import { sbi } from "./utility/sbi.js";
import { jaccard } from "./utility/jaccard.js";
import { ochiai } from "./utility/ochiai.js";

function readTests() {
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
            suspiciousness: {
              tarantula: 0,
              sbi: 0,
              jaccard: 0,
              ochiai: 0,
            },
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

  methodTestResultsArray.forEach((method) => {
    //run each of the tests
    method.suspiciousness.tarantula = tarantula(
      method.failingFileIds.length,
      testResults.fail,
      method.passingFileIds.length,
      testResults.pass
    );
    method.suspiciousness.sbi = sbi(
      method.failingFileIds.length,
      method.passingFileIds.length
    );
    method.suspiciousness.jaccard = jaccard(
      method.failingFileIds.length,
      testResults.fail,
      method.passingFileIds.length
    );
    method.suspiciousness.ochiai = ochiai(
      method.failingFileIds.length,
      testResults.fail,
      method.passingFileIds.length
    );
  });
  let data = {
    methods: methodTestResultsArray,
    testSuiteInformation: testResults,
  };
  let w = fs.writeFileSync(
    "./results/results.json",
    JSON.stringify(data),
    "utf-8"
  );
}
readTests();
