function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

$(function() {
	var buttons = $('.button');
	var uColour = $("[id^='colour']");
	var uVolume = $("[id^='volume']");
	
	//Setup chosen.js for select fields
	$('select').chosen({
		disable_search: true,
		placeholder_text_single: "Select one",
		width: "auto"
	});
	//Since everything is tabbed, accept
	//enter/return key for buttons
	buttons.keypress(function (e) {
		if (e.which == 13) {
			$(this).click();
		}
	});
	//Check to see if amounts are entered.
	//If so, move the units
	uVolume.on('input paste blur', function() {
		var thisSuffix = $(this).closest('.unit-container').children('.unit-suffix');
		var thisVal = $(this).val();
		var textWidth = getTextWidth(thisVal, "13px 'Noto Sans JP'" );
		thisSuffix.css('left', textWidth + 'px');
	});
	uVolume.on('blur', function() {
		var thisSuffix = $(this).closest('.unit-container').children('.unit-suffix');
		var thisVal = $(this).val();
		if ( !thisVal ) {
			$(this).val(0);
			thisVal = 0;
		}
		var textWidth = getTextWidth(thisVal, "13px 'Noto Sans JP'" );
		thisSuffix.css('left', textWidth + 'px');
	});
	//If "Other Colour" is selected,
	//show field, otherwise hide
	uColour.on('change', function() {
		var accNumber = $(this).attr('id').replace('colour-','');
		var otherColour = $('#other-colour-' + accNumber);
		var otherColourLabel = $('label[for="other-colour-' + accNumber + '"]');
		if ( $(this).val() === "Other" ) {
			otherColour.slideToggle(300);
			otherColourLabel.slideToggle(300);
		} else if ( otherColour.is(':visible') ) {
			otherColour.slideToggle(300);
			otherColourLabel.slideToggle(300);
		}
	});
});