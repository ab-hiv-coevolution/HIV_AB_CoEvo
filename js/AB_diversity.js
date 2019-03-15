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
			allHIVDpi = unpack(rows, 'hiv_diversity_pi'),
			allHIVDivergenceNonsyn = unpack(rows, 'hiv_non_synonymous_divergence'),
			allHIVDivergenceSyn = unpack(rows, 'hiv_synonymous_divergence'),
			allABDivergence = unpack(rows, 'ab_divergence'),
			allABCDR = unpack(rows, 'abr_baseline_mean_sigma_CDR'),
			allABFWR = unpack(rows, 'abr_baseline_mean_sigma_FWR'),
			allHIVSelection = unpack(rows, 'hiv_selection_dN_dS'),
			listofDivergence = ["Antibody", "HIV Synonymous", "HIV Non-Synonymous", "All"], 
			listofDiversity = ["Antibody", "HIV", "Both"],
			listofSelection = ["AB CDR", "AB FWR", "HIV"],
			currentPatient,
			holdDat,
			holdPat,
			listofPatients = [],
			currentData = [],
			currentTimePoint = [];

		//This affects the dropdown menu
		for (var i = 0; i < allPatientIDs.length; i++) {
			if (listofPatients.indexOf(allPatientIDs[i]) === -1) {
				listofPatients.push(allPatientIDs[i]);
			}
		} //listofPatients.push("All Patients");

		console.log("Check1:" + holdDat);
		console.log("Check2" + holdPat);

		//This function gets the data from the patient chosen on the dropdown
		function getPatientData(chosenPatient, chosenData) {
			console.log("Check3: " + chosenData);
			holdDat = chosenData;
			holdPat = chosenPatient;
			console.log("Check4:" + holdDat);
			console.log("Check5" + holdPat);
			currentData = [];
			currentTimePoint = [];
			for (var i = 0; i < allPatientIDs.length; i++) {
				if (allPatientIDs[i] === chosenPatient) {
				currentTimePoint.push(allTimePoints[i]);
				switch (chosenData){
					case "diversityAntibody":
						currentData.push(allABDPi[i]);
						break;
					case "diversityHIV":
						currentData.push(allHIVDpi[i]);
						break;
					case "diversityBoth":
						break;
					case "divergenceAntibody":
						currentData.push(allABDivergence[i]);
						break;
					case "divergenceHIV Non-Synonymous":
						currentData.push(allHIVDivergenceNonsyn[i]);
						break;
					case "divergenceHIV Synonymous":
						currentData.push(allHIVDivergenceSyn[i]);
						break;
					case "divergenceAll":
						break;
					case "selectionAB CDR":
						currentData.push(allABCDR[i]);
						break;
					case "selectionAB FWR":
						currentData.push(allABFWR[i]);
						break;
					case "selectionHIV":
						currentData.push(allHIVSelection[i]);
						break;


				} 	

				}
			}
		};

		// Default Patient 1 Data
		setBubblePlot('1', 'diversityAntibody');

		//
		function setBubblePlot(chosenPatient, chosenData) {
			getPatientData(chosenPatient, chosenData);
			console.log('Check6:' + currentData);
			console.log('Check7:' + chosenPatient)
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
			diversitySelector = innerContainer.querySelector('.diversity');
			divergenceSelector = innerContainer.querySelector('.divergence');
			selectionSelector = innerContainer.querySelector('.selection');

		function assignOptions(textArray, selector) {
			for (var i = 0; i < textArray.length; i++) {
				var currentOption = document.createElement('option');
				currentOption.text = textArray[i];
				//document.getElementById(selector.id).insertBefore(new Option('-- Select Value --', ''), 
				//document.getElementById(selector.id).firstChild);
				selector.appendChild(currentOption);
			}
		} 
		

		assignOptions(listofPatients, patientSelector);
		assignOptions(listofDiversity, diversitySelector);
		assignOptions(listofDivergence, divergenceSelector);
		assignOptions(listofSelection, selectionSelector);
		

		function update(e) {
			if (e.target.id === 'patientnumber'){
				console.log("id Check1:" + e.target.id);
				updatePatient();
			} else if (e.target.id === 'diversity' || 'divergence' || 'selection'){
				dropOrigin = e.target.id;
				dropVal = e.target.value;
				drops = dropOrigin.concat(dropVal);
				console.log("id Check1:" + e.target.id);
				console.log("Check Drops: " + drops)
				updateData(drops);

			}
		}

		

		function updatePatient() { //try to use "target approach"

			setBubblePlot(patientSelector.value, holdDat);
		}

		function updateData(input){
			setBubblePlot(holdPat, input);
		}

		patientSelector.addEventListener('change', update, false);
		diversitySelector.addEventListener('change', update, false);
		divergenceSelector.addEventListener('change', update, false);
		selectionSelector.addEventListener('change', update, false);
	});