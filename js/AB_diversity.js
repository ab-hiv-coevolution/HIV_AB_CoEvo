/* JAVASCRIPT CODE GOES HERE */

Plotly.d3.csv("https://raw.githubusercontent.com/phamoh/HIV_AB_CoEvo/phamoh-patch-1/antibodyHIVdata.csv",
	function (err, rows) {

		function unpack(rows, key) {
			return rows.map(function (row) {
				return row[key];
			});
		}

		var allPatientIDs = unpack(rows, 'patient_id'),
			allTimePoints = unpack(rows, 'time_point'),
			allABDPi = unpack(rows, 'ab_diversity_pi'),
			allHIV_div = unpack(rows, 'hiv_diversity_pi'),
			listofPatients = [],
			listofDataViz = ["Antibody Diversity", "HIV Diversity", "Both"],
			currentPatient,
			currentABDPi = [],
			currentHIVPi = [],
			currentTimePoint = [];

		//This affects the dropdown menu
		for (var i = 0; i < allPatientIDs.length; i++) {
			if (listofPatients.indexOf(allPatientIDs[i]) === -1) {
				listofPatients.push(allPatientIDs[i]);
			}
		}


		//This function gets the data from the patient chosen on the dropdown
		function getPatientData(chosenPatient, chosenData) {
			currentHIVPi = [];
			currentABDPi = [];
			currentTimePoint = [];
			for (var i = 0; i < allPatientIDs.length; i++) {
				if (allPatientIDs[i] === chosenPatient && chosenData === "Antibody Diversity") {
					currentABDPi.push(allABDPi[i]);
					currentTimePoint.push(allTimePoints[i]);
				}
				else if (allPatientIDs[i] === chosenPatient && chosenData === "HIV Diversity") {
					currentHIVPi.push(allHIV_div[i]);
					currentTimePoint.push(allTimePoints[i]);
				}
				else if (allPatientIDs[i] === chosenPatient && chosenData === "Both") {
					currentTimePoint.push(allTimePoints[i]);
					currentABDPi.push(allABDPi[i]);
					currentHIVPi.push(allHIV_div[i]);
				}
			}
		};

		// Default Patient 1 Data
		setBubblePlot('1', 'Antibody Diversity');

		//
		function setBubblePlot(chosenPatient, chosenData) {
			getPatientData(chosenPatient, chosenData);
			if (chosenData === "Antibody Diversity") {
				var trace1 = {
					x: currentTimePoint,
					y: currentABDPi,
					mode: 'lines+markers',
					type: 'scatter',
					connectgaps: true,
					marker: {
						size: 12,
						opacity: 0.5
					}
				}
				var data = [trace1];
			}
			else if(chosenData === "HIV Diversity"){
				var trace2 = {
					x: currentTimePoint,
					y: currentHIVPi,
					mode: 'lines+markers',
					type: 'scatter',
					connectgaps: true,
					marker: {
						size: 12,
						opacity: 0.5
					}
				}
				var data = [trace2];
			}
			else if(chosenData === "Both"){
				var trace1 = {
					x: currentTimePoint,
					y: currentABDPi,
					mode: 'lines+markers',
					type: 'scatter',
					connectgaps: true,
					marker: {
						size: 12,
						opacity: 0.5
					}
				}
				var trace2 = {
					x: currentTimePoint,
					y: currentHIVPi,
					mode: 'lines+markers',
					type: 'scatter',
					connectgaps: true,
					marker: {
						size: 12,
						opacity: 0.5
					}
				}
				var data = [trace1, trace2]

			}
		


			//This function is for the layout of the plot
			//var data = [trace1];
			var layout = {
				title: chosenData + ' of Patient ' + chosenPatient,
				titlefont: {
					family: 'Poppins, sans-serif',
				},
				xaxis: {
					title: 'Estimated Time Since Infection (days)',
					titlefont: {
						family: 'Poppins, sans-serif',
					},
				},

				yaxis: {
					title: 'Diversity (pi)',
					titlefont: {
						family: 'Poppins, sans-serif',
					},
				}

			};

			Plotly.newPlot('plotdiv', data, layout, { showSendToCloud: true, responsive: true });
		};

		// This code populates the info to the plots and the dropdowns.
		var innerContainer = document.querySelector('[data-num="0"]'),
			//plotEl = innerContainer.querySelector('.plot'),
			patientSelector = innerContainer.querySelector('.patientnumber');
			dataSelector = innerContainer.querySelector('.datatype');

		function assignOptions(textArray, selector) {
			for (var i = 0; i < textArray.length; i++) {
				var currentOption = document.createElement('option');
				currentOption.text = textArray[i];
				selector.appendChild(currentOption);
			}
		}

		assignOptions(listofPatients, patientSelector);
		assignOptions(listofDataViz, dataSelector);
		
		console.log(listofPatients);
		console.log(dataSelector.value);



		function updatePatient() {
			setBubblePlot(patientSelector.value, dataSelector.value);
		}

		patientSelector.addEventListener('change', updatePatient, false);
		dataSelector.addEventListener('change', updatePatient, false);
	});