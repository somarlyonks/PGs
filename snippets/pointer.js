function getPickResult (camera, cb) {
    return scene.pick(scene.pointerX, scene.pointerY, cb, true, camera)
}

scene.onPointerDown = (evt, pickingInfo) => {
    const pickResult = getPickResult(camera, m => 1)
}

scene.onPointerMove = (evt, pickingInfo) => {
    const pickResult = getPickResult(camera, m => 1)    
}

scene.onPointerUp = (evt, pickingInfo) => {
    //
}