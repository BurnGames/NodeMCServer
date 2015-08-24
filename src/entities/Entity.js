/**
 * This is the only Entity object that will be created.
 * How entities work (or will work) is that the entity
 * object is cached after an entity is destroyed, instead
 * of just having the garbage cleaner and us having to
 * constantly make new objects.
 * @constructor
 */
function Entity() {

}

module.exports = Entity;
