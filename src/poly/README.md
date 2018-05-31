# Polyhera

## HISTORY

- [29 - basic](http://playground.babylonjs.com/#TGNTGT#29)
- [30 - move dot](http://playground.babylonjs.com/#TGNTGT#30)
- [32 - remove dot](http://playground.babylonjs.com/#TGNTGT#32)
- [34 - fix algorithm](http://playground.babylonjs.com/#TGNTGT#34)
- [38 - add dot](http://playground.babylonjs.com/#TGNTGT#38)

## NOTE

About `sideOrientation`

It seems nothing but works with the order of vertices indices of faces. If you'd like the mesh to look like the supposed way, you have to take care about the orders, as set the `sideOrienation: BABYLON.Mesh.DOUBLESIDE` even make thing worse sometimes.

And, in terms of the default side, the order of vertices are supposed to be clockwise.

## REF

- https://github.com/BabylonJS/Extensions/blob/master/Polyhedron/polyhedra.js
- https://www.babylonjs-playground.com/#21QRSK#15
- http://www.georgehart.com/virtual-polyhedra/vp.html
- https://en.wikipedia.org/wiki/Polyhedron
  - https://en.wikipedia.org/wiki/Archimedean_solid
  - https://en.wikipedia.org/wiki/Antiprism
  - https://en.wikipedia.org/wiki/Johnson_solid
  - https://en.wikipedia.org/wiki/Platonic_solid
  - https://en.wikipedia.org/wiki/Prism_(geometry)
- https://en.wikipedia.org/wiki/Abstract_polytope

## DOC

- https://doc.babylonjs.com/how_to/polyhedra_shapes
