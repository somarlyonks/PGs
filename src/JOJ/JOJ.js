var createScene = function() {
    {  // static
        // macro
        var V3 = BABYLON.Vector3
        var X = BABYLON.Axis.X
        var Y = BABYLON.Axis.Y
        var Z = BABYLON.Axis.Z
        var LOCAL = BABYLON.Space.LOCAL
        var WORLD = BABYLON.Space.WORLD
        var sq2 = Math.sqrt(2)
        var PI = Math.PI
        // scene
        var scene = new BABYLON.Scene(engine)
        scene.clearColor = new BABYLON.Color3(0xfa / 0xff, 0xf0 / 0xff, 0xe6 / 0xff)
        // camera
        var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(5, 2, 0), scene)
        camera.setPosition(new BABYLON.Vector3(30, 30, -30))
        camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
        camera.orthoLeft = -3
        camera.orthoRight = 3
        camera.orthoTop = 8
        camera.orthoBottom = -2
        camera.attachControl(canvas, true)
        // lights
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene)
        light.intensity = 0.8
        // pilot
        var body = BABYLON.MeshBuilder.CreateCylinder("body", { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 6, subdivisions: 1 }, scene)
        var head = new BABYLON.Mesh.CreateSphere("head", 0, 0.35, scene)
        head.position.y = 0.5
        var pilot = BABYLON.Mesh.MergeMeshes([body, head], true)
        // coor
        var coor = new BABYLON.Mesh.CreateSphere('s', 0, 0.1, scene)
        coor.position.z = -5
        coor.position.y = 4
        coor.position.x = -1
        camera.parent = coor
    }

    {  // AXIS
        // show axis
        (function showAxis (size) {
            var makeTextPlane = function(text, color, size) {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true)
            dynamicTexture.hasAlpha = true
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true)
            var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true)
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene)
            plane.material.backFaceCulling = false
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0)
            plane.material.diffuseTexture = dynamicTexture
            return plane
            }
        
            var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], scene)
            axisX.color = new BABYLON.Color3(1, 0, 0)
            var xChar = makeTextPlane("X", "red", size / 10)
            xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
            var axisY = BABYLON.Mesh.CreateLines("axisY", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
                ], scene)
            axisY.color = new BABYLON.Color3(0, 1, 0)
            var yChar = makeTextPlane("Y", "green", size / 10)
            yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)
            var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
                ], scene)
            axisZ.color = new BABYLON.Color3(0, 0, 1)
            var zChar = makeTextPlane("Z", "blue", size / 10)
            zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
        })(8)
        //Local Axes
        function localAxes(size) {
            var pilot_local_axisX = BABYLON.Mesh.CreateLines("pilot_local_axisX", [ 
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], scene)
            pilot_local_axisX.color = new BABYLON.Color3(1, 0, 0)

            pilot_local_axisY = BABYLON.Mesh.CreateLines("pilot_local_axisY", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
            ], scene)
            pilot_local_axisY.color = new BABYLON.Color3(0, 1, 0)

            var pilot_local_axisZ = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
            ], scene)
            pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1)

            var pilot_local_axisZM = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, -15)
            ], scene)
            pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1)

            var local_origin = BABYLON.MeshBuilder.CreateBox("local_origin", {size:1}, scene)
            local_origin.isVisible = false
            
            pilot_local_axisX.parent = local_origin
            pilot_local_axisY.parent = local_origin
            pilot_local_axisZ.parent = local_origin 
            pilot_local_axisZM.parent = local_origin 
            
            return local_origin
        }
        var localOrigin = localAxes(2)
        localOrigin.parent = pilot
    }

    function createStage (distance, prev={position: {x: 0, y: 0, z:0}, direction: 'right'}) {
        const stage = BABYLON.MeshBuilder.CreateBox('stage',
            {width: 1, height: 0.6, depth: 1},
            scene
        )

        stage.position = new V3(
            prev.direction === 'right' ? prev.position.x : prev.position.x - distance,
            prev.position.y,
            prev.direction === 'right' ? prev.position.z + distance : prev.position.z
        )

        stage.direction = prev.direction === 'right' ? 'left' : 'right'
        stage.position.y = -0.3
        console.log(stage.direction)
        return stage
    }

    const firstStage = createStage(4)
    firstStage.setEnabled(false)
    const stages = [firstStage, createStage(4)]
    stages.push(createStage(4, stages[1]))
    stages.push(createStage(4, stages[2]))
    stages.push(createStage(4, stages[3]))
    stages.push(createStage(4, stages[4]))
    stages.push(createStage(4, stages[5]))
    stages.push(createStage(4, stages[6]))
    function addStage () {
        stages.push(createStage(4, stages[7]))
        stages.splice(0, 1)[0].dispose()
    }

    pilot.scaling = new V3(0.75, 0.8, 0.75)
    pilot.position = new V3(0, 0.8 * 0.75 * 0.5, 0)

    // args
    let speed = 6.5 * sq2
    const g = getG()
    /** calculate a normal g in pixel/s^2
     * @param {number} distance
     * @param {number} sec
     * @return {number}
     */
    function getG (distance=10, sec=1) {
        return 2 * distance / sec / sec
    }
    function getSec (speed, g) {
        return sq2 * speed / g
    }
    function getFrames (speed, g) {
        return parseInt(getSec(speed, g) * 60)
    }

    function getDistance (speed, g) {
        return speed * speed / g / 2
    }

    const gframe = g / 60 / 60
    let speedframe = speed / 60

    let t = 0
    let TIME = 0
    let curDIR = 'right'
    let completed = false
    let down = 0
    let pressed = false
    scene.onPointerDown = () => { // TODO: running
        down = 0
        pressed = true
    }
    scene.onPointerUp = () => {
        completed = false
        pressed = false
        pilot.position.y = 0.3
        pilot.scaling.y = 0.8
        t = 0
        speed = down * sq2
        TIME = getFrames(speed, g)
        speedframe = speed / 60
        console.log('--------------', TIME)
    }

    function jump () {
        ++t

        if (pressed) {
            down += 0.1
            pilot.scaling.y -= 0.004
            pilot.position.y -= 0.002
        } else {
            if (curDIR === 'right') {
                if (completed) {
                    down = 0
                    TIME = 0
                } else if (TIME) {
                    jumpright()
                }
            } else {
                if (completed) {
                    down = 0
                    TIME = 0
                } else if (TIME) {
                    jumpleft()
                }
            }
        }
    }

    function jumpright () {
        const speedDIR = Y.add(Z).normalize()
        if(t < TIME) {
            pilot.rotate(new V3(1, 0, 0), PI * 2 / TIME * 1, BABYLON.Space.LOCAL)
            const speedG = -gframe * t
            pilot.translate(Y, speedG, WORLD)
            pilot.translate(speedDIR, speedframe, WORLD)
            coor.translate(Z, speedframe / sq2, WORLD)
        } else {
            pilot.rotate(new V3(1, 0, 0), PI * 2 / TIME * 1, BABYLON.Space.LOCAL)
            pilot.position.y = 0.3 // FIXME: really ? manully?
            completed = true
            curDIR = 'left'
            addStage()
        }
    }

    function jumpleft () {
        const speedDIR = new V3(-1, 1, 0).normalize()
        const coorDIR = new V3(-1, 0, 0).normalize()
        if(t < TIME) {
            pilot.rotate(new V3(0, 0, 1), PI * 2 / TIME * 1, BABYLON.Space.LOCAL)
            const speedG = -gframe * t
            pilot.translate(Y, speedG, WORLD)
            pilot.translate(speedDIR, speedframe, WORLD)
            coor.translate(coorDIR, speedframe / sq2, WORLD)
        } else {
            pilot.rotate(new V3(0, 0, 1), PI * 2 / TIME * 1, BABYLON.Space.LOCAL)
            pilot.position.y = 0.3 // FIXME: really ? manully?
            completed = true
            curDIR = 'right'
            addStage()
        }
    }

    scene.registerAfterRender(jump)

    return scene
}
