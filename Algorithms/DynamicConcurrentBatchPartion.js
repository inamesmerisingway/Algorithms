totalRows = 31600;
maxBatchSize = 10000;
concurrency = 3;
pageSize = 1000;

// Sample Data Generating Function
function generatePageRanges(totalRows, pageSize) {
  var output = [];
  for (var i = 0; i < Math.ceil(totalRows / pageSize); i++) {
    output.push({ index: i });
  }
  return output;
}

function getPageRangesForLen(array, pageRanges) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var subArr = [];
    for (var j = array[i]["start"]; j < array[i]["end"]; j++) {
      subArr.push(pageRanges[j]);
    }
    result.push(subArr);
  }

  return result;
}

function generateIndexdObjBatches(array) {
  var output = [];
  var obj = {};
  for (var i = 0; i < array.length; i++) {
    obj = {};
    if (array[i] > 0) {
      if (i == 0) {
        obj["start"] = i;
        obj["end"] = array[i];
        output.push(obj);
      } else {
        obj["start"] = output[i - 1]["end"];
        obj["end"] = output[i - 1]["end"] + array[i];
        output.push(obj);
      }
    }
  }

  return output;
}

function populatePageRanges(array, pageRanges) {
  return getPageRangesForLen(generateIndexdObjBatches(array), pageRanges);
}

var pageRanges = generatePageRanges(totalRows, pageSize);
var batches = [];

if (totalRows > 0) {
  var limit = maxBatchSize * concurrency;

  if (totalRows <= pageSize) {
    batches = [pageRanges];
  } else if (totalRows > pageSize && totalRows <= limit) {
    var indexLenBatch = [];
    for (var j = 0; j < concurrency; j++) {
      batch = Math.ceil(totalRows / (concurrency - j) / pageSize);
      indexLenBatch.push(batch);
      if (totalRows < batch * pageSize) {
        totalRows = 0;
      } else {
        totalRows -= batch * pageSize;
      }
    }
    console.log(indexLenBatch);
    batches = populatePageRanges(indexLenBatch, pageRanges);
  } else {
    var fullBatchLen = Math.floor(totalRows / limit);
    var excess = totalRows % limit;
    var indexLenBatch = [];

    // Fill Full Batches
    for (var x = 0; x < fullBatchLen; x++) {
      for (var item of Array(concurrency).fill(maxBatchSize / pageSize)) {
        indexLenBatch.push(item);
      }
    }

    // Fill Indexed batches
    for (var j = 0; j < concurrency; j++) {
      batch = Math.ceil(excess / (concurrency - j) / pageSize);
      indexLenBatch.push(batch);
      if (excess < batch * pageSize) {
        excess = 0;
      } else {
        excess -= batch * pageSize;
      }
    }
    console.log(indexLenBatch);
    batches = populatePageRanges(indexLenBatch, pageRanges);
  }
}

console.log(batches);

// Output
// [10, 10, 10, 1, 1, 0][
//   ([{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }, { index: 6 }, { index: 7 }, { index: 8 }, { index: 9 }],
//   [
//     { index: 10 },
//     { index: 11 },
//     { index: 12 },
//     { index: 13 },
//     { index: 14 },
//     { index: 15 },
//     { index: 16 },
//     { index: 17 },
//     { index: 18 },
//     { index: 19 },
//   ],
//   [
//     { index: 20 },
//     { index: 21 },
//     { index: 22 },
//     { index: 23 },
//     { index: 24 },
//     { index: 25 },
//     { index: 26 },
//     { index: 27 },
//     { index: 28 },
//     { index: 29 },
//   ],
//   [{ index: 30 }],
//   [{ index: 31 }])
// ];
