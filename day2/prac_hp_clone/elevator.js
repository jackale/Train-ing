// {
//     init: function(elevators, floors) {
//         var elevator0 = elevators[0]; // Let's use the first elevator

//         var genCallback = function (num) {
//             return function () {
//                 elevator0.goToFloor(num);
//             }
//         }

//         var insertFloor = function (e, n) {
//             return e
//         }

//         elevator0.on("idle", function () {
//         });
//         elevator0.on("floor_button_pressed", function (floorNum) {
//             if (elevator0.destinationQueue.length > 0) {
//                 console.log("akz:", floorNum);
//                 console.log("akz:", elevator0.destinationQueue);
//                 elevator0.destinationQueue.push(floorNum);
//                 elevator0.destinationQueue.sort(function (a, b) { return a - b; });
//                 elevator0.checkDestinationQueue();
//             } else {
//                 elevator0.goToFloor(floorNum);
//             }
//         });
//         for (var i = 0; i < floors.length; i++) {
//             floors[i].on("up_button_pressed", genCallback(i));
//             floors[i].on("down_button_pressed", genCallback(i));
//         }

//         var elevator1 = elevators[1]; // Let's use the first elevator

//         var genCallback = function (num) {
//             return function () {
//                 elevator1.goToFloor(num);
//             }
//         }

//         elevator1.on("idle", function () {
//         });
//         elevator1.on("floor_button_pressed", function (floorNum) {
//             elevator1.goToFloor(floorNum);
//         });
//         for (var i = 0; i < floors.length; i++) {
//             floors[i].on("up_button_pressed", genCallback(i));
//             floors[i].on("down_button_pressed", genCallback(i));
//         }
//     },
//     update: function(dt, elevators, floors) {
//     }
// }

{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator
        var unfulfilled = [];

        var _gUp = function (num, dir) {
            var i = num;
            return function () {
                console.log("i, " + i, "cf: ", elevator.currentFloor());
                var current = elevator.currentFloor();
                if (i < current) {
                    console.log("dD:" + elevator.destinationDirection());
                    if (elevator.destinationDirection() == "stopped") {
                        elevator.goToFloor(i);
                    } else {
                        unfulfilled.push(i);
                    }
                }
            }
        }
        var _gDown = function (num) {
            var i = num;
            return function () {
                console.log("i, " + i, "cf: ", elevator.currentFloor());
                var current = elevator.currentFloor();
                if (i > current) {
                    console.log("dD:" + elevator.destinationDirection());
                    if (elevator.destinationDirection() == "stopped") {
                        elevator.goToFloor(i);
                    } else {
                        unfulfilled.push(i);
                    }
                }
            }
        }
        elevator.on("floor_button_pressed", function (floorNum) {
            if (elevator.destinationQueue.length > 0) {
                elevator.destinationQueue.push(floorNum);
                elevator.destinationQueue.sort(function (a, b) { return a - b; });
                elevator.checkDestinationQueue();
                console.log("akz: goto: " + floorNum + " queue: " + elevator.destinationQueue.join(","));
            } else {
                elevator.goToFloor(floorNum);
            }
        });

        elevator.on("idle", function () {
            if(unfulfilled.length > 0) {
                var current = elevator.currentFloor();
                unfulfilled.sort(function (a, b) { return Math.abs(current - a) - Math.abs(current - b); });
                elevator.goToFloor(unfulfilled[0]);
            }
        });

        for (var i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed"  , _gUp(i, 1));
            floors[i].on("down_button_pressed", _gDown(i, -1));
        }

    },
    update: function(dt, elevators, floors) {
    }
}