var createScene = function () { // eslint-disable-line
    var scene = new BABYLON.Scene(engine)
    var camera = new BABYLON.ArcRotateCamera('camera1', 0, 0, 5, new BABYLON.Vector3(0, 0, 0), scene)

    camera.setTarget(BABYLON.Vector3.Zero())

    camera.attachControl(canvas, true)

    var light = new BABYLON.PointLight('light1', new BABYLON.Vector3(4, 1, 0), scene)
    light.specular = new BABYLON.Color3(0.99, 0, 0)
    light.diffuse = new BABYLON.Color3(0.99, 0, 0)

    const ground = BABYLON.MeshBuilder.CreatePlane('plane', {size: 10}, scene)
    ground.rotation.x = Math.PI / 2

    const mat = new BABYLON.StandardMaterial('matetial', scene)
    mat.diffuseColor = new BABYLON.Color3(1, 1, 1)
    mat.specularColor = new BABYLON.Color3(1, 1, 1)
    mat.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4)
    ground.material = mat

    return scene
}
