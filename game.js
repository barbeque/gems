function setup() {
	var state = {
		keyboard: new Keyboard(),
		canvas: document.getElementById("game"),
		context: document.getElementById("game").getContext("2d"),
		cells: make2DArray(16, 22),
		dropTimer: 0,
		dropColumn: 0,
		dropRow: 0,
		currentDrop: [ 3, 2, 1 ],
		nextDrop: [ 1, 2, 3 ],
		currentSpeed: 1.0,
		score: 0,
		stepTimer: 0
	};

	var stub = function() {
		step(state);
	};

	for(var r = 0; r < state.cells.length; ++r) {
		for(var c = 0; c < state.cells[r].length; ++c) {
			state.cells[r][c] = 0;
		}
	}

	state.cells = makeRandomGarbage(state.cells);

	setInterval(stub, 1000 / 20);
}

function makeRandomGarbage(cells) {
	for(var c = 0; c < cells[0].length; ++c) {
		var garbageHeight = Math.round(Math.random() * 3 + 1);
		for(var x = 0; x < garbageHeight; ++x) {
			cells[cells.length - 1 - x][c] = Math.floor(Math.random() * 4 + 1);
		}
	}

	return cells;
}

function getColourForCell(cellIndex) {
	switch(cellIndex) {
		case 0:
			return "black";
		case 1:
			return "purple";
		case 2:
			return "yellow";
		case 3:
			return "green";
		case 4:
			return "blue";
		default:
			alert("Fuck this shit, cell out of range (" + cellIndex + ")");
	}
}

function drawHud(state) {
	state.context.save();

	state.context.textBaseline = "top";
	state.context.fillStyle = "black";
	state.context.font = "bold 48px sans-serif";
	state.context.fillText("gems", 20, 20);

	state.context.font = "italic 12px sans-serif";
	state.context.fillText("match the colours, knave!", 50, 68);

	state.context.font = "bold 16px sans-serif";
	state.context.fillText("score: " + state.score, 30, 110);
	state.context.fillText("next:", 30, 130);
	state.context.fillRect(81, 130, 46, 100);

	drawPiece(state.nextDrop, 81 + 15, 130 + 26, state);

	state.context.restore();
}

function drawPiece(piece, x, y, state) {
	state.context.save();

	for(var i = 0; i < piece.length; ++i) {
		var colour = getColourForCell(piece[i]);
		state.context.fillStyle = colour;
		state.context.fillRect(x, y + (i * 16), 16, 16);
	}

	state.context.restore();
}

function dropPiece(state) {
	state.dropTimer += 1 * state.currentSpeed;
	if(state.dropTimer >= 10) {
		state.dropRow++;
		state.dropTimer = 0;
		// TODO: Collision detection

		if(state.dropRow + 3 >= state.cells.length) {
			state.dropRow = Math.min(state.cells.length - 4, state.dropRow);
			// hit the bottom of the level
			// write the dropped piece into the map
			writePiece(state.currentDrop, state.dropColumn, state.dropRow, state);
			resetDrop(state);
		}
		else {
			// check for piece on piece collision
			var hitAnything = state.cells[state.dropRow + 3][state.dropColumn] > 0;
			if(hitAnything) {
				// write the dropped piece into the map
				writePiece(state.currentDrop, state.dropColumn, state.dropRow, state);
				resetDrop(state);
			}
		}
	}
}

function resetDrop(state) {
	// Reset current position
	state.dropColumn = 0; // TODO: Fix
	state.dropRow = 0;

	// Copy next into current,
	// Grab a new piece into next
	for(var i = 0; i < state.nextDrop.length; ++i) {
		state.currentDrop[i] = state.nextDrop[i];
		state.nextDrop[i] = Math.floor(Math.random() * 4) + 1;
	}

	// Piece hit, so check the map for adjacencies
	clearAdjacencies(state);
}

function writePiece(piece, x, y, state) {
	for(var i = 0; i < piece.length; ++i) {
		state.cells[y + i][x] = piece[i];
	}
}

function clearAdjacencies(state) {

}

function canStepPieceSideways(state, direction) {
	if(state.dropColumn + direction < 0) {
		return false;
	}
	if(state.dropColumn + direction >= state.cells[0].length) {
		return false;
	}

	// TODO: piece collision
	return true;
}

function step(state) {
	with(state) {
		context.save();
		context.fillStyle = "darkgrey";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.restore();

		var xOff = 235;
		var yOff = 18;

		context.save();
		for(var r = 0; r < cells.length; ++r) {
			for(var c = 0; c < cells[r].length; ++c) {
				var colour = getColourForCell(cells[r][c]);
				context.fillStyle = colour;
				context.fillRect(xOff + c * 16, yOff + r * 16, 16, 16);
			}
		}
		context.restore();

		dropPiece(state);
		drawPiece(state.currentDrop, xOff + state.dropColumn * 16, yOff + state.dropRow * 16, state);

		state.stepTimer += 1;
		if(state.stepTimer > 2) {
			if(state.keyboard.isKeyDown(state.keyboard.leftArrowKeyCode)) {
				if(canStepPieceSideways(state, -1)) {
					state.dropColumn -= 1;
					state.stepTimer = 0;
				}
			}
			if(state.keyboard.isKeyDown(state.keyboard.rightArrowKeyCode)) {
				if(canStepPieceSideways(state, 1)) {
					state.dropColumn += 1;
					state.stepTimer = 0;
				}
			}
		}

		drawHud(state);
	}
}