var settings = require('./../Settings');
var General = require('./../General');
var Gravity = require('./../Gravity');
var GenerateParticlesMenu = require('./GenerateParticlesMenu');

var Menu = {};
module.exports = Menu;

$(document).on('Gravity.initialize', function () {
    Menu.initialize();
    $('#generate-particle-rate').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleRate(); });
    $('#generate-particle-area').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleArea(); });
    $('#generate-particle-speed').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleSpeed(); });
    $('#generate-particle-randomizer').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleRandomizer(); });
    $('#generate-particle-size').slider().on('slide', function () { GenerateParticlesMenu.setGenerateParticleSize(); });
    GenerateParticlesMenu.initializeView();
});
$(document).on('Gravity.create', function () {
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
        Gravity.instance.gravityProportion = value / (21 - Gravity.instance.gravityExponential * 20);
    }
};
Menu.setGravityExponential = function () {
    var value = Math.floor($('#gravity-exponential').slider().data('value')) / 100;
    if (General.isNumber(value)) {
        Gravity.instance.gravityExponential = value;
        Menu.setGravityProportion();
    }
};

Menu.update = function () {
    $('#fps').html(Gravity.instance.frameRate + " fps");
    $('#cap').html((Gravity.instance.processingTime / 10).toFixed(1) + "%");
    $('#particleCount').html(Gravity.particleCount());

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
    $('#load').click(function () { Menu.showPopLoad(); });
    $('#pop-load-button').click(function () { Menu.load(); });
    $('#pop-load-delete-button').click(function () { $('#pop-load-delete-confirm').show(); });
    $('#pop-load-delete-confirm-button').click(function () { Menu.deleteSave(); });
    $('#save').click(function () {
        $('#pop-save-image').attr("href", Gravity.getImage());
        $("#pop-save").show();
        $('#pop-save input').focus().select();
    });
    $('#pop-save-button').click(function () { Menu.save(); });

    $('.pop-close').click(function (event) { $(event.target).parent().parent().hide(); });
    $('.pop-confirm-close').click(function (event) { $(event.target).parent().hide(); });

};
Menu.hideMenus = function () {
    $(".menu").hide();
};

Menu.load = function () {
    if (Gravity.loadInstance($("#pop-load-name").val()))
        Menu.alertInfo("Load successful.");
    else
        Menu.alertError("Load failed.");
    $('#pop-load').hide();
};
Menu.deleteSave = function () {
    if (Gravity.deleteSave($("#pop-load-name").val()))
        Menu.alertInfo("Deletion successful.");
    else
        Menu.alertError("Deletion failed.");
    $('#pop-load-delete-confirm').hide();
    $('#pop-load').hide();
};
Menu.save = function () {
    if (Gravity.save($("#pop-save-name").val()))
        Menu.alertInfo("Save successful.");
    else
        Menu.alertError("Save failed.");
    $("#pop-save").hide();
};
Menu.showPopLoad = function () {
    var options = "";
    var list = Gravity.getSaveList();
    var i = list.length;
    if (i === 0) {
        Menu.alertInfo("There are currently no saves.");
        return;
    }
    while (i--) {
        options += '<option>' + list[i] + '</option>';
    }
    $('#pop-load-name').html(options);
    $('#pop-load').show();
};

Menu.exportFile = function () {
    var gravityInstance = JSON.stringify(Gravity.instance);
    if (gravityInstance != null) {
        var uriContent = "data:application/octet-stream," + encodeURIComponent(gravityInstance);
        window.open(uriContent, 'particlesandbox.json');
    }
};

Menu.alertInfo = function (message) {
    var newAlert = document.createElement("div");
    $('#alerts').prepend($(newAlert));
    $(newAlert).html(message);
    $(newAlert).addClass("alert alert-info");
    $(newAlert).fadeTo(3000, 0.5, function () { $(newAlert).remove(); });
};
Menu.alertError = function (message) {
    var newAlert = document.createElement("div");
    $('#alerts').prepend($(newAlert));
    $(newAlert).html(message);
    $(newAlert).addClass("alert alert-danger");
    $(newAlert).fadeTo(3000, 0.5, function () { $(newAlert).remove(); });
};

