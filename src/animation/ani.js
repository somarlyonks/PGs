var createScene = function () {
    var scene = new BABYLON.Scene(engine)
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvas, true)
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
    light.intensity = 0.7
    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene)
    sphere.position.y = 1
    var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene)

    const ani1 = new BABYLON.Animation(
        'ani1', 'position.x', 30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    )
    const keys1 = [
        {frame: 0, value: 0},
        {frame: 15, value: 3},
        {frame: 30, value: 0},
        {frame: 45, value: -3},
        {frame: 60, value: 0}
    ]

    const ani2 = new BABYLON.Animation(
        'ani2', 'scaling.x', 30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    )
    const keys2 = [
        {frame: 0, value: 1},
        {frame: 15, value: 2},
        {frame: 30, value: 1}
    ]
    ani1.setKeys(keys1)
    ani2.setKeys(keys2)
    sphere.animations = [ani1]
    window.a1 = scene.beginAnimation(sphere, 0, 60, true)
    sphere.animations = [ani2]
    window.a2 = scene.beginAnimation(sphere, 0, 60, true, undefined, undefined, undefined, false)
    window.a1.pause()
    window.a1.reset()
    window.a2.pause()
    window.a2.reset()

    window.o = sphere

    return scene
}
