export const ochiai = function (numFails, numTotalTestFails, numPasses) {
  let s = numFails / Math.sqrt(numTotalTestFails * (numPasses + numFails));
  return s;
};
