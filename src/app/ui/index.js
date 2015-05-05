require('./instance');
require('./GenerateParticlesMenu');

if (!('ontouchstart' in document)) {
    require('./DesktopControllers');
    require('./DesktopEvents');
    require('./DesktopMenu');
    require('./Navbar');
}

if ('ontouchstart' in document) {
    require('./MobileControllers');
    require('./MobileEvents');
}

