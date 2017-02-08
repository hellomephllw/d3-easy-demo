const d3 = require('d3');

let divSelection = d3.select('body').insert('div', 'script');

let pElesSelection = divSelection.selectAll('p')
    .data([1, 2, 3])
    .enter()
    .append('p')
    .text(d => d);

pElesSelection[0].map((ele, i) => {
    console.log(i);
    if (i == 1) {
        d3.select(ele).remove();
        pElesSelection[0].splice(i, 1);
    }
});

console.log(pElesSelection);