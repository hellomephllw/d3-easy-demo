/**
 * Created by henry.xuef on 14-9-12. 1. A graph/tree layout algorithm based on
 * force like: attraction, replusion, gravity 2. Functioning based on D3 event
 * framework, so it is under class d3.layout
 */
define(function(require, module, exports) {
	// var d3 = require('d3');

    // Vars
    var nodes, links, size, nodediameter, nodediameter2, linkDistance;
    var cores;
    var gravity, rubberStrength, springStrength;
    var repulsionStrength;
    var event, drag, alpha, isneedinit, tickcounts;
    var layoutFunc;

	treeforcelayout = function() {
        // Vars
        nodes = [], links = [], size = [ 100, 100 ], nodediameter = 100, nodediameter2 = 10000, linkDistance = 10;
        cores = [];
        gravity = .0008, rubberStrength = 0.2, springStrength = 0.1;
        repulsionStrength = 500.0;
        event = d3.dispatch("start", "tick", "end"), drag, alpha, isneedinit = true, tickcounts = 0;
        layoutFunc = Layout_GalaxyRubber;

		var force = {};

		// Start, tick tick tick...
		force.start = function() {
			if (!nodes) nodes = [];

			if (!isneedinit)
				return force.resume();

			// nodes init: index/weight/degree/x/y/px/py/dx/dy/fixed
			// tree's root mark (cores)
			cores = [];
			for ( var i in nodes) {
				var n = nodes[i];
				n.index = i;

				if (isNaN(n.weight))
					n.weight = 1;
				n.degree = 0;
				n.dx = n.dy = 0;
				if (isNaN(n.x))
					n.x = Math.random() * size[0];
				if (isNaN(n.y))
					n.y = Math.random() * size[1];
				if (isNaN(n.px))
					n.px = n.x;
				if (isNaN(n.py))
					n.py = n.y;

				if (isNaN(n.fixed))
					n.fixed = 0;
				if (isNaN(n.core))
					n.core = false;
				if (isNaN(n.disabled))
					n.is_disabled = false;

				n.parent = null;
				n.children = [];

				if (n.core != undefined && n.core)
					cores.push(n);
			}

			// update edge: source/target/degree/linkDistance
			// build neighbors
			var neighbors = new Array(nodes.length);
			for (var i = 0; i < neighbors.length; ++i) {
				neighbors[i] = [];
			}

			for ( var i in links) {
				var e = links[i];
				if (e.is_disabled)
					continue;
				if (typeof e.source != "object")
					e.source = nodes[e.source];
				if (typeof e.target != "object")
					e.target = nodes[e.target];
				++e.source.degree;
				++e.target.degree;

				if (typeof linkDistance === "function")
					e.linkDistance = linkDistance.call(this, e, i);
				else
					e.linkDistance = linkDistance;

				if (e.is_disabled)
					continue; // if edge is disabled, should be ignored.

				neighbors[e.source.index].push(e.target);
				neighbors[e.target.index].push(e.source);
			}

			// build tree: nodes's parent/children/treelevel
			for ( var i in cores) {
				var rootn = cores[i];
				rootn.treelevel = 0;
				rootn.parent = null;

				var queue = [];
				queue.push(rootn);

				while (queue.length) {
					var topn = queue.shift();

					// find children
					topn.children = [];
					var topn_neighbor = neighbors[topn.index];

					for ( var i in topn_neighbor) {
						var n = topn_neighbor[i];

						if (n != topn.parent) {
							n.treelevel = topn.treelevel + 1;
							n.parent = topn;

							topn.children.push(n);
							queue.push(n);

							treeDepth = n.treelevel;
						}
					}
				}
			}
			return force.resume();
		};

		// Stop iteration
		force.stop = function() {
			return force.alpha(0);
		};

		// Every iteration
		force.tick = function() {
			++tickcounts;

			// Cool down
			if ((alpha *= .99) < 0.0001) {
				event.end({
					type : "end",
					alpha : alpha = 0
				});
				return true;
			}

			// init
			for ( var i in nodes) {
				var n = nodes[i];
				n.dx = n.dy = 0;
			}

			// Layout
			layoutFunc();

			// apply forces
			for ( var i in nodes) {
				var n = nodes[i];
				if (n.is_disabled)
					continue;

				if (n.fixed) {
					n.x = n.px;
					n.y = n.py;
					continue;
				}
				if (n.core)
					continue;

				n.px = n.x;
				n.py = n.y;
				n.x = n.x + n.dx;
				n.y = n.y + n.dy;

				if (n.x < 40)
					n.x = 40;
				if (n.x > size[0] - 40)
					n.x = size[0] - 40;
				if (n.y < 40)
					n.y = 40;
				if (n.y > size[1] - 40)
					n.y = size[1] - 40;
			}

			event.tick({
				type : "tick",
				alpha : alpha
			});
		};

		// Resume
		force.resume = function() {
			return force.alpha(.2);
		};

		// Update data: nodes
		force.nodes = function(x) {
			if (!arguments.length)
				return nodes;
			nodes = x;
			isneedinit = true;
			return force;
		};

		// Update data: links
		force.links = function(x) {
			if (!arguments.length)
				return links;
			links = x;
			isneedinit = true;
			return force;
		};

		// Set size: size
		force.size = function(x) {
			if (!arguments.length)
				return size;
			size = x;
			return force;
		};

		// Set node diameter
		force.nodediameter = function(x) {
			if (!arguments.length)
				return nodediameter;
			nodediameter = +x;
			nodediameter2 = nodediameter * nodediameter;
			return force;
		}

		// Set link distance
		force.linkDistance = function(x) {
			if (!arguments.length)
				return linkDistance;
			linkDistance = typeof x === "function" ? x : +x;
			return force;
		}

		// Set gravity
		force.gravity = function(x) {
			if (!arguments.length)
				return gravity;
			gravity = +x;
			return force;
		};

		// Set ruuber strength
		force.rubberStrength = function(x) {
			if (!arguments.length)
				return rubberStrength;
			rubberStrength = +x;
			return force;
		}

		// Set spring strength
		force.springStrength = function(x) {
			if (!arguments.length)
				return springStrength;
			springStrength = +x;
			return force;
		}

		// Set repulsion strength
		force.repulsionStrength = function(x) {
			if (!arguments.length)
				return repulsionStrength;
			repulsionStrength = +x;
			return force;
		}

		// Enable/Disable a subtree
		force.enable_disable_subtree = function(root, is_disable) {
			if (typeof root === "number")
				root = nodes[root];

			if (root === undefined || root.parent === undefined
					|| root.children === undefined) {
				console
						.log("(force.enable_disable_subtree) Didn't know the given node. Or it is not a tree.");
				return null;
			}

			var result = [];
			var queue = [];
			queue.push(root);
			while (queue.length) {
				var topn = queue.shift();
				topn.is_disabled = is_disable;
				result.push(topn);

				for ( var i in topn.children) {
					var n = topn.children[i];
					queue.push(n);
				}
			}

			root.is_disabled = false;
			result.shift();
			return result;
		}

		// Set alpha
		force.alpha = function(x) {
			if (!arguments.length)
				return alpha;
			x = +x;
			if (alpha) { // on going
				x > 0 ? alpha = x : alpha = 0;
			} else { // stoped
				if (x > 0) {
					event.start({
						type : "start",
						alpha : alpha = x
					});
					d3.timer(force.tick);
				}
			}
			return force;
		};

		force.charge = function(x) {
			// console.log("Does not support in ydforcelayout.");
			return force;
		}

		force.drag = function() {
			if (!drag) {
				drag = d3.behavior.drag().origin(function(d) {
					return d;
				}).on("dragstart.force", DragStart).on("drag.force", DragMove)
						.on("dragend.force", DragEnd);
			}

			if (!arguments.length)
				return drag;

			this.on("mouseover.force", ForceMouseOver).on("mouseout.force",
					ForceMouseOut).call(drag);
			// console.log("force.drag", arguments);
		};

		force.setlayout_sns = function() {
			layoutFunc = Layout_GalaxyRubber;
		}
		force.setlayout_tree = function() {
			layoutFunc = Layout_Tree;
		}


		// Layout: Galaxy Spring Layout
		// Like sns network
		function Layout_GalaxyRubber() {
			// weight = degree
			for ( var i in nodes)
				nodes[i].weight = nodes[i].degree;

			// Gravity
			for ( var i in nodes) {
				Gravity_Point(nodes[i], [ size[0] * 0.5, size[1] * 0.5 ]);
			}

			// Replusion
			for ( var i1 in nodes) {
				for ( var i2 in nodes) {
					if (i1 == i2)
						continue;
					var n1 = nodes[i1];
					var n2 = nodes[i2];
					Replusion_Galaxy(n1, n2, null);
				}
			}

			// Attraction
			for ( var i in links) {
				var e = links[i];
				if (e.is_disabled)
					continue;
				Attraction_RubberBand(e, null);
			}
		}

		// Layout: Tree Layout
		// Like a tree
		function Layout_Tree() {
			// weight = degree
			for ( var i in nodes)
				nodes[i].weight = nodes[i].degree;

			// Gravity
			for ( var i in nodes) {
				var n = nodes[i];
				if (n.treelevel == 0 || n.treelevel % 2 == 0)
					continue;
				Gravity_Axis(n, "+y");
			}

			// Reuplusion
			for ( var i in cores) { // for every tree
				var rootn = cores[i];
				var queue = [];
				queue.push(rootn);

				// BFS to get deptharray: stores each node of the same depth
				var deptharray = {};
				deptharray.length = 0;
				while (queue.length) {
					var topn = queue.shift();
					if (deptharray[topn.treelevel] === undefined)
						deptharray[topn.treelevel] = [];
					deptharray[topn.treelevel].push(topn);
					deptharray.length = Math.max(deptharray.length,
							topn.treelevel + 1);
					for ( var i in topn.children) {
						var c = topn.children[i];
						queue.push(c);
					}
				}

				// reuplusion for children on the same depth
				for (var level = 0; level < deptharray.length; ++level) {
					var children = deptharray[level];
					for ( var i1 in children) {
						for ( var i2 in children) {
							if (i1 == i2)
								continue;
							Replusion_Galaxy(children[i1], children[i2], null);
						}
					}
				}
			}

			// Attraction
			for ( var i in links) {
				var e = links[i];
				if (e.is_disabled)
					continue;
				Attraction_RubberBand(e, null);

				var e = links[i];
				var s = e.source, t = e.target;
				var p, c;
				if (s.parent == null && t.parent == null)
					continue;

				if (s.parent == t) {
					p = t;
					c = s;
				} else {
					p = s;
					c = t;
				}

				c.dy = p.y + p.dy + e.linkDistance - c.y;
			}
		}

		// Force Element: Gravity Point
		function Gravity_Point(n, point) {
			if (n.is_disabled)
				return;

			var cx = point[0];
			var cy = point[1];

			n.dx += (cx - n.x) * gravity;
			n.dy += (cy - n.y) * gravity;
		}

		// Force Element: Gravity Axis
		function Gravity_Axis(n, axis) {
			if (n.is_disabled)
				return;

			if (axis == "+x") {
				n.dx += (size[0] - n.x) * gravity;
			} else if (axis == "-x") {
				n.dx += -n.x * gravity;
			} else if (axis == "+y") {
				n.dy += (size[1] - n.y) * gravity;
			} else if (axis == "-y") {
				n.dy += -n.y * gravity;
			}
		}

		// Force Element: Replusion (Galaxy Model)
		function Replusion_Galaxy(n1, n2, still_node) {
			if (n1 == n2)
				return;
			if (n1.is_disabled || n2.is_disabled)
				return;

			var dx = n2.x - n1.x;
			var dy = n2.y - n1.y;

			var l2 = dx * dx + dy * dy;
			if (!l2) {
				dx = nodediameter * 0.5;
				l2 = dx * dx;
			}
			var l = Math.sqrt(l2);

			var k = repulsionStrength / l2;
			var n2_dl = k * (1 + n1.weight);
			var n1_dl = k * (1 + n2.weight);

			if (n1 != still_node) {
				n1.dx -= dx / l * n1_dl;
				n1.dy -= dy / l * n1_dl;
			}
			if (n2 != still_node) {
				n2.dx += dx / l * n2_dl;
				n2.dy += dy / l * n2_dl;
			}
		}

		// Force Element: Attraction (Rubber Band Model)
		function Attraction_RubberBand(e, still_node) {
			if (e.is_disabled)
				return;
			var n1 = e.source, n2 = e.target;
			if (n1.is_disabled || n2.is_disabled)
				return;

			var dx = n2.x - n1.x;
			var dy = n2.y - n1.y;

			var l2 = dx * dx + dy * dy;
			if (l2 <= e.linkDistance * e.linkDistance)
				return;
			var l = Math.sqrt(l2);

			var k = rubberStrength * (l - e.linkDistance);
			var n1_dl = k / n1.weight;
			var n2_dl = k / n2.weight;

			if (n1 != still_node) {
				n1.dx += dx / l * n1_dl;
				n1.dy += dy / l * n1_dl;
			}
			if (n2 != still_node) {
				n2.dx -= dx / l * n2_dl;
				n2.dy -= dy / l * n2_dl;
			}
		}

		// Force Element: Attraction(Spring Model)
		function Attraction_Spring(e, still_node) {
			if (e.is_disabled)
				return;
			var n1 = e.source, n2 = e.target;
			if (n1.is_disabled || n2.is_disabled)
				return;

			var dx = n2.x - n1.x;
			var dy = n2.y - n1.y;

			var l2 = dx * dx + dy * dy;
			if (!l2) {
				dx = nodediameter * 0.5;
				l2 = dx * dx;
			}
			var l = Math.sqrt(l2);

			var k = springStrength * (l - e.linkDistance);
			var n1_dl = k / n1.weight;
			var n2_dl = k / n2.weight;

			if (n1 != still_node) {
				n1.dx += dx / l * n1_dl;
				n1.dy += dy / l * n1_dl;
			}
			if (n2 != still_node) {
				n2.dx -= dx / l * n2_dl;
				n2.dy -= dy / l * n2_dl;
			}
		}

		function DragStart(d) {
			d.fixed |= 2;
			// console.log("faforce DragStart", d.fixed);
		}

		function DragMove(d) {
			d.px = d3.event.x, d.py = d3.event.y;
			force.resume();
		}

		function DragEnd(d) {
			d.fixed &= ~6;
			// console.log("faforce DragEnd", d.fixed);
		}

		function ForceMouseOver(d) {
			d.fixed |= 4;
			d.px = d.x;
			d.py = d.y;
			// console.log("faforce ForceMouseOver", d.fixed);
		}

		function ForceMouseOut(d) {
			d.fixed &= ~4;
			// console.log("faforce ForceMouseOut", d.fixed);
		}

		return d3.rebind(force, event, "on");
	}; // d3.layout.ydforcelayout

	module.exports = {
		"treeforcelayout" : treeforcelayout
	};
});
