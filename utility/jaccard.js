export const jaccard = function (numFails, numTotalTestFails, numPasses) {
  let s = numFails / (numTotalTestFails + numPasses);
  return s;
};
