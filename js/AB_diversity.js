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
			all_AB_diverg = unpack(rows, 'ab_divergence'),
			all_AB_CDR = unpack(rows, 'abr_baseline_mean_sigma_CDR'),
			all_AB_FWR = unpack(rows, 'abr_baseline_mean_sigma_FWR'),
			allHIV_div = unpack(rows, 'hiv_diversity_pi'),
			listofPatients = [],
			//listofDataViz = ["Antibody Diversity", "HIV Diversity"],
			currentPatient,
			currentTimePoint = [],
			currentABDPi = [],
			current_AB_diverg = [],
			current_AB_FWR = [],
			current_AB_CDR = [],
			currentHIVPi = [];
			button_layer_2_height = 1.2

		//This affects the dropdown menu
		for (var i = 0; i < allPatientIDs.length; i++) {
			if (listofPatients.indexOf(allPatientIDs[i]) === -1) {
				listofPatients.push(allPatientIDs[i]);
			}
		}



		//This function gets the data from the patient chosen on the dropdown
		function getPatientData(chosenPatient) {
			currentABDPi = [];
			currentTimePoint = [];
			current_AB_diverg = [];
			current_AB_FWR = [];
			current_AB_CDR = [];
			for (var i = 0; i < allPatientIDs.length; i++) {
				if (allPatientIDs[i] === chosenPatient) {
					currentABDPi.push(allABDPi[i]);
					currentTimePoint.push(allTimePoints[i]);
					current_AB_diverg.push(all_AB_diverg[i]);
					current_AB_FWR.push(all_AB_FWR[i]);
					current_AB_CDR.push(all_AB_CDR[i]);
				}
			}
			console.log(current_AB_CDR);
		};

		// Default Patient 1 Data
		setBubblePlot('1', 'Antibody Diversity');

		//
		function setBubblePlot(chosenPatient) {
			getPatientData(chosenPatient);
		
				/*var trace1 = {
					x: currentTimePoint,
					y: currentABDPi,
					mode: 'lines+markers',
					type: 'scatter',
					connectgaps: true,
					marker: {
						size: 12,
						opacity: 0.5
					}
				}*/

				var data = [{
    				x: currentTimePoint,
				    y: currentABDPi,
				    mode: 'lines',
				    name: 'Antibody Diversity',
				    marker: {color: '#33CFA5'}
				  },
				  {
				    x: currentTimePoint,
				    y: current_AB_diverg,
				    mode: 'lines',
				    name: 'Antibody Divergence',
				    line: {color: '#33CFA5', dash: 'dash'},
				    visible: false
				  },
				  {
				    x: currentTimePoint,
				    y: current_AB_CDR,
				    name: 'Antibody CDR',
				    mode: 'lines',
				    marker: {color: '#F06A6A'},
				    visible: false
				  },
				  {
				    x: currentTimePoint,
				    y: current_AB_FWR,
				    mode: 'lines',
				    name: 'Antibody FWR',
				    visible: false,
				    line: {color: '#F06A6A', dash: 'dash'}
				  },

				]

				var updatemenus=[{
		        
		        buttons: [
		            {
		                args: [{'visible': [true, false, false, false]},
		                       {'title': 'Antibody Diversity'}],
		                label: 'Antibody Diversity',
		                method: 'update'
		            },
		            {
		                args: [{'visible': [false, true, false, false,]},
		                       {'title': 'Antibody Divergence'}],
		                label: 'Antibody Divergence',
		                method: 'update'
		            },
		            {
		                args: [{'visible': [false, false, true, false,]},
		                       {'title': 'Antibody CDR'}],
		                label: 'Antibody CDR',
		                method: 'update'
		            },
		            {
		                args: [{'visible': [false, false, false, true,]},
		                       {'title': 'Antibody FWR '}],
		                label: 'Antibody FWR',
		                method: 'update'
		            },

		        ],
		        direction: 'left',
		        pad: {'r': 10, 't': 10},
		        showactive: true,
		        type: 'buttons',
		        x: 0.1,
		        xanchor: 'left',
		        y: button_layer_2_height,
		        yanchor: 'top'
		    },

		]


		


			//This function is for the layout of the plot
			//var data = [trace1];
			var layout = {
				title: ' Patient ' + chosenPatient,
				updatemenus: updatemenus,
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
			//dataSelector = innerContainer.querySelector('.datatype');

		function assignOptions(textArray, selector) {
			for (var i = 0; i < textArray.length; i++) {
				var currentOption = document.createElement('option');
				currentOption.text = textArray[i];
				selector.appendChild(currentOption);
			}
		}

		assignOptions(listofPatients, patientSelector);
		//assignOptions(listofDataViz, dataSelector);
		
		//console.log(listofPatients);
		//console.log(dataSelector.value);



		function updatePatient() {
			setBubblePlot(patientSelector.value); //, dataSelector.value);
		}

		patientSelector.addEventListener('change', updatePatient, false);
		//dataSelector.addEventListener('change', updatePatient, false);
	});