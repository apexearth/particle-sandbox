var General = require('./../General');
var settings = require('./../settings');

var GenerateParticlesMenu = {};
module.exports = GenerateParticlesMenu;
GenerateParticlesMenu.toggleGenerateParticles = function () {
    settings.generateParticles = !settings.generateParticles;
    GenerateParticlesMenu.updateGenerateParticles();
};
GenerateParticlesMenu.updateGenerateParticles = function () {
    if (settings.generateParticles === true) {
        $('#generate-particle').val("Generating Particles").removeClass("btn-danger").addClass("btn-success");
    } else {
        $('#generate-particle').val("Generate Particles").removeClass("btn-success").addClass("btn-danger");
    }
};

GenerateParticlesMenu.setGenerateParticleRate = function () {
    var value = $('#generate-particle-rate').slider().data('value');
    if (General.isNumber(value)) {
        settings.generateParticleRate = (30 / value).toFixed(0);
        GenerateParticlesMenu.updateGenerateParticleRate();
    }
};
GenerateParticlesMenu.updateGenerateParticleRate = function () {
    $('#generate-particle-rate-value').html((30 / settings.generateParticleRate).toFixed(0));
};

GenerateParticlesMenu.setGenerateParticleArea = function () {
    var value = $('#generate-particle-area').slider().data('value');
    if (General.isNumber(value)) {
        value = value * 100;
        settings.generateParticleArea = value.toFixed(0);
        GenerateParticlesMenu.updateGenerateParticleArea();
    }
};
GenerateParticlesMenu.updateGenerateParticleArea = function () {
    $('#generate-particle-area-value').html(settings.generateParticleArea);
};

GenerateParticlesMenu.setGenerateParticleSpeed = function () {
    var value = $('#generate-particle-speed').slider().data('value');
    if (General.isNumber(value)) {
        settings.generateParticleSpeed = value.toFixed(1);
        GenerateParticlesMenu.updateGenerateParticleSpeed();
    }
};
GenerateParticlesMenu.updateGenerateParticleSpeed = function () {
    $('#generate-particle-speed-value').html(settings.generateParticleSpeed);
};

GenerateParticlesMenu.setGenerateParticleRandomizer = function () {
    var value = $('#generate-particle-randomizer').slider().data('value');
    if (General.isNumber(value)) {
        settings.generateParticleRandomizer = value.toFixed(0);
        GenerateParticlesMenu.updateGenerateParticleRandomizer();
    }
};
GenerateParticlesMenu.updateGenerateParticleRandomizer = function () {
    if (settings.generateParticleRandomizer < 0) {
        $('#generate-particle-randomizer-value').html('Inner');

    } else if (settings.generateParticleRandomizer > 0) {
        $('#generate-particle-randomizer-value').html('Outer');
    } else {
        $('#generate-particle-randomizer-value').html('Neutral');

    }
};

GenerateParticlesMenu.setGenerateParticleSize = function () {
    var value = $('#generate-particle-size').slider().data('value');
    if (General.isNumber(value)) {
        settings.generateParticleSize = value;
        GenerateParticlesMenu.updateGenerateParticleSize();
    }
};
GenerateParticlesMenu.updateGenerateParticleSize = function () {
    $('#generate-particle-size-value').html(settings.generateParticleSize);
};

GenerateParticlesMenu.toggleGenerateParticles = function () {
    settings.generateParticles = !settings.generateParticles;
    GenerateParticlesMenu.updateGenerateParticles();
};
GenerateParticlesMenu.updateGenerateParticles = function () {
    if (settings.generateParticles === true) {
        $('#generate-particle').val("Generating Particles").removeClass("btn-danger").addClass("btn-success");
    } else {
        $('#generate-particle').val("Generate Particles").removeClass("btn-success").addClass("btn-danger");
    }
};

GenerateParticlesMenu.initializeView = function () {
    GenerateParticlesMenu.updateGenerateParticleRate();
    GenerateParticlesMenu.updateGenerateParticleSpeed();
    GenerateParticlesMenu.updateGenerateParticleArea();
    GenerateParticlesMenu.updateGenerateParticleRandomizer();
    GenerateParticlesMenu.updateGenerateParticleSize();
};
