/* JAVASCRIPT CODE GOES HERE */

Plotly.d3.csv("https://raw.githubusercontent.com/phamoh/HIV_AB_CoEvo/phamoh-patch-1/dataset_031519.csv",
    function(err, rows) {

        function unpack(rows, key) {
            return rows.map(function(row) {
                return row[key];
            });
        }

        var allPatientIDs = unpack(rows, 'patient_id'),
            allTimePoints = unpack(rows, 'time_point'),
            allABDPi = unpack(rows, 'ab_diversity_pi'),
            allHIV_div = unpack(rows, 'hiv_diversity_pi'),
            listofPatients = [],
            currentPatient,
            currentABDPi = [],
            currentHIVDPi = [],
            currentTimePoint = [];

        //This affects the dropdown menu
        for (var i = 0; i < allPatientIDs.length; i++) {
            if (listofPatients.indexOf(allPatientIDs[i]) === -1) {
                listofPatients.push(allPatientIDs[i]);
            }
        }

        //This function gets the data from the patient chosen on the dropdown
        function getPatientData(chosenPatient) {
            currentHIVDPi = [];
            currentTimePoint = [];
            for (var i = 0; i < allPatientIDs.length; i++) {
                if (allPatientIDs[i] === chosenPatient) {
                    currentHIVDPi.push(allHIV_div[i]);
                    currentABDPi.push(allABDPi[i]);
                    currentTimePoint.push(allTimePoints[i]);
                }
            }
        };

        // Default Patient 1 Data
        setBubblePlot('1');

        //
        function setBubblePlot(chosenPatient) {
            getPatientData(chosenPatient);

            var trace1 = {
                x: currentTimePoint,
                y: currentHIVDPi,
                name: 'HIV',
                mode: 'lines+markers',
                type: 'scatter',
                connectgaps: true,
                line: {
                    color: 'rgb(142, 124, 195)',
                },
                marker: {
                    size: 12,
                    opacity: 0.5,
                },

            };
            var trace2 = {
                x: currentTimePoint,
                y: currentABDPi,
                name: 'AbR',
                mode: 'lines+markers',
                type: 'scatter',
                connectgaps: true,
                line: {
                    color: 'rgb(255,127,80)',
                },
                marker: {
                    size: 12,
                    opacity: 0.5,
                },

            };

            //This function is for the layout of the plot
            var data = [trace1, trace2];
            var layout = {
                title: 'HIV + AbR Diversity of Patient ' + chosenPatient,
                titlefont: {
                    family: 'Poppins, sans-serif',
                },
                xaxis: {
                    title: 'Estimated Time Since Infection (years)',
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

            Plotly.newPlot('plotdiv3', data, layout, { showSendToCloud: true, responsive: true });
        };

        var innerContainer = document.querySelector('[data-num3="0"'),
            //plotEl = innerContainer.querySelector('.plot'),
            patientSelector = innerContainer.querySelector('.patientdata3');

        function assignOptions(textArray, selector) {
            for (var i = 0; i < textArray.length; i++) {
                var currentOption = document.createElement('option');
                currentOption.text = textArray[i];
                selector.appendChild(currentOption);
            }
        }

        assignOptions(listofPatients, patientSelector);

        function updatePatient() {
            setBubblePlot(patientSelector.value);
        }

        patientSelector.addEventListener('change', updatePatient, false);
    });