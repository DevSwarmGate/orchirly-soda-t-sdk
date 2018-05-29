const   BuildSystem = require('dev-env-build-system'),
        Path = require('path'),
        _root = Path.dirname(__dirname);

let buildSystem = new BuildSystem(
        `${_root}\/client\/src`,
        `${_root}\/client\/dist`,
        {
            "testIcon":{
                ".js":"unitTest/testIcon.js"
            },
            "testCanvas":{
                ".js":"unitTest/testCanvas.js"
            },
            "testShare":{
                ".js":"unitTest/testShare.js"
            }
        }
    );
buildSystem.watch();