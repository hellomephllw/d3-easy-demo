const d3 = require('d3');

let numbers = [54, 23, 77, 11, 34];

numbers.sort(d3.ascending);

console.log(numbers);

let arr = ['a', '1', '5', '2', 'b'];

console.log(d3.bisectLeft(numbers, 54));

console.log(arr);