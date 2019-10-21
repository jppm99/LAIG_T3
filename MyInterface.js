/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by default)

        this.lightGroup = this.gui.addFolder("Lights");
        this.lightGroup.close();

        this.viewsGroup = this.gui.addFolder("Views");
        this.viewsGroup.close();

        this.initKeys();

        return true;
    }

    addLights(n, names){
        for(var i = 0; i < n; i++) {
            this.lightGroup.add(this.scene.lightsStatus, i).name("Light " + (i + 1)).name(names[i]);
        }
    }

    addViews(vec){
        this.viewsGroup.add(this.scene, 'selectedView', vec).name('Selected View');
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
        if(event.code == "KeyM")
            console.log("Counter: " + this.scene.increaseM());
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}