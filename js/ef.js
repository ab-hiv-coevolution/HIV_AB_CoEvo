/* JAVASCRIPT CODE GOES HERE */

Plotly.d3.csv("https://raw.githubusercontent.com/phamoh/HIV_AB_CoEvo/phamoh-patch-1/antibodyHIVdata.csv",
    function(err, rows) {

        function unpack(rows, key) {
            return rows.map(function(row) {
                return row[key];
            });
        }

        var allPatientIDs = unpack(rows, 'patient_id'),
            allTimePoints = unpack(rows, 'time_point'),
            alldiversityAntibody = unpack(rows, 'ab_diversity_pi'),
            alldiversityHIV = unpack(rows, 'hiv_diversity_pi'),
            alldivergenceHIVNonSynonymous = unpack(rows, 'hiv_non_synonymous_divergence'),
            alldivergenceHIVSynonymous = unpack(rows, 'hiv_synonymous_divergence'),
            alldivergenceAntibody = unpack(rows, 'ab_divergence'),
            allselectionABCDR = unpack(rows, 'abr_baseline_mean_sigma_CDR'),
            allselectionABFWR = unpack(rows, 'abr_baseline_mean_sigma_FWR'),
            allselectionHIV = unpack(rows, 'hiv_selection_dN_dS'),
            listofDivergence = ["Antibody", "HIV Synonymous", "HIV Non-Synonymous", "All"],
            listofDiversity = ["Antibody", "HIV", "Both"],
            listofSelection = ["AB CDR", "AB FWR", "HIV"],
            currentPatient,
            holdDat,
            holdPat,
            holdAllDat = [],
            listofPatients = [],
            currentData = [],
            currentTimePoint = [];

        //This affects the dropdown menu
        for (var i = 0; i < allPatientIDs.length; i++) {
            if (listofPatients.indexOf(allPatientIDs[i]) === -1) {
                listofPatients.push(allPatientIDs[i]);
            }
        }
        listofPatients.push("All Patients");

        console.log("Check1:" + holdDat);
        //console.log("Check2" + holdPat);

        //This function gets the data from the patient chosen on the dropdown
        function getPatientData(chosenPatient, chosenData) {
            //console.log("Check3: " + chosenData);
            holdDat = chosenData;
            holdPat = chosenPatient;
            console.log("Check4:" + holdDat);
            //console.log("Check5" + holdPat);
            currentData = [];
            currentTimePoint = [];
            for (var i = 0; i < allPatientIDs.length; i++) {
                if (allPatientIDs[i] === chosenPatient) {
                    currentTimePoint.push(allTimePoints[i]);
                    switch (chosenData) {
                        case "diversityAntibody":
                            currentData.push(alldiversityAntibody[i]);
                            break;
                        case "diversityHIV":
                            currentData.push(alldiversityHIV[i]);
                            break;
                        case "diversityBoth":
                            break;
                        case "divergenceAntibody":
                            currentData.push(alldivergenceAntibody[i]);
                            break;
                        case "divergenceHIVNonSynonymous":
                            currentData.push(alldivergenceHIVNonSynonymous[i]);
                            break;
                        case "divergenceHIVSynonymous":
                            currentData.push(alldivergenceHIVSynonymous[i]);
                            break;
                        case "divergenceAll":
                            break;
                        case "selectionABCDR":
                            currentData.push(allselectionABCDR[i]);
                            break;
                        case "selectionABFWR":
                            currentData.push(allselectionABFWR[i]);
                            break;
                        case "selectionHIV":
                            currentData.push(allselectionHIV[i]);
                            break;


                    }

                }
            }
        };

        // Default Patient 1 Data
        setBubblePlot('1', 'diversityAntibody');



        function setBubblePlot(chosenPatient, chosenData) {
            getPatientData(chosenPatient, chosenData);
            //console.log('Check6:' + currentData);
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
            patientSelector = innerContainer.querySelector('.patientnumber');
        diversitySelector = innerContainer.querySelector('.diversity');
        divergenceSelector = innerContainer.querySelector('.divergence');
        selectionSelector = innerContainer.querySelector('.selection');


        // Sets options for dropdown selection including null values for the data lists

        function assignDatOptions(textArray, selector) {
            document.getElementById(selector.id).insertBefore(new Option('- Select Value -', ''),
                document.getElementById(selector.id).firstChild);
            for (var i = 0; i < textArray.length; i++) {
                var currentOption = document.createElement('option');
                currentOption.text = textArray[i];
                selector.appendChild(currentOption);
            }
        }


        // Sets options to select for the patient list.
        function assignOptions(textArray, selector) {
            for (var i = 0; i < textArray.length; i++) {
                var currentOption = document.createElement('option');
                currentOption.text = textArray[i];
                selector.appendChild(currentOption);
            }
        }


        assignOptions(listofPatients, patientSelector);
        assignDatOptions(listofDiversity, diversitySelector);
        assignDatOptions(listofDivergence, divergenceSelector);
        assignDatOptions(listofSelection, selectionSelector);

        function between(x, min, max) {
            if (min <= x <= max) { return true };
        };


        function updates(e) {
            if (e.target.id === 'patientnumber' && e.target.value === 'All Patients') {
                console.log("id Check1:" + holdDat);
                var all = "all";
                alldrops = all.concat(holdDat);
                alldrops.replace(/-|\s/g, '');
                console.log("Check alldrops:" + alldrops);
                updateGraph(alldrops);
            } else if (e.target.id === 'patientnumber') {
                updatePatient();

            } else if (e.target.id === 'diversity' || 'divergence' || 'selection') {
                dropOrigin = e.target.id;
                dropVal = e.target.value;
                drops = dropOrigin.concat(dropVal.replace(/-|\s/g, ''));
                //console.log("id Check1:" + e.target.id);
                console.log("Check Drops: " + drops)
                updateData(drops);

            }
        };



        function updatePatient() { //try to use "target approach"

            setBubblePlot(patientSelector.value, holdDat);
        }

        function updateData(input) {
            setBubblePlot(holdPat, input);
        }

        function getAllDat(input) {
            holdAllDat = [];
            switch (input) {
                case "alldiversityAntibody":
                    holdAllDat = alldiversityAntibody;
                    break;
                case "alldiversityHIV":
                    holdAllDat.push(alldiversityHIV);
                    break;
                case "alldiversityBoth":
                    break;
                case "alldivergenceAntibody":
                    holdAllDat.push(alldivergenceAntibody);
                    break;
                case "alldivergenceHIVNonSynonymous":
                    holdAllDat.push(alldivergenceHIVNonSynonymous);
                    break;
                case "alldivergenceHIVSynonymous":
                    holdAllDat.push(alldivergenceHIVSynonymous);
                    break;
                case "alldivergenceAll":
                    break;
                case "allselectionABCDR":
                    holdAllDat.push(allselectionABCDR);
                    break;
                case "allselectionABFWR":
                    holdAllDat.push(allselectionABFWR);
                    break;
                case "allselectionHIV":
                    holdAllDat.push(allselectionHIV);
                    break;
            }
            console.log("Check Hold1: " + holdAllDat)
                //return holdAllDat;
        }

        function updateGraph(input) {
            console.log("Check Graph: " + input);
            getAllDat(input);
            console.log("Check Hold: " + allPatientIDs);
            var allPatientUpdate = {
                type: 'scatter',
                mode: 'lines+markers',
                x: allTimePoints,
                y: holdAllDat,
                text: allPatientIDs,
                transforms: [{
                    type: 'groupby',
                    groups: allPatientIDs,
                }]
            }
            Plotly.newPlot(plotdiv, allPatientUpdate);

        }


        patientSelector.addEventListener('change', updates, false);
        diversitySelector.addEventListener('change', updates, false);
        divergenceSelector.addEventListener('change', updates, false);
        selectionSelector.addEventListener('change', updates, false);
    });