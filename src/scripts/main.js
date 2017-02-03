<<<<<<< HEAD
const d3 = require('d3');

let arr = [6, 5, 4, 3, 2, 1];

let pEles = d3.select('body').selectAll('p')
    .data(arr)
    .enter()
    .append('p');

pEles.style('color', d => {
    console.log(d);
    return 'red';
});

pEles.style('font-size', d => {
    console.log(d);
    return '14px';
});
=======
let d3 = require('d3');
>>>>>>> e624b93a5ac985f40e1f7cb50d65f65e48b0dd6a
