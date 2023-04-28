const counter = document.getElementById("counter");
const incrementer = document.getElementById("incrementer");
function increment() {
	console.log("incrementing");
	counter.innerHTML = parseInt(counter.innerHTML) + parseInt(incrementer.value);
}