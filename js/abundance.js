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
        //Dropdown9: CD4 count
        var innerContainer9 = document.querySelector('[data-num9="0"]'),
            patientSelector9 = innerContainer9.querySelector('.patientdata9'),
            //Dropdown10: Viral Load
            innerContainer10 = document.querySelector('[data-num10="0"]'),
            patientSelector10 = innerContainer10.querySelector('.patientdata10');


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

        assignOptions(plusALL, patientSelector9);
        assignOptions(plusALL, patientSelector10);



        patientSelector9.addEventListener('change', updatePatient, false);
        patientSelector10.addEventListener('change', updatePatient, false);

        var trace1 = [];
        var trace2 = [];



    });