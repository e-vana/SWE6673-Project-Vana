export const tarantula = function (
  numFails,
  numTotalTestFails,
  numPasses,
  numTotalTestPasses
) {
  let s =
    numFails /
    numTotalTestFails /
    (numFails / numTotalTestFails + numPasses / numTotalTestPasses);
  return s;
};
