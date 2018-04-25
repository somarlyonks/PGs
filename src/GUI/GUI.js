var createScene = function () {
    const G = BABYLON.GUI

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
    ground.parent = sphere
    sphere.setEnabled(false)

    // GUI
    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const back = new G.Rectangle('back')
    back.width = '290px'
    back.height = '420px'
    gui.addControl(back)

    const panel = new G.StackPanel('panel')
    panel.width = 1
    panel.height = 1
    panel.isVertical = false
    // panel.background = 'cyan'
    back.addControl(panel)

    const section1 = new G.StackPanel('section')
    section1.width = 1 / 4
    section1.height = 1
    section1.background = 'cyan'
    panel.addControl(section1)

    const label = new G.TextBlock('label')
    label.text = 'label1'
    label.color = 'lightcoral'
    label.width = 1
    label.height = '40px'
    section1.addControl(label)

    const content11 = new G.Rectangle('content')
    content11.width = 1
    content11.height = '40px'
    content11.background = 'lightcoral'
    content11.thickness = 1
    section1.addControl(content11)

    const contentcontent11 = new G.TextBlock('contentcontent')
    contentcontent11.width = 1
    contentcontent11.height = 1
    contentcontent11.fontSize = '14px'
    contentcontent11.text = 'content11'
    contentcontent11.color = 'cyan'
    content11.addControl(contentcontent11)

    const content12 = new G.Rectangle('content')
    content12.width = 1
    content12.height = '40px'
    content12.background = 'lightcoral'
    content12.thickness = 1
    section1.addControl(content12)

    const content13 = new G.Rectangle('content')
    content13.width = 1
    content13.height = '40px'
    content13.background = 'lightcoral'
    content13.thickness = 1
    section1.addControl(content13)

    const content14 = new G.Rectangle('content')
    content14.width = 1
    content14.height = '40px'
    content14.background = 'lightcoral'
    content14.thickness = 1
    section1.addControl(content14)

    const section2 = new G.StackPanel('section')
    section2.width = 1 / 4
    section2.height = 1
    section2.background = 'seagreen'
    panel.addControl(section2)

    return scene
};