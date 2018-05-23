var createScene = function () { // DOM#rederCanvas
    var V3 = BABYLON.Vector3
    var CAMERAarc = BABYLON.ArcRotateCamera
    var scene = new BABYLON.Scene(engine)
    var axisList = ['x', 'y', 'z']
    scene.clearColor = new BABYLON.Color3(.5, .5, .5)

    {    /**************** camera and viewport ***************/
        var camera = new CAMERAarc('camera1', 0, 0, 0, new V3(0, 0, 0), scene)
        camera.setPosition(new V3(0, 0, -150))
        camera.attachControl(canvas, true)

        scene.activeCameras.push(camera)
        function createViewCamera (axis) {
            var cameraVp = new CAMERAarc(`cameraVp-${axis}`, 0, 0, 0,
                V3.Zero(),
                scene
            )
            let position = new V3(0.1, 0, 0)
            position[axis] = -150
            cameraVp.setPosition(position)
            cameraVp.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
            cameraVp.orthoLeft = -50
            cameraVp.orthoRight = 50
            cameraVp.orthoTop = 50
            cameraVp.orthoBottom = -50
            cameraVp.viewport = new BABYLON.Viewport(
                axis === 'z' ? 0.5 : 0,
                axis === 'x' ? 0.5 : 0,
                0.4 * canvas.height /canvas.width,
                0.4
            )
            scene.activeCameras.push(cameraVp)
        }
        axisList.forEach(axis => createViewCamera(axis))
    // console.log(scene.activeCameras)
    }

    var dots = []

    Object.defineProperty(dots, 'dots', {
        value: new Array(),
        enumerable: false,
        writable: true,
        configurable: true
    })

    function add_dot (x=0, y=0, z=0, parent) {
        let dot = BABYLON.Mesh.CreateSphere('dot', 0, 3, scene, true)
        dot.position = new V3(x, y, z)
        if (parent) {
            dot.parent = parent
        }
        {
            for (let i=0; i < this.length - 1; i++) {
                let left = this[i]
                let right = this[i + 1]
                let isBetween = function (x, left, right) {
                    return (left <= x && x <= right) || (left >= x && x >= right)
                }
                let between = axisList.filter(axis => isBetween(
                    arguments[axisList.indexOf(axis)],
                    left[axis], right[axis]
                ))
                if (between.length === 3) {
                    this.splice(i + 1, 0, new V3(x, y, z))
                    this.dots.splice(i + 1, 0, dot)
                    return
                }
            }
            this.push(new V3(x, y, z))
            this.dots.push(dot)
        }
    }

    function move_dot (index=0, x=0, y=0, z=0) {
        this[index].x = x
        this[index].y = y
        this[index].z = z
        this.dots[index].position.x = x
        this.dots[index].position.y = y
        this.dots[index].position.z = z
    }

    function update_dots (parent) {
        if (parent) {
            this.dots = parent.getChildren().filter(
                mesh => mesh.name === 'dot'
            )
            this.splice(0, this.length)
        }
        for (const i in this.dots) {
            this[i] = this.dots[i].position
        }
    }

    Object.defineProperties(dots, {
        add_dot: {
            value: add_dot,
            enumerable: false
        },
        move_dot: {
            value: move_dot,
            enumerable: false
        },
        update_dots: {
            value: update_dots,
            enumerable: false
        }
    })

    {   /********************* simulations ********************/
        dots.add_dot(0, 0, 0)
        dots.add_dot(20, 0, 20)
        dots.add_dot(0, 0, 40)
        dots.add_dot(-20, 0, 20)

        dots.move_dot(1, 10, 10, 10)
        dots.move_dot(2, 0, -10, 20)

    //dots.forEach(dot => console.log(dot))
    }

    var vatmullRomDensity = 2 * 3 * 5 * 7
    var catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(
        [...dots],
        vatmullRomDensity
    )
    // var catmullRomSpline = BABYLON.Mesh.CreateLines("catmullRom", catmullRom.getPoints(), scene);
    var catmullRomSpline = BABYLON.MeshBuilder.CreateTube(
        'tube',
        {
            path: catmullRom.getPoints(),
            radius: 0.5,
            updatable: true
        },
        scene
    )

    dots.dots.forEach(dot => dot.parent=catmullRomSpline)
    catmullRomSpline.dots = dots

    // catmullRomSpline.setEnabled(false)

    scene.activeCameras.forEach(cmr => cmr.detachControl(canvas))
    var currentActiveCameraIndex = 0
    var cACI = scene.activeCameras[currentActiveCameraIndex]
    cACI.attachControl(canvas, true)
    // cACI.inputs.attached.mouse.angularSensibility = 4000

    // cACI.inputs.remove(cACI.inputs.attached.pointers)
    // cACI.inputs.remove(cACI.inputs.attached.mouse)
    // console.log('inputs', cACI.inputs)

    {   /********************** event *************************/
        var pickedInfo = {
            picked: false,
            pickedMesh: {},
            pickedXY: [0, 0],
            camera_name: ''
        }
        let pickResult = function (camera) {return scene.pick(
            scene.pointerX, scene.pointerY,
            (function (mesh) {
                return true
            }),
            true,
            camera
        )}
        function detachCamerasMouse (scene) {
            function detachCameraMouse (camera) {
                camera.detachControl(canvas)
            }
            scene.activeCameras.forEach(camera => detachCameraMouse(camera))
        }
        // function attachCamerasMouse (scene) {
        //     function attachCameraMouse (camera) {
        //     //
        //     }
        //     scene.activeCameras.forEach(camera => attachCameraMouse(camera))
        // }
        function updateTube () {
            catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(
                [...dots],
                vatmullRomDensity * 3 / (dots.length - 1)
            )
            while (catmullRom._points.length > vatmullRomDensity * 3 + 1) {
                catmullRom._points.pop()
            }
            // console.log(catmullRom)
            return BABYLON.MeshBuilder.CreateTube(
                null,
                {
                    path: catmullRom.getPoints(),
                    instance: catmullRomSpline
                }
            )
        }
        scene.onPointerDown = function(evt/* , pickingInfo */) {
            evt.preventDefault()
            for (camera of scene.activeCameras) {
                let r = pickResult(camera)
                console.log(r)
                if (r.hit) {
                    detachCamerasMouse(scene)
                    pickedInfo.picked = r.hit
                    pickedInfo.pickedMesh = r.pickedMesh
                    pickedInfo.camera_name = camera.name
                    pickedInfo.pickedPlane = camera.name.split('-')[1]
                    console.log('picked', r.pickedMesh)
                    if (r.pickedMesh.name === 'dot') {
                        if (evt.button === 0) {
                            let hit_ball = new BABYLON.Mesh.CreateSphere(
                                'hitball', 0, 30, scene, false
                            )
                            hit_ball.parent = r.pickedMesh
                            hit_ball.isVisible = false
                            pickedInfo.hit_ball = hit_ball
                            break
                        } else if (evt.button === 2) {
                            let parent = pickedInfo.pickedMesh.parent
                            if (parent.getChildren().length < 3) return
                            pickedInfo.pickedMesh.dispose()
                            parent.dots.update_dots(parent)
                            catmullRomSpline = updateTube()
                        }
                    } else if (
                        r.pickedMesh.name === 'tube'
                    && evt.button === 0
                    && pickedInfo.camera_name.startsWith('cameraVp')
                    ){
                        dots.add_dot(
                            pickedInfo.pickedPlane === 'x' ? 0 : r.pickedPoint.x,
                            pickedInfo.pickedPlane === 'y' ? 0 : r.pickedPoint.y,
                            pickedInfo.pickedPlane === 'z' ? 0 : r.pickedPoint.z,
                            catmullRomSpline
                        )
                        dots.update_dots()
                        catmullRomSpline = updateTube()
                    }
                }
            }
        }
        scene.onPointerMove = function(/* evt, pickingInfo */) {
            if (pickedInfo.picked
            && pickedInfo.camera_name.startsWith('cameraVp')
            ) {
                let pickedPlane = pickedInfo.pickedPlane
                let pickedMesh = pickedInfo.pickedMesh
                // console.log('picking', pickedInfo)
                if (pickedMesh.name === 'dot') {
                    var newPosition = pickResult(scene.activeCameras[axisList.indexOf(pickedPlane) + 1])
                    const translatePickedMesh = (axis) => pickedMesh.translate(
                        BABYLON.Axis[axis.toUpperCase()],
                        newPosition.subtract(pickedMesh.position)[axis],
                        BABYLON.Space.LOCAL
                    )
                    if (newPosition.hit && ['dot', 'hitball'].includes(newPosition.pickedMesh.name)) {
                        newPosition = newPosition.pickedPoint
                        axisList
                            .filter(axis => axis !== pickedPlane)
                            .map(axis => translatePickedMesh(axis))
                        dots.update_dots()
                        catmullRomSpline = updateTube()
                    // console.log(pickedMesh.position)
                    }
                }
            }
        }
        scene.onPointerUp = function(/* evt, pickingInfo */) {
            if (pickedInfo.picked) {
            // attachCamerasMouse(scene)
                scene.activeCameras[0].attachControl(canvas, true)
                pickedInfo.picked = false
                if (pickedInfo.hit_ball) {
                    pickedInfo.hit_ball.dispose()
                }
            }
        }
    }
    {   /************** moving mesh for example **************/
    // var sample = BABYLON.MeshBuilder.CreateBox(
    //     'sample',
    //     {
    //         size: 4,
    //         sideOrientation: BABYLON.Mesh.DOUBLESIDE
    //     },
    //     scene
    // )
    // var samplePath = catmullRom.getPoints()
    // let i = 0

    // scene.registerBeforeRender(function move () {
    //     if (i < samplePath.length - 1) {
    //         sample.lookAt(samplePath[i+1])
    //         sample.position = samplePath[i++]
    //     } else {
    //         sample.dispose()
    //     }
    //     for (let i = 0; i < samplePath.length; i++) {
    //         //console.log('1')
    //     }
    // })
    }
    {   /*********************** Axes ************************/
    // show axis function
        var showAxis = function (size) {
            var makeTextPlane = function (text, color, size) {
                var dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, scene, true)
                dynamicTexture.hasAlpha = true
                dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true)
                var plane = BABYLON.Mesh.CreatePlane('TextPlane', size, scene, true)
                plane.material = new BABYLON.StandardMaterial('TextPlaneMaterial', scene)
                plane.material.backFaceCulling = false
                plane.material.specularColor = new BABYLON.Color3(0, 0, 0)
                plane.material.diffuseTexture = dynamicTexture
                return plane
            }
            var axisX = BABYLON.Mesh.CreateLines('axisX', [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
                new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], scene)
            axisX.color = new BABYLON.Color3(1, 0, 0)
            var xChar = makeTextPlane('X', 'red', size / 10)
            xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
            var axisY = BABYLON.Mesh.CreateLines('axisY', [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
            ], scene)
            axisY.color = new BABYLON.Color3(0, 1, 0)
            var yChar = makeTextPlane('Y', 'green', size / 10)
            yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)
            var axisZ = BABYLON.Mesh.CreateLines('axisZ', [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
            ], scene)
            axisZ.color = new BABYLON.Color3(0, 0, 1)
            var zChar = makeTextPlane('Z', 'blue', size / 10)
            zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
        }

        showAxis(50)
    }
    return scene
}