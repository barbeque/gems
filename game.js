function setup() {
	var state = {
		keyboard: new Keyboard(),
		canvas: document.getElementById("game"),
		context: document.getElementById("game").getContext("2d"),
		cells: make2DArray(16, 22)
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

	state.context.font = "italic 12px serif";
	state.context.fillText("match the colours, knave!", 50, 68);

	state.context.restore();
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

		drawHud(state);
	}
}