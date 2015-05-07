var settings = require('./../Settings');
var General = require('./../General');
var PS = require('./../ParticleSandbox');
var GenerateParticlesMenu = require('./GenerateParticlesMenu');
var Events = require('../Events');

var Menu = {};
module.exports = Menu;

Events.addListener('Gravity.initialize', function () {
    Menu.initialize();
    $('#generate-particle-rate').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleRate(); });
    $('#generate-particle-area').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleArea(); });
    $('#generate-particle-speed').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleSpeed(); });
    $('#generate-particle-randomizer').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleRandomizer(); });
    $('#generate-particle-size').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleSize(); });
    GenerateParticlesMenu.initializeView();
});
Events.addListener('Gravity.create', function () {
    Menu.initializeView();
    GenerateParticlesMenu.initializeView();
});

Menu.toggleCollision = function () {
    settings.enableCollision = !settings.enableCollision;
    Menu.updateCollision();
};
Menu.updateCollision = function () {
    if (settings.enableCollision === true) {
        $('#toggle-collision').parent().addClass("ul-li-selected");
    } else {
        $('#toggle-collision').parent().removeClass("ul-li-selected");
    }
};

Menu.toggleFollowLargest = function () {
    settings.followLargest = !settings.followLargest;
    Menu.updateFollowLargest();
};
Menu.updateFollowLargest = function () {
    if (settings.followLargest === true) {
        $('#toggle-followLargest').parent().addClass("ul-li-selected");
    } else {
        $('#toggle-followLargest').parent().removeClass("ul-li-selected");
    }
};


Menu.toggleShowQuadtree = function () {
    settings.showQuadtree = !settings.showQuadtree;
    Menu.updateShowQuadtree();
};
Menu.updateShowQuadtree = function () {
    var $toggleQuadtree = $('#toggle-quadtree');
    if (settings.showQuadtree) {
        $toggleQuadtree.parent().addClass("ul-li-selected");
        $toggleQuadtree.html("Hide Quadtree");
    } else {
        $toggleQuadtree.parent().removeClass("ul-li-selected");
        $toggleQuadtree.html("Show Quadtree");
    }
};

Menu.setGravityProportion = function () {
    var value = Math.floor(100 * $('#gravity-proportion').slider().data('value')) / 100;
    if (General.isNumber(value)) {
        PS.instance.gravityProportion = value / (21 - PS.instance.gravityExponential * 20);
    }
};
Menu.setGravityExponential = function () {
    var value = Math.floor($('#gravity-exponential').slider().data('value')) / 100;
    if (General.isNumber(value)) {
        PS.instance.gravityExponential = value;
        Menu.setGravityProportion();
    }
};

Menu.update = function () {
    $('#fps').html(PS.instance.frameRate + " fps");
    $('#cap').html((PS.instance.processingTime / 10).toFixed(1) + "%");
    $('#particleCount').html(PS.particleCount());

    setTimeout(function () {Menu.update();}, 100);
};


Menu.initialize = function () {
    Menu.initializeFunctions();
    Menu.initializeView();
};
Menu.initializeView = function () {
    Menu.updateCollision();
    Menu.updateFollowLargest();
    Menu.updateShowQuadtree();
    Menu.update();
};
Menu.initializeFunctions = function () {
    $('#toggle-collision').click(function () { Menu.toggleCollision(); });
    $('#toggle-followLargest').click(function () { Menu.toggleFollowLargest(); });

    $('#toggle-menu-generate-particles').click(function () {
        Menu.hideMenus();
        $('#menu-generate-particles').slideToggle(150);
    });
    $('#toggle-menu-gravity').click(function () {
        Menu.hideMenus();
        $('#menu-gravity').slideToggle(150);
    });
    $('#toggle-menu-trails').click(function () {
        Menu.hideMenus();
        $('#menu-trails').slideToggle(150);
    });

    $('#toggle-quadtree').click(function () { Menu.toggleShowQuadtree(); });
    $('#gravity-proportion').slider().on('slide', function () { Menu.setGravityProportion(); });
    $('#gravity-exponential').slider().on('slide', function () { Menu.setGravityExponential(); });

    $('#trail-lifetime').slider().on('slide', function () {
        var scope = angular.element($("#trail-lifetime")).scope();
        scope.$apply(function () {
            scope.trailLifetime = $('#trail-lifetime').slider().data('value');
        });
    });

};
