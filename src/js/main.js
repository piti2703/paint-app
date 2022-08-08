const colors = document.querySelectorAll(".tools-area__box i")
const rangeInput = document.querySelector(".tools-area__box-range")
const colorInput = document.querySelector(".tools-area__box-color")
const clearBtn = document.querySelector(".fa-xmark")
const undoBtn = document.querySelector(".fa-rotate-left")
const eraserBtn = document.querySelector(".eraser")

const brush = document.querySelector(".fa-paintbrush")
const line = document.querySelector(".tools-area__box-line")
const square = document.querySelector(".fa-square-full")

const allTools = document.querySelectorAll(".tool")
let recentColor

let aLine
let bLine
let cLine
let dLine
let aRectangle
let bRectangle
let cRectangle
let dRectangle

// CANVAS 1
const canvas = document.querySelector(".drawing-area")
const ctx = canvas.getContext("2d")

canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

ctx.strokeStyle = "#000"
ctx.lineJoin = "round"
ctx.lineCap = "round"
ctx.lineWidth = 10
ctx.fillStyle = "#fff"

// CANVAS 2

const canvas2 = document.querySelector(".drawing-area2")
const ctx2 = canvas2.getContext("2d")

canvas2.width = canvas2.offsetWidth
canvas2.height = canvas2.offsetHeight

ctx2.strokeStyle = "#000"
ctx2.lineJoin = "round"
ctx2.lineCap = "round"
ctx2.lineWidth = 10

let isDrawing = false
let lastX = 0
let lastY = 0

let restoreArray = []
let index = -1

function draw(e) {
	if (!isDrawing) return

	if (brush.classList.contains("active")) {
		ctx.beginPath()
		ctx.moveTo(lastX, lastY)
		ctx.lineTo(e.offsetX, e.offsetY)
		ctx.stroke()
		lastX = e.offsetX
		lastY = e.offsetY
	} else if (line.classList.contains("active")) {
		canvas.style.opacity = 0.8

		ctx2.beginPath()
		ctx2.moveTo(lastX, lastY)
		ctx2.lineTo(e.offsetX, e.offsetY)

		ctx2.fillStyle = "#fff"
		ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
		ctx2.fillRect(0, 0, canvas2.width, canvas2.height)

		ctx2.stroke()

		aLine = lastX
		bLine = lastY
		cLine = e.offsetX
		dLine = e.offsetY
	} else if (square.classList.contains("active")) {
		canvas.style.opacity = 0.8

		ctx2.beginPath()
		ctx2.rect(lastX, lastY, e.offsetX, e.offsetY)

		ctx2.fillStyle = "#fff"
		ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
		ctx2.fillRect(0, 0, canvas2.width, canvas2.height)

		ctx2.stroke()

		aRectangle = lastX
		bRectangle = lastY
		cRectangle = e.offsetX
		dRectangle = e.offsetY
	}
}

function changeColor() {
	if (this.classList.contains("red")) {
		ctx.strokeStyle = "#ec0707"
	} else if (this.classList.contains("green")) {
		ctx.strokeStyle = "#008000"
	} else if (this.classList.contains("blue")) {
		ctx.strokeStyle = "#0707e0"
	} else if (this.classList.contains("yellow")) {
		ctx.strokeStyle = "#fdcb58"
	} else if (this.classList.contains("tools-area__box-color")) {
		ctx.strokeStyle = this.value
	} else return
}

function changeWidth() {
	ctx.lineWidth = this.value
	ctx2.lineWidth = this.value
}

function eraser() {
	recentColor = ctx.strokeStyle
	brush.classList.add("active")
	line.classList.remove("active")
	square.classList.remove("active")
	ctx.strokeStyle = "#fff"
}

function clearCanvas() {
	ctx.fillStyle = "#fff"
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx2.fillStyle = "#fff"
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
	ctx2.fillRect(0, 0, canvas2.width, canvas2.height)
	restoreArray = []
	index = -1
}

function undo() {
	if (index <= 0) {
		clearCanvas()
	} else {
		index -= 1
		restoreArray.pop()
		ctx.putImageData(restoreArray[index], 0, 0)
		ctx2.putImageData(restoreArray[index], 0, 0)
	}
}

function changeActive() {
	const parent = this.parentNode
	const allSiblings = parent.children
	const arr = Array.from(allSiblings)
	arr.forEach(el => el.classList.remove("active"))

	this.classList.add("active")
}

function creteLine(a, b, c, d) {
	ctx.beginPath()
	ctx.moveTo(a, b)
	ctx.lineTo(c, d)
	ctx.stroke()
}

function createRectangle(a, b, c, d) {
	ctx.beginPath()
	ctx.rect(a, b, c, d)
	ctx.stroke()
	console.log("test")
}

canvas.addEventListener("mousedown", e => {
	isDrawing = true
	lastX = e.offsetX
	lastY = e.offsetY
})

canvas2.addEventListener("mousedown", e => {
	isDrawing = true
	lastX = e.offsetX
	lastY = e.offsetY

	aLine = 0
	bLine = 0
	cLine = 0
	dLine = 0
})

canvas.addEventListener("mousemove", draw)
canvas2.addEventListener("mousemove", draw)

canvas.addEventListener("mouseup", () => {
	isDrawing = false

	if (line.classList.contains("active")) {
		creteLine(aLine, bLine, cLine, dLine)
	} else if (square.classList.contains("active")) {
		createRectangle(aRectangle, bRectangle, cRectangle, dRectangle)
	}

	canvas.style.opacity = 1

	restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
	index += 1

	console.log(restoreArray)
})
canvas.addEventListener("mouseout", () => {
	if (brush.classList.contains("active")) {
		isDrawing = false
	} else return
})

colors.forEach(color => color.addEventListener("click", changeColor))
colorInput.addEventListener("change", changeColor)
rangeInput.addEventListener("change", changeWidth)

clearBtn.addEventListener("click", clearCanvas)
undoBtn.addEventListener("click", undo)

allTools.forEach(tool => {
	tool.addEventListener("click", changeActive)
	tool.addEventListener("click", () => {
		ctx.strokeStyle = recentColor
	})
})

eraserBtn.addEventListener("click", eraser)

const download_img = function (el) {
	var imageURI = canvas.toDataURL("image/png")
	el.href = imageURI
}
