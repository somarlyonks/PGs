{   // AXIS
    getAxis(1, 0, 0, 20)
    // getAxis(1, 1, pilot)
    function getAxis (needGlobalAxis=true, needLocalAxis=false, origin=false, globalSize=8, localSize=2) {
        if (needGlobalAxis) {
            globalAxis(globalSize)
        }
        if (needLocalAxis && origin) {
            const localOrigin = localAxis(localSize)
            localOrigin.parent = origin
            return localOrigin
        }
    }

    function axis3 (size, nameList) {
        const axisX = BABYLON.Mesh.CreateLines(nameList[0], [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], scene)
        axisX.color = new BABYLON.Color3(1, 0, 0)
        const axisY = BABYLON.Mesh.CreateLines(nameList[1], [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ], scene)
        axisY.color = new BABYLON.Color3(0, 1, 0)
        const axisZ = BABYLON.Mesh.CreateLines(nameList[2], [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ], scene)
        axisZ.color = new BABYLON.Color3(0, 0, 1)

        return {axisX, axisY, axisZ}
    }

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
        const xChar = makeTextPlane('X', 'red', size / 10)
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
        const yChar = makeTextPlane('Y', 'green', size / 10)
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)
        var zChar = makeTextPlane('Z', 'blue', size / 10)
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)

        const {axisX, axisY, axisZ} = axis3(size, ['X', 'Y', 'Z'].map(axis => `axis${axis}`))
    }

    function localAxis (size) {
        const {axisX: localAxisX, axisY: localAxisY, axisZ: localAxisZ} = axis3(size, ['X', 'Y', 'Z'].map(axis => `localAxis${axis}`))

        const localOrigin = new BABYLON.Mesh('localOrigin', scene)
        localOrigin.isVisible = false

        localAxisX.parent = localOrigin
        localAxisY.parent = localOrigin
        localAxisZ.parent = localOrigin
        // localAxisZM.parent = localOrigin

        return localOrigin
    }
}