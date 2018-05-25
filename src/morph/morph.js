var createScene = function() {
    var scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color3( .5, .5, .5)
    var camera = new BABYLON.ArcRotateCamera('camera1',  0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene)
    camera.setPosition(new BABYLON.Vector3(0, 0, -100))
    camera.attachControl(canvas, true)
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 0.5, 0), scene)
    light.intensity = 0.7
    var pl = new BABYLON.PointLight('pl', new BABYLON.Vector3(0, 0, 0), scene)
    pl.diffuse = new BABYLON.Color3(1, 1, 1)
    pl.intensity = 0.95
    var mat = new BABYLON.StandardMaterial('mat1', scene)
    var txtr = new BABYLON.Texture('https://s2.d2scdn.com/2018/05/25/Fi2nVbbp37i9kOc5e27qaiatZuVi.png')
    //   txtr.hasAlpha = true
    //   mat.alphaMode = 1
    mat.diffuseTexture = txtr
    mat.opacityTexture = txtr
    mat.specularColor = new BABYLON.Color3(0, 0, 0)
    mat.emissiveColor = new BABYLON.Color3(0, 0, 0)
    mat.diffuseColor = new BABYLON.Color3(0, 0, 0)

    mat.alpha = 1
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0)
    mat.backFaceCulling = false
    //   mat.wireframe = true

    // path function
    var pathFunction = function(k) {
        var path = [] 
        for (var i = 0; i < 60; i++) {
            var x =  i - 30
            var y = 0
            var z = k
            path.push(new BABYLON.Vector3(x, y, z))
        }
        return path
    }

    // update path function
    var updatePath = function(path, k) {
        for (var i = 0; i < path.length; i++) {
            var x = path[i].x
            var z = path[i].z
            var y = 20 * Math.sin(i/ 10) * Math.sin(k + z / 40)  
            path[i].x = x
            path[i].y = y
            path[i].z = z
        }
    }

    // ribbon creation
    var sideO = BABYLON.Mesh.BACKSIDE
    var pathArray = []
    for(var i = -20; i < 20; i++) {
        pathArray.push(pathFunction(i * 2))
    }
    console.log('path', pathArray)
    var mesh = BABYLON.Mesh.CreateRibbon('ribbon', pathArray, false, false, 0, scene, true, sideO)
    mesh.material = mat

    //   mesh.scaling.x = 10
    console.log(mesh.scaling)

    // morphing
    var k = 0
    scene.registerBeforeRender(function(){
        // update pathArray
        for(var p = 0; p < pathArray.length; p++) {
            updatePath(pathArray[p], k)
        }
        // ribbon update
        mesh = BABYLON.Mesh.CreateRibbon(null, pathArray, null, null, null, null, null, null, mesh)
        k += 0.05
        pl.position = camera.position
    })

    //   setTimeout(() => {
    //       scene.registerAfterRender(() => {
    //           console.log('registered')
    //       })
    //   }, 1000)

    return scene
}