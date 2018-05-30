var createScene = function () { // eslint-disable-line
    var scene = new BABYLON.Scene(engine)
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvas, true)
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene)
    sphere.position.y = 1
    BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene)

    const highlightLayer = new BABYLON.HighlightLayer('highlightLayer', scene)

    scene.registerAfterRender(() => {
        const pickResult = scene.pick(
            scene.pointerX, scene.pointerY, m => m.name === 'sphere1', true, camera
        )

        if (pickResult.hit) {
            highlightLayer.addMesh(sphere, BABYLON.Color3.Blue())
        } else {
            highlightLayer.removeMesh(sphere)
        }
    })

    return scene
}
