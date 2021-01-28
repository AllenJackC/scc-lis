function getTextWidth(text, font) {
	// re-use canvas object for better performance
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	var context = canvas.getContext("2d");
	context.font = font;
	var metrics = context.measureText(text);
	return metrics.width;
}
//Set current date/time
function curDate() {
    var
      date = new Date(),
      ten = function (i) {
        return (i < 10 ? '0' : '') + i;
      },
      YYYY = date.getFullYear(),
      MM = ten(date.getMonth() + 1),
      DD = ten(date.getDate()),
      HH = ten(date.getHours()),
      II = ten(date.getMinutes()),
      SS = ten(date.getSeconds())
    ;
    return YYYY + '-' + MM + '-' + DD + 'T' +
             HH + ':' + II + ':' + SS;
}

//Setup chosen.js for select fields
function chosenSelects() {
	$('select').chosen({
		disable_search: true,
		placeholder_text_single: "Select one",
		width: "auto"
	});
}
//Move units based on value and suffix
function moveUnits(val, suffix) {
	var textWidth = getTextWidth(val, "13px 'Noto Sans JP'");
	suffix.css('left', textWidth + 'px');
}
//Show "Other Colour" field based on value
function showOtherColour(accessionNumber) {
	var otherColour = $('#other-colour-' + accessionNumber);
	var otherColourLabel = $('[for="other-colour-' + accessionNumber + '"]');
	if ($("[id^='colour']").val() === "Other") {
		otherColour.slideToggle(300);
		otherColourLabel.slideToggle(300);
	}
	else if (otherColour.is(':visible')) {
		otherColour.slideToggle(300);
		otherColourLabel.slideToggle(300);
		otherColour.val('');
	}
}
//Autosave field data
function saveData(base, recordID, accessionNumber) {
	base('Tests').update([
		{
			"id": recordID,
			"fields": {
				"Appearance": $('#appearance-' + accessionNumber).val(),
				"Colour": $('#colour-' + accessionNumber).val(),
				"Other Colour": $('#other-colour-' + accessionNumber).val(),
				"Specific Gravity (Refractometer)": $('#sg-refract-' + accessionNumber).val(),
				"Total Volume": $('#volume-' + accessionNumber).val(),
				"Microscope Required": $('#microscope-req-' + accessionNumber + ' .option.active').text(),
				"Comments": $('#comments-urinalysis-' + accessionNumber).val(),
				"Performed By": $('#name-urinalysis-' + accessionNumber).val(),
				"Date/Time": $('#date-urinalysis-' + accessionNumber).val(),
				"Glucose": $('#glucose-' + accessionNumber).val(),
				"Bilirubin": $('#bilirubin-' + accessionNumber).val(),
				"Ketones": $('#ketones-' + accessionNumber).val(),
				"Specific Gravity": $('#sg-' + accessionNumber).val(),
				"Blood": $('#blood-' + accessionNumber).val(),
				"pH": $('#ph-' + accessionNumber).val(),
				"Protein": $('#protein-' + accessionNumber).val(),
				"Urobilinogen": $('#urobilinogen-' + accessionNumber).val(),
				"Nitrite": $('#nitrite-' + accessionNumber + ' .option.active').text(),
				"Leukocytes": $('#leukocytes-' + accessionNumber).val(),
				"Total Sediment Volume": $('#sed-volume-' + accessionNumber).val(),
				"WBC": $('#wbc-' + accessionNumber).val(),
				"RBC": $('#rbc-' + accessionNumber).val(),
				"Fat Bodies": $('#fat-bodies-' + accessionNumber).val(),
				"Squamous Epithelial Cells": $('#epithelial-cells-' + accessionNumber).val(),
				"Transitional Cells": $('#transitional-cells-' + accessionNumber).val(),
				"Renal Tubule Cells": $('#renal-tubule-cells-' + accessionNumber).val(),
				"Granular Casts": $('#granular-casts-' + accessionNumber).val(),
				"Hyaline Casts": $('#hyaline-casts-' + accessionNumber).val(),
				"RBC Cast": $('#rbc-cast-' + accessionNumber).val(),
				"WBC Cast": $('#wbc-cast-' + accessionNumber).val(),
				"Waxy Cast": $('#waxy-cast-' + accessionNumber).val(),
				"Oxalate": $('#oxalate-' + accessionNumber).val(),
				"Phosphate": $('#phosphate-' + accessionNumber).val(),
				"Uric Acid": $('#uric-acid-' + accessionNumber).val(),
				"Urate": $('#urate-' + accessionNumber).val(),
				"Trichomonas": $('#trichomonas-' + accessionNumber).val(),
				"Bacteria Present": $('#bacteria-' + accessionNumber + ' .option.active').text(),
				"Mucous Present": $('#mucous-' + accessionNumber + ' .option.active').text(),
				"Other": $('#other-microscopic-' + accessionNumber).val()
			}
		}
	], function(err) {
		if (err) {
			console.error(err);
			return;
		}
	});
}
//Lock certain portions of the accession
//record depending on Release
function releaseData(base,accessionNumber,releaseSections,releaseType) {
	$('select, input, textarea', releaseSections).prop('disabled', true);
	$('select', releaseSections).trigger('chosen:updated');
	$('.button', releaseSections).addClass('disabled');
	base('Tests').select({
		view: 'Grid view',
		filterByFormula: "{Accession Number} = '" + accessionNumber + "'"
	}).eachPage(function page(records, fetchNextPage) {
		records.forEach(function(record) {
			testID = record.id;
		});
		fetchNextPage();
	}, function done(err) {
		if (err) {
			console.error(err);
			return;
		}
		base('Tests').update([
		{
			"id": testID,
			"fields": {
				"Released": releaseType
			}
		}
		], function(err) {
			if (err) {
				console.error(err);
				return;
			}
		});
	});
}
$(function() {
	var patientWindow = $('#patient');
	var loadOverlay = $('#loading-overlay');
	var buttons = $('.button');
	var retrieveButton = $('#retrieve');
	var accessionNumber;
	var saveInterval;
	//Setup Airtable for patient information
	var Airtable = require('airtable');
	Airtable.configure({
		endpointUrl: 'https://api.airtable.com',
		apiKey: 'keymlfH0gK5O3u0wp'
	});
	var base = Airtable.base('app9VJDA4BqMl4REP');
	//Setup chosen.js for select fields
	chosenSelects();
	//Since everything is tabbed, accept
	//enter/return key for buttons
	$('#main').on('keypress', '.button', function(e) {
		if (e.which == 13) {
			$(this).click();
		}
	});
	//Allow enter/return key to retrieve
	//accession number
	$('#accession').keypress(function(e) {
		if (e.which == 13) {
			retrieveButton.click();
		}
	});
	//Check to see if amounts are entered.
	//If so, move the units
	$('#main').on('input paste blur', "[id^='volume'],[id^='sed-volume']", function() {
		var thisSuffix = $(this).closest('.unit-container').children('.unit-suffix');
		var thisVal = $(this).val();
		moveUnits(thisVal, thisSuffix)
	});
	$('#main').on('blur', "[id^='volume'],[id^='sed-volume']", function() {
		var thisSuffix = $(this).closest('.unit-container').children('.unit-suffix');
		var thisVal = $(this).val();
		if (!thisVal) {
			$(this).val(0);
			thisVal = 0;
		}
		moveUnits(thisVal, thisSuffix);
	});
	//If "Other Colour" is selected,
	//show field, otherwise hide
	$('#main').on('change', "[id^='colour']", function() {
		showOtherColour(accessionNumber);
	});
	//Toggle active class when option
	//button is clicked
	$('#main').on('click', '.option.button', function() {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		}
		else {
			var otherOption = $(this).closest('.option-buttons').children('.active');
			if (otherOption) otherOption.removeClass('active');
			$(this).addClass('active');
		}
	});
	//When Release button is clicked,
	//disable sections and close record
	//as appropriate
	$('#main').on('click', '.release .button', function() {
		var confirmRelease = confirm("Are you sure you want to release this information?\n\nPress OK to proceed, or Cancel to return.\n\nNOTE: This action cannot be undone!");
		var thisAccession = $(this).closest('.window');
		var partialRelease = $('.column.general, .column.chemical', thisAccession);
		var fullRelease = $('.column', thisAccession);
		loadOverlay.css('display', 'flex');
		if (confirmRelease) {
			if ($(this).attr('id').startsWith('release')) {
				releaseData(base,accessionNumber,partialRelease,"Partial")
				$(this).addClass('disabled');
				loadOverlay.removeAttr('style');
			} else if ($(this).attr('id').startsWith('full-release')) {
				releaseData(base,accessionNumber,fullRelease,"Full")
				clearInterval(saveInterval);
				thisAccession.remove();
				alert('Accession #' + accessionNumber + ' successfully released!');
				loadOverlay.removeAttr('style');
			}
		}
	});
	//When Retrieve button is clicked,
	//search for the accession number
	//and show patient ID card and
	//populate accession number buttons
	retrieveButton.click(function() {
		var recordID;
		var patientID;
		var testID;
		var testsList = [];
		loadOverlay.css('display', 'flex');
		$('.window.test').slideToggle(500, function() {
			$('.window.test').remove();
		});
		accessionNumber = $('#accession').val();
		base('Tests').select({
			view: "Grid view",
			filterByFormula: "{Accession Number} = '" + accessionNumber + "'"
		}).eachPage(function page(records, fetchNextPage) {
			records.forEach(function(record) {
				recordID = record.id;
				patientID = record.get('ID Number');
			});
			fetchNextPage();
		}, function done(err) {
			if (err) {
				console.error(err);
			}
			else if (!recordID) {
				alert('Unable to find accession number. Please try again.');
				loadOverlay.removeAttr('style');
			}
			else {
				clearInterval(saveInterval);
				base('Patient Information').select({
					view: "Grid view",
					filterByFormula: "{ID Number} = '" + patientID + "'"
				}).eachPage(function page(records, fetchNextPage) {
					records.forEach(function(record) {
						recordID = record.id;
					});
					fetchNextPage();
				}, function done(err) {
					if (err) {
						console.error(err);
						return;
					}
					base('Patient Information').find(recordID, function(err, record) {
						if (err) {
							console.error(err);
							return;
						}
						$('#patient-id').html('<strong>Patient ID:</strong> ' + patientID);
						$('#patient-location').html('<strong>Location:</strong> ' + record.get('Location'));
						$('#patient-name').html('<strong>Patient Name:</strong> ' + record.get('Patient Name'));
						$('#patient-dob').html('<strong>Date of Birth:</strong> ' + record.get('Date of Birth'));
						$('#patient-sex').html('<strong>Sex:</strong> ' + record.get('Sex'));
					});
				});
				base('Tests').select({
					view: 'Grid view',
					filterByFormula: "{ID Number} = '" + patientID + "'"
				}).eachPage(function page(records, fetchNextPage) {
					records.forEach(function(record) {
						testID = record.id;
						testsList.push(testID);
					});
					fetchNextPage();
				}, function done(err) {
					if (err) {
						console.error(err);
						return;
					}
					var buttonArray = [];
					var loopCounter = 0;

					function populateButtons() {
						buttonArray.join('');
						$('#tests').html(buttonArray);
						loadOverlay.removeAttr('style');
						if (patientWindow.is(':hidden')) patientWindow.slideToggle(300);
					}
					for (var i = 0; i < testsList.length; i++) {
						loopCounter++;
						base('Tests').find(testsList[i], function(err, record) {
							if (err) {
								console.error(err);
								return;
							}
							var testButton = '<div id="' + accessionNumber + '" class="button" tabindex="0">' + record.get('Test Ordered') + '</div>';
							buttonArray.push(testButton);
							if (loopCounter === testsList.length) populateButtons();
						});
					};
				});
			}
		});
	});
	//Load accession data for the clicked
	//test button and initiate auto-save
	$('#tests').on('click', '.button', function() {
		var recordID,
			releaseState,
			appearanceVal,
			colourVal,
			sgRefractVal,
			totalVolumeVal,
			microscopeReqVal,
			uCommentsVal,
			uNameVal,
			uDateVal,
			glucoseVal,
			bilirubinVal,
			ketonesVal,
			sgVal,
			bloodVal,
			phVal,
			proteinVal,
			urobilinogenVal,
			nitriteVal,
			leukocytesVal,
			sedVolumeVal,
			wbcVal,
			rbcVal,
			fatBodiesVal,
			epithelialCellsVal,
			transitonalCellsVal,
			renalTubuleVal,
			granularCastsVal,
			hyalineCastsVal,
			rbcCastVal,
			wbcCastVal,
			waxyCastVal,
			oxalateVal,
			phosphateVal,
			uricAcidVal,
			urateVal,
			trichomonasVal,
			bacteriaVal,
			mucousVal,
			otherMVal;
		loadOverlay.css('display', 'flex');
		accessionNumber = $(this).attr('id');
		base('Tests').select({
			view: 'Grid view',
			filterByFormula: "{Accession Number} = '" + accessionNumber + "'"
		}).eachPage(function page(records, fetchNextPage) {
			records.forEach(function(record) {
				recordID = record.id;
				releaseState = record.get('Released');
				appearanceVal = record.get('Appearance');
				colourVal = record.get('Colour');
				otherColourVal = record.get('Other Colour');
				sgRefractVal = record.get('Specific Gravity (Refractometer)');
				totalVolumeVal = record.get('Total Volume');
				microscopeReqVal = record.get('Microscope Required');
				uCommentsVal = record.get('Comments');
				uNameVal = record.get('Performed By');
				uDateVal = record.get('Date/Time');
				glucoseVal = record.get('Glucose');
				bilirubinVal = record.get('Bilirubin');
				ketonesVal = record.get('Ketones');
				sgVal = record.get('Specific Gravity');
				bloodVal = record.get('Blood');
				phVal = record.get('pH');
				proteinVal = record.get('Protein');
				urobilinogenVal = record.get('Urobilinogen');
				nitriteVal = record.get('Nitrite');
				leukocytesVal = record.get('Leukocytes');
				sedVolumeVal = record.get('Total Sediment Volume');
				wbcVal = record.get('WBC');
				rbcVal = record.get('RBC');
				fatBodiesVal = record.get('Fat Bodies');
				epithelialCellsVal = record.get('Squamous Epithelial Cells');
				transitonalCellsVal = record.get('Transitional Cells');
				renalTubuleVal = record.get('Renal Tubule Cells');
				granularCastsVal = record.get('Granular Casts');
				hyalineCastsVal = record.get('Hyaline Casts');
				rbcCastVal = record.get('RBC Cast');
				wbcCastVal = record.get('WBC Cast');
				waxyCastVal = record.get('Waxy Cast');
				oxalateVal = record.get('Oxalate');
				phosphateVal = record.get('Phosphate');
				uricAcidVal = record.get('Uric Acid');
				urateVal = record.get('Urate');
				trichomonasVal = record.get('Trichomonas');
				bacteriaVal = record.get('Bacteria Present');
				mucousVal = record.get('Mucous Present');
				otherMVal = record.get('Other');
			});
			fetchNextPage();
		}, function done(err) {
			if (err) {
				console.error(err);
				return;
			}
			base('Tests').find(recordID, function(err, record) {
				if (err) {
					console.error(err);
					return;
				}
				var windowExists = $('.window[data-id="' + accessionNumber + '"]').length;
				if (!windowExists) {
					var testType = record.get('Test Ordered');
					var newWindow;
					switch (testType) {
						case 'Routine Urinalysis':
							newWindow =
								'<div data-id="' + accessionNumber + '" class="window hidden test urinalysis">' +
									'<div class="tab active">' + accessionNumber + '</div>' +
									'<h1>Urinalysis</h1>' +
									'<div class="column general">' +
										'<label for="appearance-' + accessionNumber + '">Appearance</label>' +
										'<select id="appearance-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>Clear</option>' +
											'<option>Cloudy</option>' +
											'<option>Turbid</option>' +
										'</select>' +
										'<label for="colour-' + accessionNumber + '">Colour</label>' +
										'<select id="colour-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>Yellow</option>' +
											'<option>Amber</option>' +
											'<option>Other</option>' +
										'</select>' +
										'<label class="hidden" for="other-colour-' + accessionNumber + '">Other Colour</label>' +
										'<input class="hidden" id="other-colour-' + accessionNumber + '" type="text" />' +
										'<label for="volume-' + accessionNumber + '">Total Volume</label>' +
										'<div class="unit-container">' +
											'<input id="volume-' + accessionNumber + '" type="number" min="0" value="0" />' +
											'<span class="unit-suffix">ml</span>' +
										'</div>' +
										'<div class="label">Microscopic Required</div>' +
										'<div id="microscope-req-' + accessionNumber + '" class="option-buttons">' +
											'<div class="option button" tabindex="0">Yes</div>' +
											'<div class="option button" tabindex="0">No</div>' +
										'</div>' +
										'<label for="comments-urinalysis-' + accessionNumber + '">Comments</label>' +
										'<textarea id="comments-urinalysis-' + accessionNumber + '"></textarea>' +
										'<label for="name-urinalysis-' + accessionNumber + '">Performed By</label>' +
										'<input id="name-urinalysis-' + accessionNumber + '" type="text" />' +
										'<label for="date-urinalysis-' + accessionNumber + '">Date/Time</label>' +
										'<input id="date-urinalysis-' + accessionNumber + '" type="datetime-local" />' +
									'</div>' +
									'<div class="column chemical">' +
										'<h2>Chemical Analysis</h2>' +
										'<label for="glucose-' + accessionNumber + '">Glucose</label>' +
										'<select id="glucose-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>Negative</option>' +
											'<option>5.5 mmol/L</option>' +
											'<option>14 mmol/L</option>' +
											'<option>28 mmol/L</option>' +
											'<option>55 mmol/L</option>' +
											'<option>>=111 mmol/L</option>' +
										'</select>' +
										'<label for="bilirubin-' + accessionNumber + '">Bilirubin</label>' +
										'<select id="bilirubin-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>Negative</option>' +
											'<option>Small +</option>' +
											'<option>Moderate ++</option>' +
											'<option>Large +++</option>' +
										'</select>' +
										'<label for="ketones-' + accessionNumber + '">Ketones</label>' +
										'<select id="ketones-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>Negative</option>' +
											'<option>0.5 mmol/L</option>' +
											'<option>1.5 mmol/L</option>' +
											'<option>4 mmol/L</option>' +
											'<option>8 mmol/L</option>' +
											'<option>16 mmol/L</option>' +
										'</select>' +
										'<label for="sg-' + accessionNumber + '">Specific Gravity</label>' +
										'<select id="sg-' + accessionNumber + '">' +
											'<option></option>' +
											'<option><=1.005</option>' +
											'<option>1.010</option>' +
											'<option>1.015</option>' +
											'<option>1.020</option>' +
											'<option>1.025</option>' +
											'<option>1.030</option>' +
											'<option>>1.030</option>' +
										'</select>' +
										'<label for="blood-' + accessionNumber + '">Blood</label>' +
										'<select id="blood-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>Negative</option>' +
											'<option>Trace</option>' +
											'<option>Small +</option>' +
											'<option>Moderate ++</option>' +
											'<option>Large +++</option>' +
										'</select>' +
										'<label for="ph-' + accessionNumber + '">pH</label>' +
										'<select id="ph-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>5.0</option>' +
											'<option>6.0</option>' +
											'<option>6.5</option>' +
											'<option>7.0</option>' +
											'<option>7.5</option>' +
											'<option>8.0</option>' +
											'<option>8.5</option>' +
										'</select>' +
										'<label for="protein-' + accessionNumber + '">Protein</label>' +
										'<select id="protein-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>Negative</option>' +
											'<option>Trace</option>' +
											'<option>0.3 g/L</option>' +
											'<option>1 g/L</option>' +
											'<option>3 g/L</option>' +
											'<option>>20 g/L</option>' +
										'</select>' +
										'<label for="urobilinogen-' + accessionNumber + '">Urobilinogen</label>' +
										'<select id="urobilinogen-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>3.2 &mu;mol/L</option>' +
											'<option>16 &mu;mol/L</option>' +
											'<option>33 &mu;mol/L</option>' +
											'<option>66 &mu;mol/L</option>' +
											'<option>131 &mu;mol/L</option>' +
										'</select>' +
										'<div class="label">Nitrite</div>' +
										'<div id="nitrite-' + accessionNumber + '" class="option-buttons">' +
											'<div class="option button" tabindex="0">Positive</div>' +
											'<div class="option button" tabindex="0">Negative</div>' +
										'</div>' +
										'<label for="leukocytes-' + accessionNumber + '">Leukocytes</label>' +
										'<select id="leukocytes-' + accessionNumber + '">' +
											'<option></option>' +
											'<option>Negative</option>' +
											'<option>Trace</option>' +
											'<option>Small +</option>' +
											'<option>Moderate ++</option>' +
											'<option>Large +++</option>' +
										'</select>' +
									'</div>' +
									'<div class="column release">' +
										'<div class="button" id="release-' + accessionNumber + '">Release</div>' +
									'</div>' +
									'<div class="column microscopic">' +
										'<h2>Microscopic Analysis</h2>' +
										'<label for="sed-volume-' + accessionNumber + '">Total Sediment Volume</label>' +
										'<div class="unit-container">' +
											'<input id="sed-volume-' + accessionNumber + '" type="text" value="0" />' +
											'<span class="unit-suffix">ml</span>' +
										'</div>' +
										'<label for="sg-refract-' + accessionNumber + '">Specific Gravity (Refractometer)</label>' +
										'<select id="sg-refract-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>1.000</option>' +
											'<option>1.005</option>' +
											'<option>1.010</option>' +
											'<option>1.015</option>' +
											'<option>1.020</option>' +
											'<option>1.025</option>' +
											'<option>1.030</option>' +
											'<option>>1.030</option>' +
										'</select>' +
										'<label for="wbc-' + accessionNumber + '">WBC</label>' +
										'<select id="wbc-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Negative</option>' +
											'<option>0-2/HPF</option>' +
											'<option>2-5/HPF</option>' +
											'<option>5-10/HPF</option>' +
											'<option>10-25/HPF</option>' +
											'<option>25-50/HPF</option>' +
											'<option>50-100/HPF</option>' +
											'<option>Gross</option>' +
										'</select>' +
										'<label for="rbc-' + accessionNumber + '">RBC</label>' +
										'<select id="rbc-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Negative</option>' +
											'<option>0-2/HPF</option>' +
											'<option>2-5/HPF</option>' +
											'<option>5-10/HPF</option>' +
											'<option>10-25/HPF</option>' +
											'<option>25-50/HPF</option>' +
											'<option>50-100/HPF</option>' +
											'<option>Gross</option>' +
										'</select>' +
										'<label for="fat-bodies-' + accessionNumber + '">Fat Bodies</label>' +
										'<select id="fat-bodies-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Negative</option>' +
											'<option>0-2/HPF</option>' +
											'<option>2-5/HPF</option>' +
											'<option>5-10/HPF</option>' +
											'<option>10-25/HPF</option>' +
											'<option>25-50/HPF</option>' +
											'<option>50-100/HPF</option>' +
											'<option>Gross</option>' +
										'</select>' +
										'<label for="epithelial-cells-' + accessionNumber + '">Squamous Epithelial Cells</label>' +
										'<select id="epithelial-cells-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Negative</option>' +
											'<option>0-2</option>' +
											'<option>2-5</option>' +
											'<option>5-10</option>' +
											'<option>10-25</option>' +
											'<option>>25</option>' +
										'</select>' +
										'<label for="transitional-cells-' + accessionNumber + '">Transitional Cells</label>' +
										'<select id="transitional-cells-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Negative</option>' +
											'<option>0-2</option>' +
											'<option>2-5</option>' +
											'<option>5-10</option>' +
											'<option>10-25</option>' +
											'<option>>25</option>' +
										'</select>' +
										'<label for="renal-tubule-cells-' + accessionNumber + '">Renal Tubule Cells</label>' +
										'<select id="renal-tubule-cells-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Negative</option>' +
											'<option>0-2</option>' +
											'<option>2-5</option>' +
											'<option>5-10</option>' +
											'<option>10-25</option>' +
											'<option>>25</option>' +
										'</select>' +
										'<label for="granular-casts-' + accessionNumber + '">Granular Casts</label>' +
										'<select id="granular-casts-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>0-2/LPF</option>' +
											'<option>2-5/LPF</option>' +
											'<option>5-10/LPF</option>' +
											'<option>10-15/LPF</option>' +
											'<option>>15/LPF</option>' +
										'</select>' +
										'<label for="hyaline-casts-' + accessionNumber + '">Hyaline Casts</label>' +
										'<select id="hyaline-casts-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>0-2/LPF</option>' +
											'<option>2-5/LPF</option>' +
											'<option>5-10/LPF</option>' +
											'<option>10-15/LPF</option>' +
											'<option>>15/LPF</option>' +
										'</select>' +
										'<label for="rbc-cast-' + accessionNumber + '">RBC Cast</label>' +
										'<select id="rbc-cast-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>0-2/LPF</option>' +
											'<option>2-5/LPF</option>' +
											'<option>5-10/LPF</option>' +
											'<option>10-15/LPF</option>' +
											'<option>>15/LPF</option>' +
										'</select>' +
										'<label for="wbc-cast-' + accessionNumber + '">WBC Cast</label>' +
										'<select id="wbc-cast-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>0-2/LPF</option>' +
											'<option>2-5/LPF</option>' +
											'<option>5-10/LPF</option>' +
											'<option>10-15/LPF</option>' +
											'<option>>15/LPF</option>' +
										'</select>' +
										'<label for="waxy-cast-' + accessionNumber + '">Waxy Cast</label>' +
										'<select id="waxy-cast-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>0-2/LPF</option>' +
											'<option>2-5/LPF</option>' +
											'<option>5-10/LPF</option>' +
											'<option>10-15/LPF</option>' +
											'<option>>15/LPF</option>' +
										'</select>' +
										'<label for="oxalate-' + accessionNumber + '">Oxalate</label>' +
										'<select id="oxalate-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Amorphous</option>' +
											'<option>0-2/HPF</option>' +
											'<option>2-5/HPF</option>' +
											'<option>5-10/HPF</option>' +
											'<option>10-15/HPF</option>' +
											'<option>>15/HPF</option>' +
										'</select>' +
										'<label for="phosphate-' + accessionNumber + '">Phosphate</label>' +
										'<select id="phosphate-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Amorphous</option>' +
											'<option>0-2/HPF</option>' +
											'<option>2-5/HPF</option>' +
											'<option>5-10/HPF</option>' +
											'<option>10-15/HPF</option>' +
											'<option>>15/HPF</option>' +
										'</select>' +
										'<label for="uric-acid-' + accessionNumber + '">Uric Acid</label>' +
										'<select id="uric-acid-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Amorphous</option>' +
											'<option>0-2/HPF</option>' +
											'<option>2-5/HPF</option>' +
											'<option>5-10/HPF</option>' +
											'<option>10-15/HPF</option>' +
											'<option>>15/HPF</option>' +
										'</select>' +
										'<label for="urate-' + accessionNumber + '">Urate</label>' +
										'<select id="urate-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>Amorphous</option>' +
											'<option>0-2/HPF</option>' +
											'<option>2-5/HPF</option>' +
											'<option>5-10/HPF</option>' +
											'<option>10-15/HPF</option>' +
											'<option>>15/HPF</option>' +
										'</select>' +
										'<label for="trichomonas-' + accessionNumber + '">Trichomonas</label>' +
										'<select id="trichomonas-' + accessionNumber + '">' +
											'<option>Select one</option>' +
											'<option>0-2</option>' +
											'<option>2-5</option>' +
											'<option>5-10</option>' +
											'<option>10-15</option>' +
										'</select>' +
										'<div class="label">Bacteria Present</div>' +
										'<div id="bacteria-' + accessionNumber + '" class="option-buttons">' +
											'<div class="option button" tabindex="0">Yes</div>' +
											'<div class="option button" tabindex="0">No</div>' +
										'</div>' +
										'<div class="label">Mucous Present</div>' +
										'<div id="mucous-' + accessionNumber + '" class="option-buttons">' +
											'<div class="option button" tabindex="0">Yes</div>' +
											'<div class="option button" tabindex="0">No</div>' +
										'</div>' +
										'<label for="other-microscopic-' + accessionNumber + '">Other</label>' +
										'<textarea id="other-microscopic-' + accessionNumber + '"></textarea>' +
									'</div>' +
									'<div class="column release">' +
										'<div class="button" id="full-release-' + accessionNumber + '">Release</div>' +
									'</div>' +
								'</div>';
								break;
					}
					$('#main').append(newWindow);
					$('#appearance-' + accessionNumber).val(appearanceVal);
					$('#colour-' + accessionNumber).val(colourVal);
					$('#other-colour-' + accessionNumber).val(otherColourVal);
					showOtherColour(accessionNumber);
					$('#sg-refract-' + accessionNumber).val(sgRefractVal);
					if (!totalVolumeVal) totalVolumeVal = 0;
					$('#volume-' + accessionNumber).val(totalVolumeVal);
					var volumeSuffix = $('#volume-' + accessionNumber).closest('.unit-container').children('.unit-suffix');
					moveUnits(totalVolumeVal, volumeSuffix);
					$('#microscope-req-' + accessionNumber + ' .option:contains("' + microscopeReqVal + '")').addClass('active');
					$('#comments-urinalysis-' + accessionNumber).val(uCommentsVal);
					$('#name-urinalysis-' + accessionNumber).val(uNameVal);
					$('#date-urinalysis-' + accessionNumber).val(curDate());
					$('#glucose-' + accessionNumber).val(glucoseVal);
					$('#bilirubin-' + accessionNumber).val(bilirubinVal);
					$('#ketones-' + accessionNumber).val(ketonesVal);
					$('#sg-' + accessionNumber).val(sgVal);
					$('#blood-' + accessionNumber).val(bloodVal);
					$('#ph-' + accessionNumber).val(phVal);
					$('#protein-' + accessionNumber).val(proteinVal);
					$('#urobilinogen-' + accessionNumber).val(urobilinogenVal);
					$('#nitrite-' + accessionNumber + ' .option:contains("' + nitriteVal + '")').addClass('active');
					$('#leukocytes-' + accessionNumber).val(leukocytesVal);
					if (!sedVolumeVal) sedVolumeVal = 0;
					$('#sed-volume-' + accessionNumber).val(sedVolumeVal);
					var sedVolumeSuffix = $('#sed-volume-' + accessionNumber).closest('.unit-container').children('.unit-suffix');
					moveUnits(sedVolumeVal, sedVolumeSuffix);
					$('#wbc-' + accessionNumber).val(wbcVal);
					$('#rbc-' + accessionNumber).val(rbcVal);
					$('#fat-bodies-' + accessionNumber).val(fatBodiesVal);
					$('#epithelial-cells-' + accessionNumber).val(epithelialCellsVal);
					$('#transitional-cells-' + accessionNumber).val(transitonalCellsVal);
					$('#renal-tubule-cells-' + accessionNumber).val(renalTubuleVal);
					$('#granular-casts-' + accessionNumber).val(granularCastsVal);
					$('#hyaline-casts-' + accessionNumber).val(hyalineCastsVal);
					$('#rbc-cast-' + accessionNumber).val(rbcCastVal);
					$('#wbc-cast-' + accessionNumber).val(wbcCastVal);
					$('#waxy-cast-' + accessionNumber).val(waxyCastVal);
					$('#oxalate-' + accessionNumber).val(oxalateVal);
					$('#phosphate-' + accessionNumber).val(phosphateVal);
					$('#uric-acid-' + accessionNumber).val(uricAcidVal);
					$('#urate-' + accessionNumber).val(urateVal);
					$('#trichomonas-' + accessionNumber).val(trichomonasVal);
					$('#bacteria-' + accessionNumber + ' .option:contains("' + bacteriaVal + '")').addClass('active');
					$('#mucous-' + accessionNumber + ' .option:contains("' + mucousVal + '")').addClass('active');
					$('#other-microscopic-' + accessionNumber).val(otherMVal);
					chosenSelects();
					$('div[data-id="' + accessionNumber + '"]').slideToggle(900);
					loadOverlay.removeAttr('style');
					$('div[data-id="' + accessionNumber + '"]').removeClass('hidden');
					$('div[data-id="' + accessionNumber + '"]').removeAttr('style');
					saveInterval = setInterval(function() {
						saveData(base, recordID, accessionNumber);
					}, 1000);
					var thisAccession = $('.window.test[data-id="' + accessionNumber + '"]');
					var partialRelease = $('.column.general, .column.chemical', thisAccession);
					var fullRelease = $('.column', thisAccession);
					if (releaseState === "Partial") {
						releaseData(base,accessionNumber,partialRelease,releaseState)
						$('#release-' + accessionNumber).addClass('disabled');
					} else if (releaseState === "Full") {
						releaseData(base,accessionNumber,fullRelease,releaseState)
						clearInterval(saveInterval);
						alert('NOTE: Accession #' + accessionNumber + ' has already been released!');
					}
				}
				else {
					loadOverlay.removeAttr('style');
					alert('Accession #' + accessionNumber + ' is already displayed.');
				}
			});
		});
	});
});