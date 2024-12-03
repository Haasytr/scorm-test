$('.w-form form input[type=radio]').click(function (e) {
    $('input[name="'.concat(e.target.name, '"]:not(').concat(".w-checkbox-input", ")")).map(function (e, n) {
        return $(n).siblings(".w-radio-input").removeClass("w--redirected-checked");
    });
    var n = $(e.target);
    n.hasClass("w-radio-input") || n.siblings(".w-radio-input").addClass("w--redirected-checked");
});

$('.w-form form input[type="radio"]:not(.w-radio-input)').focus(function (e) {
    $(e.target).siblings(".w-radio-input").addClass("w--redirected-focus");
});

$('.w-form form input[type="radio"]:not(.w-radio-input)').blur(function (e) {
    $(e.target).siblings(".w-radio-input").removeClass("w--redirected-focus");
});