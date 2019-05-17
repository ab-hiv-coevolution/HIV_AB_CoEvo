// Code goes here
$(document).ready(function() {
    jQuery(".tabs").tabs();
    jQuery(".subtabs").tabs();

    openParentTab();
});



function openParentTab() {
    locationHash = location.hash.substring(1);
    console.log(locationHash);
    // Check if we have an location Hash
    if (locationHash) {
        // Check if the location hash exsist.
        var hash = jQuery('#' + locationHash);
        if (hash.length) {
            // Check of the location Hash is inside a tab.
            if (hash.closest(".tabContent").length) {
                // Grab the index number of the parent tab so we can activate it
                var tabNumber = hash.closest(".tabContent").index();
                jQuery(".tabs.fix").tabs({ active: tabNumber });
                // Not need but this puts the focus on the selected hash
                hash.get(0).scrollIntoView();
                setTimeout(function() {
                    hash.get(0).scrollIntoView();
                }, 1000);
            }
        }
    }
}