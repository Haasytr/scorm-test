var i = 0, prec;
// var degs = $("#prec").attr("class").split(' ')[1];
// var activeBorder = $("#activeBorder");

// setTimeout(function(){
//     if($("#circle").is(":hover"))
//        loopit("c");
//     else
//        loopit("nc");
// },1);


// function loopit(border, clockwiseDir, minDegress = 0, maxDegrees = 360) {
//     if (clockwiseDir)
//         i++
//     else
//         i--;

//     if (i < minDegress)
//         i = 0;
//     if (i > maxDegrees)
//         i = maxDegrees;

//     prec = (100 * i) / 360;
//     $(".prec").html(Math.round(prec) + "%");

//     if (i <= 180) {
//         border.css('background-image', 'linear-gradient(' + (90 + i) + 'deg, transparent 50%, #A2ECFB 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)');
//     }
//     else {
//         border.css('background-image', 'linear-gradient(' + (i - 90) + 'deg, transparent 50%, #39B4CC 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)');
//     }

//     setTimeout(function () {
//         if ($("#circle").is(":hover"))
//             loopit("c");
//         else
//             loopit("nc");
//     }, 1);

// }

/**
 * 
 * @param {HTMLElement} border What will be affect via css
 * @param {Number} percentage Total percentage to set
 * @param {Number} minDegress Start at value (Radians)
 * @param {Number} maxDegrees End on value (Radians)
 */
function setFillPercentage(border, percentage, minDegress = 0, maxDegrees = 360) {
    var degress = percentage * 360;
    if (percentage < minDegress)
        percentage = minDegress;
    else if (percentage > maxDegrees)
        percentage = maxDegrees;

    if (percentage <= 50) {
        border.css('background-image', 'linear-gradient(' + (90 + degress) + 'deg, transparent 50%, #A2ECFB 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)');
    }
    else {
        border.css('background-image', 'linear-gradient(' + (degress - 90) + 'deg, transparent 50%, #39B4CC 50%),linear-gradient(90deg, #A2ECFB 50%, transparent 50%)');
    }
}