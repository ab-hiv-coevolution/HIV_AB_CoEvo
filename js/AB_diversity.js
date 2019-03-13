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
			listofDataViz = ["ABDPi", "HIVPi"],
			currentPatient,
			clickedItem,
			holdDat,
			currentData = [],
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
			console.log("check1:" + chosenData);
			console.log("check2:" + chosenPatient);
			currentData = [];
			holdDat = chosenData;
			console.log("check3:" + currentData);
			currentABDPi = [];
			currentHIVPi = [];
			currentTimePoint = [];
			for (var i = 0; i < allPatientIDs.length; i++) {

				if (allPatientIDs[i] === chosenPatient && chosenData === 'ABDPi') {
					//console.log(currentData);
					currentTimePoint.push(allTimePoints[i]);
					currentData.push(allABDPi[i]);
					}
				else if (allPatientIDs[i] === chosenPatient && chosenData === 'HIVPi'){
					currentTimePoint.push(allTimePoints[i]);
					currentData.push(allHIV_div[i]);
				}
			}
		};

		// Default Patient 1 Data
		setBubblePlot('1', 'ABDPi');


		function setBubblePlot(chosenPatient, chosenData) {		
			getPatientData(chosenPatient, chosenData);
			
				var trace1 = {
					x: currentTimePoint,
					y: currentData,
					mode: 'lines+markers',
					type: 'scatter',
					connectgaps: true,
					marker: {
						size: 12,
						opacity: 0.5
					}

				}
				var data = [trace1];

			
		


			//This function is for the layout of the plot
			//var data = [trace1];
			var layout = {
				title: ' Patient ' + chosenPatient,
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
			dataSelector = document.querySelector('.buttons');

			

		function assignOptions(textArray, selector) {
			for (var i = 0; i < textArray.length; i++) {
				var currentOption = document.createElement('option');
				currentOption.text = textArray[i];
				selector.appendChild(currentOption);
			}
		}


		assignOptions(listofPatients, patientSelector);

		/*if (e.target !== e.currentTarget) {
	        var clickedItem = e.target.id;*/


		function updatePatient(e) {
			console.log(e.target.id);
			
			if (e.target.name === 'datatype' && e.target !== e.currentTarget) 
			{
	        	var clickedItem = e.target.id;
	        	setBubblePlot(patientSelector.value, clickedItem);}
			
			else  
			{
			
				setBubblePlot(patientSelector.value, holdDat);
			}
		};



		patientSelector.addEventListener('change', updatePatient, false);
		//dataSelector.addEventListener('click', doSomething, false);
		dataSelector.addEventListener('click', updatePatient, false);
			
		
	});