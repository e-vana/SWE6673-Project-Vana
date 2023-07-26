export const sbi = function (numFails, numPasses) {
  let s = numFails / (numFails + numPasses);

  return s;
};
