{   // static
    // macro
    var V3 = BABYLON.Vector3
    var C4 = BABYLON.Color4
    var X = BABYLON.Axis.X
    var Y = BABYLON.Axis.Y
    var Z = BABYLON.Axis.Z
    var LOCAL = BABYLON.Space.LOCAL
    var WORLD = BABYLON.Space.WORLD
    var PI = Math.PI
    // scene
    var scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color3(.5, .5, .5)
    // camera
    var camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 0, new BABYLON.Vector3(3, 3, -3), scene)
    camera.setPosition(new BABYLON.Vector3(10, 5, -20))
    camera.attachControl(canvas, true)
    // lights
    var light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 0.5, 0), scene)
    light.intensity = 0.8
}