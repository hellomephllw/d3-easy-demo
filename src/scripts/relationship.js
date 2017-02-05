/**
 * Created by wb-llw259548 on 2017/1/18.
 */
import * as d3 from 'd3';

//关联
function Relevance(name) {
    this.name = name;
    this.type = 'relevance';
}
//人
function Person(name) {
    this.name = name;
    this.type = 'person';
}
//连线
function Line(source, target) {
    this.source = source;
    this.target = target;
}

// let source
let eles = [

    ],
    lines = [

    ];