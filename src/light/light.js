var createScene = function () { // eslint-disable-line
    var scene = new BABYLON.Scene(engine)
    var camera = new BABYLON.ArcRotateCamera('Camera', -Math.PI / 2,  Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvas, true)

    const light = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 0, 0), scene)
    light.parent = camera
    // light.diffuse = new BABYLON.Color3(0, 0, 0);
    light.specular = new BABYLON.Color3(0, 0, 0)

    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene)
    const sphere2 = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene)
    const sphere3 = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene)
    const sphere4 = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene)
    sphere.position.z = 1
    sphere2.position.z = 2
    sphere3.position.z = 3
    sphere4.position.z = 4
    const m = new BABYLON.StandardMaterial('m', scene)
    m.specularColor = BABYLON.Color3.Black()
    sphere.material = m
    light.includedOnlyMeshes = [sphere]
    light.includedOnlyMeshes = []

    return scene

}