/**
 * Animation
 * @constructor
 * @abstract
 * */

class Animation{
    constructor(){
    }

    update(currInstant){
        //console.error("Class Animation is abstract and can't be implemented.");
        throw new Error("Class Animation is abstract and can't be implemented.");
    }

    apply(){
        //console.error("Class Animation is abstract and can't be implemented.");
        throw new Error("Class Animation is abstract and can't be implemented.");
    }
}