var createScene = function () {
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
        var camera = new BABYLON.FreeCamera('camera1',  new V3(10, 10, -10), scene)
        camera.setTarget(V3.Zero())
        camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
        const {canvasFixW, canvasFixH} = getCanvasFixWH()
        camera.orthoLeft = -3 * canvasFixW
        camera.orthoRight = 3 * canvasFixW
        camera.orthoTop = 3 * canvasFixH
        camera.orthoBottom = -3 * canvasFixH
        // camera.attachControl(canvas, true)
        // lights
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 0.5, 0), scene)
        light.intensity = 0.8
        // pilot
        var body = BABYLON.MeshBuilder.CreateCylinder('body', { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 6, subdivisions: 1 }, scene)
        var head = new BABYLON.Mesh.CreateSphere('head', 0, 0.35, scene)
        head.position.y = 0.5
        var pilot = BABYLON.Mesh.MergeMeshes([body, head], true)
        pilot.scaling = new V3(0.75, 0.8, 0.75)
        pilot.position = new V3(0, 0.8 * 0.75 * 0.5, 0)
        // cmrHost
        var cmrHost = new BABYLON.Mesh('cameraHost', scene)
        cmrHost.position.z = 1
        cmrHost.position.y = 2
        cmrHost.position.x = 1
        cmrHost.layerMask = 0
        camera.parent = cmrHost
    }

    // {  // utils
    function getCanvasFixWH (basicSize=1) {
        const ratio = canvas.height / canvas.width
        const fix = 1 / Math.sqrt(ratio)

        const canvasFixW = basicSize * fix
        const canvasFixH = basicSize * fix * ratio

        return {canvasFixW, canvasFixH}
    }
    // }

    {   // AXIS
        getAxis(1, 1, pilot)

        function globalAxis (size) {
            function makeTextPlane (text, color, size) {
                const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, scene, true)
                dynamicTexture.hasAlpha = true
                dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true)
                const plane = new BABYLON.Mesh.CreatePlane('TextPlane', size, scene, true)
                plane.material = new BABYLON.StandardMaterial('TextPlaneMaterial', scene)
                plane.material.backFaceCulling = false
                plane.material.specularColor = new BABYLON.Color3(0, 0, 0)
                plane.material.diffuseTexture = dynamicTexture
                return plane
            }

            const axisX = BABYLON.Mesh.CreateLines('axisX', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
                new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], scene)
            axisX.color = new BABYLON.Color3(1, 0, 0)
            const xChar = makeTextPlane('X', 'red', size / 10)
            xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)

            const axisY = BABYLON.Mesh.CreateLines('axisY', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
            ], scene)
            axisY.color = new BABYLON.Color3(0, 1, 0)
            const yChar = makeTextPlane('Y', 'green', size / 10)
            yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)

            const axisZ = BABYLON.Mesh.CreateLines('axisZ', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
            ], scene)
            axisZ.color = new BABYLON.Color3(0, 0, 1)
            var zChar = makeTextPlane('Z', 'blue', size / 10)
            zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
        }

        function localAxis (size) {
            const localAxisX = BABYLON.Mesh.CreateLines('localAxisX', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
                new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], scene)
            localAxisX.color = new BABYLON.Color3(1, 0, 0)

            const localAxisY = BABYLON.Mesh.CreateLines('localAxisY', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
            ], scene)
            localAxisY.color = new BABYLON.Color3(0, 1, 0)

            const localAxisZ = BABYLON.Mesh.CreateLines('localAxisZ', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
            ], scene)
            localAxisZ.color = new BABYLON.Color3(0, 0, 1)

            const localAxisZM = BABYLON.Mesh.CreateLines('localAxisZ', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, -15)
            ], scene)
            localAxisZ.color = new BABYLON.Color3(0, 0, 1)

            const localOrigin = BABYLON.MeshBuilder.CreateBox('localOrigin', {size: 1}, scene)
            localOrigin.isVisible = false

            localAxisX.parent = localOrigin
            localAxisY.parent = localOrigin
            localAxisZ.parent = localOrigin
            localAxisZM.parent = localOrigin

            return localOrigin
        }

        function getAxis (needGlobalAxis=true, needLocalAxis=false, origin=false, globalSize=8, localSize=2) {
            if (needGlobalAxis) {
                globalAxis(globalSize)
            }
            if (needLocalAxis && parent) {
                const localOrigin = localAxis(localSize)
                localOrigin.parent = origin
            }
        }
    }

    function createStage (prev={position: {x: 0, y: 0, z: 0}, direction: 'right'}) {
        function getRandomDistance (min=2, max=5) {
            return min + Math.random() * (max - min)
        }
        const stage = BABYLON.MeshBuilder.CreateBox('stage',
            {width: 1, height: 0.6, depth: 1},
            scene
        )
        const distance = getRandomDistance()

        stage.position = new V3(
            prev.direction === 'right' ? prev.position.x : prev.position.x - distance,
            prev.position.y,
            prev.direction === 'right' ? prev.position.z + distance : prev.position.z
        )

        stage.direction = prev.direction === 'right' ? 'left' : 'right'
        stage.position.y = -0.3
        return stage
    }

    const firstStage = createStage()
    firstStage.setEnabled(false)
    const stages = [firstStage, createStage()]
    stages.push(createStage(stages[1]))
    stages.push(createStage(stages[2]))
    stages.push(createStage(stages[3]))
    stages.push(createStage(stages[4]))
    stages.push(createStage(stages[5]))
    stages.push(createStage(stages[6]))
    function addStage () {
        stages.push(createStage(stages[7]))
        stages.splice(0, 1)[0].dispose()
    }

    cmrHost.getNextPosition = function () { // before addStage()
        const x = (stages[2].position.x + stages[1].position.x) / 2
        const z = (stages[2].position.z + stages[1].position.z) / 2
        this.distanceX = x - this.position.x
        this.distanceZ = z - this.position.z
    }

    cmrHost.goNext = function (framesCount) {
        this.translate(X, this.distanceX / framesCount, WORLD)
        this.translate(Z, this.distanceZ / framesCount, WORLD)
    }

    pilot.notOnStage = function () {
        const rangeX = [
            stages[1].position.x - 1 / 2,
            stages[1].position.x + 1 / 2,
        ]
        const rangeZ = [
            stages[1].position.z - 1 / 2,
            stages[1].position.z + 1 / 2,
        ]
        function outRange (self, range) {
            if (range[0] > self) return 1
            if (self > range[1]) return 2
            return 0
        } // TODO: fall directly
        this.fallDirection = [0, 'left', 'right'][outRange(this.position.x, rangeX)] ||
          [0, 'backward', 'forward'][outRange(this.position.z, rangeZ)]

        if (this.fallDirection) {
            this.fallCountDown = 60
        }

        return this.fallDirection
    }
    pilot.fall = function () {
        const dir = this.fallDirection
        const DIRECTION = dir === 'left' || dir === 'right' ? Z : X
        const ANGLE = dir === 'backward' || dir === 'right' ? -1 : 1

        if (this.fallCountDown > 30) { // TODO: fix a little
            // TODO: change rotate axis to edge
            this.rotate(DIRECTION, ANGLE * PI / 2 / 30, WORLD)
            this.translate(Y, -1 * 0.2 / 30, WORLD)
        } else if (this.fallCountDown > 0) {
            this.translate(Y, -1 * 0.4 / 30, WORLD)
        } // TODO: roll randomly
        this.fallCountDown--

        return this
    }


    // args
    let speed = 6.5 * sq2
    let speedframe = speed / 60
    const g = getG()
    const gframe = g / 60 / 60
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

    let t = 0
    let TIME = 0
    let curDIR = 'right'
    let completed = false
    let down = 0
    let pressed = false
    let end = false
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
        cmrHost.getNextPosition()
    }

    function jump () {
        ++t
        if (end) {
            pilot.fall()
        } else {
            press()
        }
    }

    function press () {
        if (pressed) {
            if (pilot.scaling.y > 0.4) {
                down += 0.1
                pilot.scaling.y -= 0.004
                pilot.position.y -= 0.002
            }
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
            pilot.rotate(X, PI * 2 / TIME * 1, BABYLON.Space.LOCAL)
            const speedG = -gframe * t
            pilot.translate(Y, speedG, WORLD)
            pilot.translate(speedDIR, speedframe, WORLD)
            cmrHost.goNext(TIME)
        } else {
            pilot.rotate(X, PI * 2 / TIME * 1, BABYLON.Space.LOCAL)
            curDIR = 'left'
            jumpCompleted()
        }
    }

    function jumpleft () {
        const speedDIR = new V3(-1, 1, 0).normalize()
        const cmrHostDIR = new V3(-1, 0, 0).normalize()
        if(t < TIME) {
            pilot.rotate(Z, PI * 2 / TIME * 1, BABYLON.Space.LOCAL)
            const speedG = -gframe * t
            pilot.translate(Y, speedG, WORLD)
            pilot.translate(speedDIR, speedframe, WORLD)
            cmrHost.goNext(TIME)
        } else {
            pilot.rotate(Z, PI * 2 / TIME * 1, BABYLON.Space.LOCAL)
            curDIR = 'right'
            jumpCompleted()
        }
    }

    function jumpCompleted () {
        pilot.position.y = 0.3
        completed = true
        end = pilot.notOnStage()
        console.log(end)
        addStage()
    }

    scene.registerAfterRender(jump)

    return scene
}
