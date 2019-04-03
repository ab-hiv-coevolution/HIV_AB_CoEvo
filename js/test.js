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
            allHIVDivergenceNonsyn = unpack(rows, 'hiv_non_synonymous_divergence'),
            allHIVDivergenceSyn = unpack(rows, 'hiv_synonymous_divergence'),
            allABDivergence = unpack(rows, 'ab_divergence'),
            allABCDR = unpack(rows, 'abr_baseline_mean_sigma_CDR'),
            allABFWR = unpack(rows, 'abr_baseline_mean_sigma_FWR'),
            allHIVSelection = unpack(rows, 'hiv_selection_dN_dS'),
            currentPatient,
            listofPatients = [],
            plusALL = [],
            currentABDPi = [],
            currentHIVPi = [],
            currentHIVDPi = [],
            currentTimePoint = [];


        // These variables are the ids in the html page
        //Dropdown1: HIV Diversity
        var innerContainer1 = document.querySelector('[data-num1="0"]'),
            patientSelector1 = innerContainer1.querySelector('.patientdata1'),
            //Dropdown2: AB Diversity
            innerContainer2 = document.querySelector('[data-num2="0"]'),
            patientSelector2 = innerContainer2.querySelector('.patientdata2'),
            //Dropdown3: HIV+Ab Diversity
            innerContainer3 = document.querySelector('[data-num3="0"]'),
            patientSelector3 = innerContainer3.querySelector('.patientdata3');

        //This affects the dropdown menu, makes an array listofPatients
        for (var i = 4; i < allPatientIDs.length; i++) {
            if (listofPatients.indexOf(allPatientIDs[i]) === -1) {
                listofPatients.push(allPatientIDs[i]);
            } else if (plusALL.indexOf(allPatientIDs[i]) === -1) {
                plusALL.push(allPatientIDs[i]);
            }
        }
        //This all add the option "All Patients to the dropdown in the textArray"
        plusALL.push("All Patients");

        // This function populates the info to the dropdowns.
        function assignOptions(textArray, selector) {
            for (var i = 0; i < textArray.length; i++) {
                var currentOption = document.createElement('option');
                currentOption.text = textArray[i];
                selector.appendChild(currentOption);
            }
        };

        assignOptions(plusALL, patientSelector1);
        assignOptions(plusALL, patientSelector2);
        assignOptions(listofPatients, patientSelector3);


        function updatePatientHIV() {
            setBubblePlot(patientSelector1.value);
        }

        function updatePatientAbR() {
            setBubblePlot(patientSelector2.value);
        }

        function updatePatientboth() {
            setBubblePlot(patientSelector3.value);
        }

        patientSelector1.addEventListener('change', updatePatientHIV, false);
        patientSelector2.addEventListener('change', updatePatientAbR, false);
        patientSelector3.addEventListener('change', updatePatientboth, false);

        var trace1 = [];
        var trace2 = [];

        function getPatientData(selector, chosenPatient) {
            currentTimePoint = [];
            currentABDPi = [];
            currentHIVPi = [];
            trace1 = [];
            chosenData = [];

            for (var i = 0; i < allPatientIDs.length; i++) {
                chosenData = "HIV Diversity";
                if (chosenPatient === 'All Patients') {
                    trace1 = {
                        type: 'scatter',
                        mode: 'lines+markers',
                        x: allTimePoints,
                        y: allHIV_div,
                        connectgaps: true,
                        text: allPatientIDs,
                        transforms: [{
                            type: 'groupby',
                            groups: allPatientIDs,
                        }]
                    }
                } else if (allPatientIDs[i] === chosenPatient) {
                    currentHIVPi.push(allHIV_div[i]);
                    currentTimePoint.push(allTimePoints[i]);
                    trace1 = {
                        x: currentTimePoint,
                        y: currentHIVPi,
                        mode: 'lines+markers',
                        type: 'scatter',
                        connectgaps: true,
                        line: {
                            color: 'rgb(142, 124, 195)',
                        },
                        marker: {
                            size: 12,
                            opacity: 0.5
                        },
                    }
                }

            }
        };


        setBubblePlot("1", " ");

        function setBubblePlot(chosenPatient) {
            getPatientData(chosenPatient);
            var data = [trace1];
            var layout = {
                title: chosenData + ' of Patient ' + chosenPatient,
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


            Plotly.newPlot('plotdiv1', data, layout, { showSendToCloud: true, responsive: true });


        }



    });