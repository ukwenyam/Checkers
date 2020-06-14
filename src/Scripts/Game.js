import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export default function Game(containerEl, assetsUrl) {
    console.log("starting...");
    'use strict';

    var CHECKERS = {
        WHITE: 1,
        BLACK: 2
    };

    var containerEl = containerEl || null;

    var assetsUrl = assetsUrl || '';

    var renderer;
    var scene;
    var camera;
    var cameraController;
    var lights = {};
    var materials = {};
    var pieceGeometry = null;
    var boardModel;
    var groundModel;

    var squareSize = 10;


    var board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];


    function onBoardReady() {
        // setup the board pieces
        var row, col, piece;
        //
        for (row = 0; row < board.length; row++) {
            for (col = 0; col < board[row].length; col++) {
                if (row < 3 && (row + col) % 2) { // black piece
                    piece = {
                        color: CHECKERS.BLACK,
                        pos: [row, col]
                    };
                } else if (row > 4 && (row + col) % 2) { // white piece
                    piece = {
                        color: CHECKERS.WHITE,
                        pos: [row, col]
                    };
                } else { // empty square
                    piece = 0;
                }

                board[row][col] = piece;

                if (piece) {
                    addPiece(piece);
                }
            }
        }
    }


    function initEngine() {
        var viewWidth = window.innerWidth;
        var viewHeight = window.innerHeight;
        console.log('view h' + viewHeight);
        console.log('view w' + viewWidth);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(viewWidth, viewHeight);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, viewWidth / viewHeight, 0.1, 10000);
        camera.position.set(squareSize, 120, 150);
        camera.rotateZ(-90);
        cameraController = new OrbitControls(camera, containerEl);
        cameraController.center = new THREE.Vector3(squareSize * 4, 0, squareSize * 4);

        scene.add(camera);

        containerEl.appendChild(renderer.domElement);
    }

    function initObject(callback) {
        var loader = new GLTFLoader();
        var totalObjectsToLoad = 2; // board + the piece
        var loadedObjects = 0; // count the loaded pieces
        console.log("ininting object");
        // checks if all the objects have been loaded
        function checkLoad() {
            loadedObjects++;

            if (loadedObjects === totalObjectsToLoad && callback) {
                callback();
            }
        }

        // load board
        console.log("about to load with loader!");
        console.log(loader);
        loader.load(assetsUrl + 'board.glb', function(geom) {
            console.log("geom is ");
            console.log(geom);

            var model = geom.scene;
            var ob = model.getObjectByName("mesh_0");
            boardModel = new THREE.Mesh(ob.geometry, materials.boardMaterial);
            boardModel.position.y = -0.02;
            boardModel.translateX(-40);
            boardModel.translateZ(-40);
            scene.add(boardModel);
            groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), materials.groundMaterial);
            groundModel.position.set(squareSize * 4, -1.52, squareSize * 4);
            groundModel.rotation.x = -90 * Math.PI / 180;
            groundModel.translateX(-40);
            groundModel.translateZ(-40);
            scene.add(groundModel);

            var squareMaterial;

            for (var row = 0; row < 8; row++) {
                for (var col = 0; col < 8; col++) {
                    if ((row + col) % 2 === 0) { // light square
                        squareMaterial = materials.lightSquareMaterial;
                    } else { // dark square
                        squareMaterial = materials.darkSquareMaterial;
                    }

                    var square = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 1, 1), squareMaterial);

                    square.position.x = col * squareSize + squareSize / 2;
                    square.position.z = row * squareSize + squareSize / 2;
                    square.position.y = -0.01;
                    square.translateX(-40);
                    square.translateZ(-40);
                    square.rotation.x = -90 * Math.PI / 180;


                    scene.add(square)
                }
            }

            checkLoad();
        });

        // load piece
        loader.load(assetsUrl + 'piece.glb', function(geometry) {

            console.log("Geometry is");
            console.log(geometry);
            pieceGeometry = geometry.scene.getObjectByName("mesh_0").geometry;

            checkLoad();
        });

        scene.add(new THREE.AxesHelper(200));

        callback();
    }

    function onAnimationFrame() {
        requestAnimationFrame(onAnimationFrame);

        cameraController.update();

        renderer.render(scene, camera);

    }

    function boardToWorld(pos) {
        var x = (1 + pos[1]) * squareSize - squareSize / 2;
        var z = (1 + pos[0]) * squareSize - squareSize / 2;

        return new THREE.Vector3(x, 0, z);
    }

    function drawBoad(callback) {
        initEngine();
        initLights();
        initMaterials();
        initObject(function() {
            onAnimationFrame();

            callback();
        });
    }

    function addPiece(piece) {

        var pieceMesh = new THREE.Mesh(pieceGeometry);
        var pieceObjGroup = new THREE.Object3D();
        //
        if (piece.color === CHECKERS.WHITE) {
            pieceObjGroup.color = CHECKERS.WHITE;
            pieceMesh.material = materials.whitePieceMaterial;
        } else {
            pieceObjGroup.color = CHECKERS.BLACK;
            pieceMesh.material = materials.blackPieceMaterial;
        }

        // create shadow plane
        var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 1, 1), materials.pieceShadowPlane);
        shadowPlane.rotation.x = -90 * Math.PI / 180;

        pieceObjGroup.add(pieceMesh);
        pieceObjGroup.add(shadowPlane);
        var poss = boardToWorld(piece.pos);
        pieceObjGroup.position.set(poss.x, poss.y, poss.z);

        board[piece.pos[0]][piece.pos[1]] = pieceObjGroup;
        pieceObjGroup.translateX(-40);
        pieceObjGroup.translateZ(-40);
        scene.add(pieceObjGroup);
    }

    function initLights() {

        lights.topLight = new THREE.PointLight();
        lights.topLight.position.set(squareSize * 4, 150, squareSize * 4);
        lights.topLight.intensity = 1.0;

        scene.add(lights.topLight);

        lights.bottomLight = new THREE.PointLight();
        lights.bottomLight.position.set(squareSize * 4, -150, squareSize * 4);
        lights.bottomLight.intensity = 1.0;

        scene.add(lights.bottomLight);

        lights.sideLight = new THREE.PointLight();
        lights.sideLight.position.set(squareSize * 4, 0, squareSize * 8);
        lights.sideLight.intensity = 1.0;

        scene.add(lights.sideLight);

    }

    function initMaterials() {
        var texture = new THREE.TextureLoader().load(assetsUrl + "board_texture.jpg");

        materials.boardMaterial = new THREE.MeshLambertMaterial({
            map: texture
        });
        console.log(`${assetsUrl}board_texture.jpg loaded`);
        texture = new THREE.TextureLoader().load(assetsUrl + 'ground.png');

        materials.groundMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            map: texture
        });
        console.log(`${assetsUrl}ground.png loaded`);

        texture = new THREE.TextureLoader().load(assetsUrl + 'square_dark_texture.jpg');
        materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
            map: texture
        });
        console.log(`${assetsUrl}square_dark_texture.jpg loaded`);

        texture = new THREE.TextureLoader().load(assetsUrl + 'square_light_texture.jpg');
        materials.lightSquareMaterial = new THREE.MeshLambertMaterial({
            map: texture
        });
        console.log(`${assetsUrl}square_light_texture.jpg loaded`);

        materials.whitePieceMaterial = new THREE.MeshPhongMaterial({
            color: 0xe9e4bd,
            shininess: 20
        });

        materials.blackPieceMaterial = new THREE.MeshPhongMaterial({
            color: 0x9f2200,
            shininess: 20
        });

        texture = new THREE.TextureLoader().load(assetsUrl + 'piece_shadow.png');
        materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
            transparent: true,
            map: texture
        });
        console.log(`${assetsUrl}piece_shadow.png loaded`);
    }



    drawBoad(onBoardReady);
}