function initializeGraph() {
	const ctx = document.getElementById('populationChart').getContext('2d');
	if (!ctx) {
		console.error('Cannot find canvas element');
		return;
	}

	const initialPopulation1Input = document.getElementById('initialPopulation1');
	const carryingCapacity1Input = document.getElementById('carryingCapacity1');
	const growthRate1Input = document.getElementById('growthRate1');
	const growthRate1Value = document.getElementById('growthRateValue1');
	const timeRangeMin1Input = document.getElementById('timeMin1');
	const timeRangeMax1Input = document.getElementById('timeMax1');

	const initialPopulation2Input = document.getElementById('initialPopulation2');
	const carryingCapacity2Input = document.getElementById('carryingCapacity2');
	const growthRate2Input = document.getElementById('growthRate2');
	const growthRate2Value = document.getElementById('growthRateValue2');
	const timeRangeMin2Input = document.getElementById('timeMin2');
	const timeRangeMax2Input = document.getElementById('timeMax2');

	let initialPopulation1 = parseInt(initialPopulation1Input.value);
	let carryingCapacity1 = parseInt(carryingCapacity1Input.value);
	let growthRate1 = parseFloat(growthRate1Input.value);
	let timeRangeMin1 = parseInt(timeRangeMin1Input.value);
	let timeRangeMax1 = parseInt(timeRangeMax1Input.value);

	let initialPopulation2 = parseInt(initialPopulation2Input.value);
	let carryingCapacity2 = parseInt(carryingCapacity2Input.value);
	let growthRate2 = parseFloat(growthRate2Input.value);
	let timeRangeMin2 = parseInt(timeRangeMin2Input.value);
	let timeRangeMax2 = parseInt(timeRangeMax2Input.value);

	function updateValues1() {
		growthRate1 = parseFloat(growthRate1Input.value);
		growthRate1Value.textContent = growthRate1;
		initialPopulation1 = parseInt(initialPopulation1Input.value);
		carryingCapacity1 = parseInt(carryingCapacity1Input.value);
		timeRangeMin1 = parseInt(timeRangeMin1Input.value);
		timeRangeMin2 = timeRangeMin1;
		timeRangeMax1 = parseInt(timeRangeMax1Input.value);
		timeRangeMax2 = timeRangeMax1;

		document.getElementById('timeMin2').value = document.getElementById('timeMin1').value;
		document.getElementById('timeMax2').value = document.getElementById('timeMax1').value;

		updateChart();
	}

	function updateValues2() {
		growthRate2 = parseFloat(growthRate2Input.value);
		growthRate2Value.textContent = growthRate2;
		initialPopulation2 = parseInt(initialPopulation2Input.value);
		carryingCapacity2 = parseInt(carryingCapacity2Input.value);
		timeRangeMin2 = parseInt(timeRangeMin2Input.value);
		timeRangeMin1 = timeRangeMin2;
		timeRangeMax2 = parseInt(timeRangeMax2Input.value);
		timeRangeMax1 = timeRangeMax2;

		document.getElementById('timeMin1').value = document.getElementById('timeMin2').value;
		document.getElementById('timeMax1').value = document.getElementById('timeMax2').value;

		updateChart();
	}

	growthRate1Input.addEventListener('input', updateValues1);
	initialPopulation1Input.addEventListener('change', updateValues1);
	carryingCapacity1Input.addEventListener('change', updateValues1);
	timeRangeMin1Input.addEventListener('change', updateValues1);
	timeRangeMax1Input.addEventListener('change', updateValues1);

	growthRate2Input.addEventListener('input', updateValues2);
	initialPopulation2Input.addEventListener('change', updateValues2);
	carryingCapacity2Input.addEventListener('change', updateValues2);
	timeRangeMin2Input.addEventListener('change', updateValues2);
	timeRangeMax2Input.addEventListener('change', updateValues2);

	document.querySelectorAll('.tab-btn').forEach(button => {
		button.addEventListener('click', () => {
			document.querySelectorAll('.tab-btn').forEach(btn => {
				btn.classList.remove('bg-blue-500', 'text-white', 'active');
				btn.classList.add('bg-gray-300', 'text-gray-700');
			});
			document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
			button.classList.remove('bg-gray-300', 'text-gray-700');
			button.classList.add('bg-blue-500', 'text-white', 'active');
			const tabContent = document.getElementById(button.getAttribute('data-tab'));
			tabContent.classList.add('active');
		});
	});

	function logisticGrowth(P0, r, K, t) {
		return K / (1 + ((K - P0) / P0) * Math.exp(-r * t));
	}

	function generateData(P0, r, K) {
		const data = [];
		for (let t = timeRangeMin1; t <= timeRangeMax1; t++) {
			data.push(logisticGrowth(P0, r, K, t));
		}
		return data;
	}

	const chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: Array.from({ length: timeRangeMax1 - timeRangeMin1 + 1 }, (_, i) => i + timeRangeMin1),
			datasets: [
				{
					label: 'Population Size Line 1',
					data: generateData(initialPopulation1, growthRate1, carryingCapacity1),
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 2,
					fill: false
				},
				{
					label: 'Population Size Line 2',
					data: generateData(initialPopulation2, growthRate2, carryingCapacity2),
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 2,
					fill: false
				}
			]
		},
		options: {
			responsive: true,
			scales: {
				x: {
					title: {
						display: true,
						text: 'Time'
					}
				},
				y: {
					title: {
						display: true,
						text: 'Population Size'
					}
				}
			}
		}
	});

	function updateChart() {
		chart.data.labels = Array.from({ length: timeRangeMax1 - timeRangeMin1 + 1 }, (_, i) => i + timeRangeMin1);
		chart.data.datasets[0].data = generateData(initialPopulation1, growthRate1, carryingCapacity1);
		chart.data.datasets[1].data = generateData(initialPopulation2, growthRate2, carryingCapacity2);
		chart.update();
	}

	// Initial chart update
	updateChart();
}

//initializeGraph();
// Check if HTMX is being used
if (typeof htmx !== 'undefined') {
	// If HTMX is present, use its event system

	document.body.addEventListener('htmx:load', function(event) {
		if (event.detail.elt.id === 'content') {
			initializeGraph();
		}
	});
	initializeGraph();
} else {
	// If HTMX is not present, run the function immediately

	initializeGraph();
}
