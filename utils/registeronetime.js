function toDoAfterRender () {
    console.log('somthing done')
    scene.unregisterAfterRender(toDoAfterRender)
}
scene.registerAfterRender(toDoAfterRender)
