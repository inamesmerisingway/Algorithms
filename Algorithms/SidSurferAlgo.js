/*
 * File: SidSurferAlgo.js
 * Author: Sidharth Gupta
 * Copyright (c) 2020 InAMesmerisingWay
 */

const max = 10051729;
var index = 0;
var element = 0;

function sumBatches(batches) {
  var summedBatches = [];
  var sum;
  for (var i = 0; i < batches.length; i++) {
    sum = 0;
    for (var j = 0; j < batches[i].length; j++) {
      sum += batches[i][j];
    }
    summedBatches.push(sum);
  }

  return summedBatches;
}

function possiblePlaceWithLessMax(prevMax, summedBatches, element, j) {
  var tmp = [];
  var newMax = 10051729;

  for (var i = 0; i < summedBatches.length; i++) {
    tmp = [...summedBatches];
    tmp[i] += element;
    newMax = Math.max(...tmp);
    console.log(tmp);
    if (Number(newMax) <= Number(prevMax)) {
      return true;
    }
  }

  return false;
}

function doesNotIncreasesMax(element, batches, j) {
  var summedBatches = sumBatches(batches);
  var prevMax = Math.max(...summedBatches);

  var tmp = [...summedBatches];
  tmp[j] += element;
  var newMax = Math.max(...tmp);

  if (Number(newMax) > Number(prevMax)) {
    if (possiblePlaceWithLessMax(prevMax, summedBatches, element, j)) {
      return false;
    } else {
      return true;
    }
  }

  return true;
}

function sidsurfer(arr, bins) {
  var batches = [];
  for (var i = 0; i < bins; i++) {
    batches.push([]);
  }

  var len = arr.length;
  for (var i = 0; i < len; i++) {
    if (arr.length) {
      if (i % 2 == 0) {
        for (var j = 0; j < bins; j++) {
          if (arr.length) {
            element = Math.max(...arr);
            if (doesNotIncreasesMax(element, batches, j)) {
              batches[j].push(element);

              index = arr.indexOf(element);
              if (index > -1) {
                arr.splice(index, 1);
              }
            }
          } else {
            break;
          }
        }
      } else {
        for (var j = bins - 1; j >= 0; j--) {
          if (arr.length) {
            element = Math.max(...arr);
            if (doesNotIncreasesMax(element, batches, j)) {
              batches[j].push(element);

              index = arr.indexOf(element);
              if (index > -1) {
                arr.splice(index, 1);
              }
            }
          } else {
            break;
          }
        }
      }
    } else {
      break;
    }
  }

  return batches;
}

var arr = [14, 8, 3, 20, 25, 2, 2, 3, 4, 2, 1, 1, 5, 2, 2, 3, 4, 2, 1, 1, 5];
var bins = 5;
sidsurfer(arr, bins);
