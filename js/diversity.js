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
            allCD4Count = unpack(rows, 'CD4_count'),
            allViralLoad = unpack(rows, 'viral_load'),
            alldiversityAntibody = unpack(rows, 'ab_diversity_pi'),
            alldiversityHIV = unpack(rows, 'hiv_diversity_pi'),
            alldivergenceHIVNonSynonymous = unpack(rows, 'hiv_non_synonymous_divergence'),
            alldivergenceHIVSynonymous = unpack(rows, 'hiv_synonymous_divergence'),
            alldivergenceAntibody = unpack(rows, 'ab_divergence'),
            allselectionABCDR = unpack(rows, 'abr_baseline_mean_sigma_CDR'),
            allselectionABFWR = unpack(rows, 'abr_baseline_mean_sigma_FWR'),
            allselectionHIV = unpack(rows, 'hiv_selection_dN_dS'),
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
        listofPatients.push("All Patients")





        //This function gets the data from the patient chosen on the dropdown (original function)
        /*
                        function getPatientData(chosenPatient) {
                            currentABDPi = [];
                            currentTimePoint = [];
                            for (var i = 0; i < allPatientIDs.length; i++) {
                                if (allPatientIDs[i] === chosenPatient) {
                                    currentABDPi.push(allABDPi[i]);
                                    currentTimePoint.push(allTimePoints[i]);
                                }
                            }
                        };
            
                */


        var trace1 = [];

        function getPatientData(chosenPatient, chosenData) {

            currentData = [];
            currentTimePoint = [];
            trace1 = [];
            for (var i = 0; i < allPatientIDs.length; i++) {
                if (chosenPatient === 'All Patients') {
                    trace1 = {
                        type: 'scatter',
                        mode: 'lines+markers',
                        x: allTimePoints,
                        y: alldiversityHIV,
                        connectgaps: true,
                        text: allPatientIDs,
                        transforms: [{
                            type: 'groupby',
                            groups: allPatientIDs,
                        }]
                    }
                } else if (allPatientIDs[i] === chosenPatient) {
                    currentTimePoint.push(allTimePoints[i]);
                    console.log(chosenData);
                    console.log(chosenPatient);
                    switch (chosenData) {
                        case "HIV_Diversity":
                            currentData.push(alldiversityHIV[i]);
                            break;
                        case "Antibody_Diversity":
                            currentData.push(alldiversityAntibody[i]);
                            break;
                        case "Both_Diversity":
                            break;
                        case "HIV_Non_Syn":
                            currentData.push(alldivergenceHIVNonSynonymous[i]);
                            break;
                        case "HIV_Syn":
                            currentData.push(alldivergenceHIVSynonymous[i]);
                            break;
                        case "Antibody_Divergence":
                            currentData.push(alldivergenceAntibody[i]);
                            break;
                        case "HIV_Selection":
                            currentData.push(allselectionHIV[i]);
                            break;
                        case "selectionABCDR":
                            currentData.push(allselectionABCDR[i]);
                            break;
                        case "selectionABFWR":
                            currentData.push(allselectionABFWR[i]);
                            break;
                        case "CD4_Count":
                            currentData.push(allCD4Count[i]);
                            break;
                        case "Viral_Load":
                            currentData.push(allViralLoad[i]);
                            break;

                    }
                    console.log(currentData);
                    trace1 = {
                        x: currentTimePoint,
                        y: currentData,
                        mode: 'lines+markers',
                        type: 'scatter',
                        connectgaps: true,
                        line: {
                            color: 'rgb(255,127,80)',
                        },
                        marker: {
                            size: 12,
                            opacity: 0.5
                        },
                    }
                }
            }

        };

        //setBubblePlot("1", "HIV_Diversity");

        function setBubblePlot(chosenPatient, chosenData) {

            getPatientData(chosenPatient, chosenData);

            var data = [trace1],
                plotdiv = chosenData.concat("div");


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

            Plotly.newPlot(plotdiv, data, layout, { showSendToCloud: true, responsive: true });
        };

        var buttons = document.querySelectorAll('.tablinks');
        //console.log(buttons);
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', openStatistic, false);
        }

        function openStatistic(evt) {
            var i, tabcontent, tablinks, statName, dataVal;
            tabcontent = document.getElementsByClassName("tabcontent ");
            console.log(tabcontent);
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks ");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active ", " ");
            }
            statName = evt.currentTarget.name;
            document.getElementById(statName).style.display = "block";
            evt.currentTarget.className += "active ";
            //graphData = document.getElementById(statName);
            //console.log(statName);
            setBubblePlot('1', statName)
            holdDat = statName;
        }

        function assignOptions(textArray, selector) {
            for (var i = 0; i < textArray.length; i++) {
                var currentOption = document.createElement('option');
                currentOption.text = textArray[i];
                selector.add(currentOption);
            }
        };

        // These variables are the ids in the html page
        //Dropdown1: HIV Diversity
        var innerContainer1 = document.querySelector('[data-num1="0"]'),
            patientSelector1 = innerContainer1.querySelector('.patientdata1'),
            //Dropdown2: AB Diversity
            innerContainer2 = document.querySelector('[data-num2="0"]'),
            patientSelector2 = innerContainer2.querySelector('.patientdata2'),
            //Dropdown3: HIV+Ab Diversity
            innerContainer3 = document.querySelector('[data-num3="0"]'),
            patientSelector3 = innerContainer3.querySelector('.patientdata3'),
            //Dropdown4: HIV nonsyn Divergence
            innerContainer4 = document.querySelector('[data-num4="0"]'),
            patientSelector4 = innerContainer4.querySelector('.patientdata4'),
            //Dropdown5: HIV syn Divergence
            innerContainer5 = document.querySelector('[data-num5="0"]'),
            patientSelector5 = innerContainer5.querySelector('.patientdata5'),
            //Dropdown6: Antibody Divergence
            innerContainer6 = document.querySelector('[data-num6="0"]'),
            patientSelector6 = innerContainer6.querySelector('.patientdata6'),
            //Dropdown7: HIV Selection
            innerContainer7 = document.querySelector('[data-num7="0"]'),
            patientSelector7 = innerContainer7.querySelector('.patientdata7'),
            //Dropdown8: Antibody Selection
            innerContainer8 = document.querySelector('[data-num8="0"]'),
            patientSelector8 = innerContainer8.querySelector('.patientdata8'),
            //Dropdown9: CD4 Count
            innerContainer9 = document.querySelector('[data-num9="0"]'),
            patientSelector9 = innerContainer9.querySelector('.patientdata9'),
            //Dropdown10: Viral Load
            innerContainer10 = document.querySelector('[data-num10="0"]'),
            patientSelector10 = innerContainer10.querySelector('.patientdata10');

        assignOptions(listofPatients, patientSelector1);
        assignOptions(listofPatients, patientSelector2);
        assignOptions(listofPatients, patientSelector3);
        assignOptions(listofPatients, patientSelector4);
        assignOptions(listofPatients, patientSelector5);
        assignOptions(listofPatients, patientSelector6);
        assignOptions(listofPatients, patientSelector7);
        assignOptions(listofPatients, patientSelector8);
        assignOptions(listofPatients, patientSelector9);
        assignOptions(listofPatients, patientSelector10);

        function updateData(e, dataVal) {
            //console.log(e.id);
            setBubblePlot('1', dataVal)
                //console.log(dataVal);
        }

        function updatePatient() {
            setBubblePlot(patientSelector + '[]'.value, holdDat);
            //console.log(holdDat);
        }


        patientSelector.addEventListener('change', updatePatient, false);

    });