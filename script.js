var popupError;
var descriptors;
var descriptorsOptions;
var priSpecies;
var secSpecies;
var species;
var priSpeciesOptions;
var secSpeciesOptions;
var speciesOptions;
var types;
var typesOptions;
var elementalistType;
var genderFocusRow;
var priFoci;
var secFoci;
var priFociOptions;
var secFociOptions;
var foci;
var fociOptions;
var secFociSection;
var hybridSection;
var hybridButton;
var hybridTooltip;
var resetButton;
var resetTooltip;
var addSkillButton;
var skillError;
var skillList;
var skillsDeleteSpace;
var spellBook;
var spellbookButton;
var filterButtons;
var filterSearchBar;
var clearSearchButton;
var loreButton;
var enableCyberware;
var cyberwareTooltip;
var skillsSection;
var actionsSection;
var talentsSection;
var statusSection;
var spellHotbars;
var addCyberwareButton;
var cyberware;
var cyberError;
var cyberwareSection;
var cyberBodyParts;
var cyberwareImages;
var cyberwareDeleteSpace;
var addItemButton;
var inventoryList;
var inventoryBody;
var itemsDeleteSpace;
var addArtifactButton;
var artifactsList;
var artifactsBody;
var artifactsDeleteSpace;
var addNoteButton;
var notesList;
var notesBody;
var notesDeleteSpace;
var addContactButton;
var contactList;
var contactBody;
var contactDeleteSpace;
var firstDrag;
var periodCount;
var curArc;
var curTier;
var spellListDatabase;
var availSpellCount;
var selectedSpellCount;
var isHovering;
var removeAbility;
var Airtable;
var base;
var currentSheetID;
var saveInterval;
var recordID;
//Check if an integer is even
function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
}
//Check to see if user is currently using a touch device
function isTouchDevice() {
	var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
	var mq = function (query) {
		return window.matchMedia(query).matches;
	}

	if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
		return true;
	}

	// include the 'heartz' as a way to have a non matching MQ to help terminate the join
	// https://git.io/vznFH
	var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
	return mq(query);
}
//Add leading zeros to number strings
function leadZeros(number,places) {
  var zero = places - number.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + number;
}
//Disable or enable options based on current story arc
function setStoryArc(arc) {
	speciesOptions.add(typesOptions).each( function() {
		$(this).removeAttr('hidden');
		$(this).removeAttr('disabled');
	});
	$('option[data-arc]').each( function() {
		if( $(this).data('arc') >= arc) {
			$(this).prop('hidden', true);
			$(this).hide();
		} else {
			$(this).removeAttr('hidden');
			$(this).show();
		}
	});
}
//Hide any options that are marked as 'hidden' by the startup story arc function
function hideOptions(options) {
	options.each( function() {
		var isHidden = $(this)[0].hasAttribute('hidden');
		if( isHidden ) {
			$(this).hide();
		} else {
			$(this).show();
		}		
	});
}
//Enable and disable options based on variables
function disableOptions(target,array,conditional,otherTarget) {
	var targetVal;
	if ( otherTarget ) targetVal = otherTarget;
	else targetVal = target.val();
	if ( !conditional ) {
		if( $.inArray(targetVal,array) < 0 ) target.prop('disabled', true);
		else target.prop('disabled', false);
	} else {
		if( $.inArray(targetVal,array) > -1 ) target.prop('disabled', true);
		else target.prop('disabled', false);
	}
}
//Sort select field options function
function sortOptions(field,options) {
	options.sort(function(a,b) {
		if ( a.text.toLowerCase() > b.text.toLowerCase() ) return 1;
		else if ( a.text.toLowerCase() < b.text.toLowerCase() ) return -1;
		else return 0
	});
	field.empty().append(options).val('');
}
//Populate the contents of the species dropdown lists
function populateSpecies() {
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var availPriSpecies = $('#types option:selected').data('primary-species');
	var availSecSpecies = $('#types option:selected').data('secondary-species');
	var resSpecies = "";
	var resPriSpecies = $('#foci option:selected').data('restricted-species');
	var resSecSpecies = $('#secondary-foci option:selected').data('restricted-species');
	var resTypes = "";
	var resPriTypes = $('#foci option:selected').data('restricted-types');
	var resSecTypes = $('#secondary-foci option:selected').data('restricted-types');
	//Reset disabled status of all species options before making changes
	speciesOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted species,
	//restrict species based on that secondary focus
	if ( resSecSpecies ) resSpecies = resSecSpecies;
	else resSpecies = resPriSpecies;
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes ) resTypes = resSecTypes;
	else resTypes = resPriTypes;
	//If the type is selected, and there's no restrictions based on the selected focus
	if ( availPriSpecies && !resSpecies ) {
		var priArray = String(availPriSpecies);
		var secArray = String(availSecSpecies);
		if ( priArray ) priArray = priArray.split('');
		if ( secArray ) secArray = secArray.split('');
		priSpeciesOptions.each( function() {
			disableOptions($(this),priArray,false);			
		});
		secSpeciesOptions.each( function() {
			disableOptions($(this),secArray,false);				
		});
	//If the type is selected, and the selected focus has species restrictions
	} else if ( availPriSpecies && resSpecies ) {
		var priArray = String(availPriSpecies);
		var secArray = String(availSecSpecies);
		var speciesArray = String(resSpecies);
		if ( priArray ) priArray = priArray.split('');		
		if ( secArray ) secArray = secArray.split('');	
		if ( speciesArray ) speciesArray = speciesArray.split('');	
		priSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if ( $.inArray(thisSpecies,priArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) $(this).prop('disabled', true);
			else $(this).prop('disabled', false);								
		});
		secSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if ( $.inArray(thisSpecies,secArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) $(this).prop('disabled', true);
			else $(this).prop('disabled', false);
		});
	//If the type is NOT selected, and the selected focus has species and type restrictions
	} else if ( !availPriSpecies && resSpecies && resTypes ) {
		var typeArray = resTypes;
		var speciesArray = String(resSpecies);
		if ( typeArray ) typeArray = typeArray.match(/.{1,2}/g);
		if ( speciesArray ) speciesArray = speciesArray.split('');
		var priSpeciesArray = [];
		var secSpeciesArray = [];
		typesOptions.each( function() {
			var thisType = $(this).val();
			var priSpeciesForType = String($('#types option[value="' + thisType + '"]').data('primary-species'));
			var secSpeciesForType = String($('#types option[value="' + thisType + '"]').data('secondary-species'));
			if ( $.inArray(thisType,typeArray) < 0 ) {
				priSpeciesArray.push(priSpeciesForType);
				secSpeciesArray.push(secSpeciesForType);					
			}
		});
		priSpeciesArray = priSpeciesArray.join('').split('');
		secSpeciesArray = secSpeciesArray.join('').split('');
		priSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if( $.inArray(thisSpecies,priSpeciesArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) $(this).prop('disabled', true);
			else $(this).prop('disabled', false);						
		});
		secSpeciesOptions.each( function() {
			var thisSpecies = $(this).val();
			if( $.inArray(thisSpecies,secSpeciesArray) < 0 || $.inArray(thisSpecies,speciesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}								
		});
	//If the type is NOT selected, and the selected focus has type restrictions but no species restrictions
	} else if ( !availPriSpecies && !resSpecies && resTypes ) {
		var typeArray = resTypes;
		if ( typeArray ) typeArray = typeArray.match(/.{1,2}/g);
		var priSpeciesArray = [];
		var secSpeciesArray = [];
		typesOptions.each( function() {
			var thisType = $(this).val();
			var priSpeciesForType = String($('#types option[value="' + thisType + '"]').data('primary-species'));
			var secSpeciesForType = String($('#types option[value="' + thisType + '"]').data('secondary-species'));
			if ( $.inArray(thisType,typeArray) < 0 ) {
				priSpeciesArray.push(priSpeciesForType);
				secSpeciesArray.push(secSpeciesForType);					
			}
		});
		priSpeciesArray = priSpeciesArray.join('').split('');
		secSpeciesArray = secSpeciesArray.join('').split('');
		priSpeciesOptions.each( function() {
			disableOptions($(this),priSpeciesArray,false);							
		});
		secSpeciesOptions.each( function() {
			disableOptions($(this),secSpeciesArray,false);								
		});
	//If the type is NOT selected, and the selected focus has species restrictions but no type restrictions
	} else if ( !availPriSpecies && resSpecies && !resTypes ) {
		var array = String(resSpecies);
		if ( array ) array = array.split('');
		speciesOptions.each( function() {
			disableOptions($(this),array,true);				
		});
	}
	//Disable the currently selected primary or secondary species based on the
	//respective selection in the other field, stopping users from double dipping
	if ( priSpeciesVal ) $('#secondary-species option[value=' + priSpeciesVal + ']').prop('disabled', true);
	if ( secSpeciesVal ) $('#species option[value=' + secSpeciesVal + ']').prop('disabled', true);
	//Do not display any options that are marked as 'hidden' by the startup story arc function
	hideOptions(speciesOptions);
	//Trigger an update of the contents of both species select fields
	priSpecies.trigger('chosen:updated');
	secSpecies.trigger('chosen:updated');
}
//Populate the contents of the type dropdown list
function populateTypes() {
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var resTypes = "";
	var resPriTypes = $('#foci option:selected').data('restricted-types');
	var resSecTypes = $('#secondary-foci option:selected').data('restricted-types');
	//Reset disabled status of types before making changes
	typesOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If a secondary focus is selected and has restricted types,
	//restrict types based on that secondary focus
	if ( resSecTypes ) resTypes = resSecTypes;
	else resTypes = resPriTypes;
	//If there is a focus selected and no species selected
	if ( resTypes && !priSpeciesVal && !secSpeciesVal ) {
		var array = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			disableOptions($(this),array,true);
		});
	//If there is a focus selected and a primary species selected, but no secondary species
	} else if ( resTypes && priSpeciesVal && !secSpeciesVal ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availPriSpecies = String($(this).data('primary-species'));
			if ( availPriSpecies ) availPriSpecies = availPriSpecies.split('');
			if( $.inArray(priSpeciesVal,availPriSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is a focus selected and a secondary species selected, but no primary species
	} else if ( resTypes && !priSpeciesVal && secSpeciesVal ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availSecSpecies = String($(this).data('secondary-species'));
			if ( availSecSpecies ) availSecSpecies = availSecSpecies.split('');
			if( $.inArray(secSpeciesVal,availSecSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is a focus selected and both species are selected
	} else if ( resTypes && priSpeciesVal && secSpeciesVal ) {
		var resTypesArray = resTypes.match(/.{1,2}/g);
		typesOptions.each( function() {
			var thisType = $(this).val();
			var availPriSpecies = String($(this).data('primary-species'));
			var availSecSpecies = String($(this).data('secondary-species'));
			if ( availPriSpecies ) availPriSpecies = availPriSpecies.split('');
			if ( availSecSpecies ) availSecSpecies = availSecSpecies.split('');
			if( $.inArray(priSpeciesVal,availPriSpecies) < 0 || $.inArray(secSpeciesVal,availSecSpecies) < 0 || $.inArray(thisType,resTypesArray) > -1 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	//If there is NO focus selected, but only the primary species is selected
	} else if ( !resTypes && priSpeciesVal && !secSpeciesVal ) {
		typesOptions.each( function() {
			var array = String($(this).data('primary-species'));
			if ( array ) { array = array.split(''); }
			disableOptions($(this),array,false,priSpeciesVal);
		});
	//If there is NO focus selected, but only the secondary species is selected
	} else if ( !resTypes && !priSpeciesVal && secSpeciesVal ) {
		typesOptions.each( function() {
			var array = String($(this).data('secondary-species'));
			if ( array ) { array = array.split(''); }
			disableOptions($(this),array,false,secSpeciesVal);
		});
	//If there is NO focus selected, but both species are selected
	} else if ( !resTypes && priSpeciesVal && secSpeciesVal ) {
		typesOptions.each( function() {
			var availPriSpecies = String($(this).data('primary-species'));
			var availSecSpecies = String($(this).data('secondary-species'));
			if ( availPriSpecies ) availPriSpecies = availPriSpecies.split('');
			if ( availSecSpecies ) availSecSpecies = availSecSpecies.split('');
			if( $.inArray(priSpeciesVal,availPriSpecies) < 0 || $.inArray(secSpeciesVal,availSecSpecies) < 0 ) {
				$(this).prop('disabled', true);
			} else {
				$(this).prop('disabled', false);
			}
		});
	}
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	hideOptions(typesOptions);
	//Trigger an update of the contents	
	types.trigger('chosen:updated');
}
//Populate the contents of the focus dropdown lists
function populateFoci() {
	var descriptorVal = descriptors.val();
	var typeVal = types.val();
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	//Select the options under the two focus select fields
	var fociOptions = $('#foci option, #secondary-foci option');
	//Reset disabled status of foci before making changes
	fociOptions.each( function() {
		$(this).removeAttr('disabled');
	});
	//If the type is NOT selected, and only the primary species is selected
	if ( !typeVal && priSpeciesVal && !secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			if ( resSpecies ) {
				var speciesArray = resSpecies.split('');
				disableOptions($(this),speciesArray,true,priSpeciesVal);
			}
		});
	//If the type is NOT selected, and only the secondary species is selected	
	} else if ( !typeVal && !priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			if ( resSpecies ) {
				var speciesArray = resSpecies.split('');
				disableOptions($(this),speciesArray,true,secSpeciesVal);
			}
		});
	//If the type is NOT selected, and both species are selected
	} else if ( !typeVal && priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			if ( resSpecies ) {
				var speciesArray = resSpecies.split('');
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			}
		});
	//If the type is selected, and only the primary species is selected
	} else if ( typeVal && priSpeciesVal && !secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			var resTypes = $(this).data('restricted-types');
			if ( resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes && !resSpecies ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				disableOptions($(this),typesArray,true,typeVal);
			} else if ( !resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				disableOptions($(this),speciesArray,true,priSpeciesVal);
			}
		});
	//If the type is selected, and only the secondary species is selected
	} else if ( typeVal && !priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			var resTypes = $(this).data('restricted-types');
			if ( resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(secSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes && !resSpecies ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				disableOptions($(this),typesArray,true,typeVal);
			} else if ( !resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				disableOptions($(this),speciesArray,true,secSpeciesVal);
			}
		});
	//If the type is selected, and both species are selected
	} else if ( typeVal && priSpeciesVal && secSpeciesVal ) {
		fociOptions.each( function() {
			var resSpecies = String($(this).data('restricted-species'));
			var resTypes = $(this).data('restricted-types');
			if ( resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				var typesArray = resTypes.match(/.{1,2}/g);
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 || $.inArray(typeVal,typesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			} else if ( resTypes && !resSpecies ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				disableOptions($(this),typesArray,true,typeVal);
			} else if ( !resTypes && resSpecies ) {
				var speciesArray = resSpecies.split('');
				if( $.inArray(priSpeciesVal,speciesArray) > -1 || $.inArray(secSpeciesVal,speciesArray) > -1 ) {
					$(this).prop('disabled', true);
				} else {
					$(this).prop('disabled', false);
				}
			}
		});
	//If the type is select, and no species is selected
	} else if ( typeVal && !priSpeciesVal && !secSpeciesVal ) {
		fociOptions.each( function() {
			var resTypes = $(this).data('restricted-types');
			if ( resTypes ) {
				var typesArray = resTypes.match(/.{1,2}/g);
				disableOptions($(this),typesArray,true,typeVal);
			}
		});
	}
	//If the "Wealthy" descriptor is selected
	if ( descriptorVal === "M7" ) $('#foci option[value="E8"], #secondary-foci option[value="E8"]').prop('disabled', true);
	//Do not display any options thate marked as 'hidden' by the startup story arc function
	hideOptions(fociOptions);
	//Trigger an update of the contents
	priFoci.trigger('chosen:updated');
	secFoci.trigger('chosen:updated');
}
//Populate the spell list based on the currently selected options
function populateSpells() {
	var descriptorVal = descriptors.val();
	var priSpeciesVal = priSpecies.val();
	var secSpeciesVal = secSpecies.val();
	var typeVal = types.val();
	var priFocusVal = priFoci.val();
	var secFocusVal = secFoci.val();
	var selectedAttributes = [];
	spellsList = [];
	//If the value of the field is not blank,
	//add it to the array to look for spells
	if ( descriptorVal ) selectedAttributes.push("D" + descriptorVal);
	//If "Has More Money Than Sense" is selected, add the "Wealthy"
	//descriptor to the list of attributes
	if ( priFocusVal == "E8" || secFocusVal == "E8" ) selectedAttributes.push("DM7");
	if ( priSpeciesVal && !secSpeciesVal ) selectedAttributes.push("S" + priSpeciesVal);
	else if ( !priSpeciesVal && secSpeciesVal ) selectedAttributes.push("S" + secSpeciesVal);
	else if ( priSpeciesVal && secSpeciesVal ) selectedAttributes.push("S" + String(priSpeciesVal) + String(secSpeciesVal));
	//If character has specialization foci, don't push Type
	if ( typeVal && ['F8','G1','G2','G5','G6','K9','O7'].includes(priFocusVal) == false && ['F8','G1','G2','G5','G6','K9','O7'].includes(secFocusVal) == false ) selectedAttributes.push("T" + typeVal);
	//If character has "Infected" descriptor and selects "Ascension",
	//push "Worships Dark Beings" focus
	if ( $('#0515', spellBook).hasClass('selected') ) {
		selectedAttributes.push("FO7");
	};
	if ( priFocusVal ) selectedAttributes.push("F" + priFocusVal);
	if ( secFocusVal ) selectedAttributes.push("F" + secFocusVal);
	//Run through each field in the character attributes section
	//to retrieve any spells associated with that attribute
	$.each(selectedAttributes, function(index,curOption) {
		for (var i = 0; i < spellListDatabase.length; i++) {
			//Define variables for the current spell
			var hideThis = "";
			var optionalSpell = "";
			var spellName = spellListDatabase[i].name;
			var spellTier = spellListDatabase[i].tier;
			var spellRank = spellListDatabase[i].rank;
			var spellOptional = spellListDatabase[i].optional;
			var spellID = spellListDatabase[i].id;
			var optionID = curOption.substring(1);
			var typeCheck = spellListDatabase[i].type;
			var spellType = '<img src="images/' + typeCheck.toLowerCase() + '.png">';
			//Set the order of the spell in the flex-box by its Tier and name
			var spellOrder = parseInt(String(parseInt(spellTier) + 1) + leadZeros(parseInt(spellName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97,2) + leadZeros(parseInt(spellName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
			var spellDescription = spellListDatabase[i].description;
			var spellCost = spellListDatabase[i].cost;
			var spellCasttime = spellListDatabase[i].casttime;
			var spellDuration = spellListDatabase[i].duration;
			var spellRange = spellListDatabase[i].range;
			var spellCooldown = spellListDatabase[i].cooldown;
			var spellDice = spellListDatabase[i].dice;
			var itemName = spellListDatabase[i].itemname;
			var itemEffect = spellListDatabase[i].itemeffect;
			var spellOptional = spellListDatabase[i].optional;
			var spellOrigin;
			//Check to see if these values exist to avoid
			//empty line breaks in the spell card
			if ( spellName == "<hide>" || typeCheck == "Status" ) hideThis = " hidden-spell";
			if ( !spellRank ) spellRank = 7;
			switch ( curOption.charAt(0) ) {
				case "D":
					spellOrigin = $('#descriptors option[value="' + optionID + '"]').text();
				break;
				case "S":
					if ( optionID.length === 2 ) {
						var priSpeciesID;
						var secSpeciesID;
						if ( optionID.charAt(0) < optionID.charAt(1) ) {
							priSpeciesID = optionID.charAt(0);
							secSpeciesID = optionID.charAt(1);
						} else {
							priSpeciesID = optionID.charAt(1);
							secSpeciesID = optionID.charAt(0);
						}
						optionID = priSpeciesID + secSpeciesID;
						curOption = "S" + optionID;
						if ( spellListDatabase[i]["S" + priSpeciesID] == "TRUE" ) spellOrigin = $('#species option[value="' + priSpeciesID + '"]').text();
						else if ( spellListDatabase[i]["S" + secSpeciesID] == "TRUE" ) spellOrigin = $('#secondary-species option[value="' + secSpeciesID + '"]').text();
					} else {
						spellOrigin = $('#species option[value="' + optionID + '"]').text();
					}
				break;
				case "T":
					spellOrigin = $('#types option[value="' + optionID + '"]').text();
				break;
				case "F":
					if ( priFocusVal != "E2" ) {
						spellOrigin = $('#foci option[value="' + optionID + '"]').text();
					} else {
						if ( spellListDatabase[i]["FE2"] == "TRUE" ) spellOrigin = $('#foci option[value="' + optionID + '"]').text();
						else spellOrigin = $('#secondary-foci option[value="' + optionID + '"]').text();
					}
				break;
				case "V":
					spellOrigin = $('#foci option[value="' + optionID + '"]').text();
				break;
				default:
					spellOrigin = "";
			}
			//If the current spell in the array is associated with this attribute
			//and the current tier is equal or lower to the tier of the spell,
			//define parameters and create a new div on the page for the spell
			if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && ['Action','Talent','Select','Note','Skill','Status'].includes(typeCheck) && spellRank > curTier ) {
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card.
				var skillProficiency = spellListDatabase[i].itemtype;
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( spellDuration ) spellDuration = '<span><strong>Duration:</strong> Lasts ' + spellDuration + '</span>';
				if ( spellCasttime ) spellCasttime = '<span><strong>Cast Time:</strong> Takes ' + spellCasttime + '</span>';
				if ( spellRange ) spellRange = '<span><strong>Range: </strong>' + spellRange + ' range</span>';
				if ( spellCooldown ) spellCooldown = '<span><strong>Cooldown: </strong>' + spellCooldown + '</span>';
				if ( spellDice ) spellDice = '<span><strong>Roll: </strong>' + spellDice + '</span>';
				if ( itemName && itemEffect == "<default>" ) itemName = ' data-default="' + itemName + '" ';
				if ( skillProficiency ) skillProficiency =  ' data-proficiency="' + skillProficiency + '" ';
				else itemName = "";
				if ( spellOptional ) {
					spellOptional = '<span class="optional">Optional</span>';
					optionalSpell = ' optional';
				}
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell' + hideThis + optionalSpell + '"' + itemName + skillProficiency + 'style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									spellType +
									spellName +
								'</h3>' +
								spellTier +
								'</div>' +
							'<div class="details">' +
								'<div class="stats">' +
									spellOptional +
									spellDuration +
									spellCasttime +
									spellRange +
									spellCooldown +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									spellDice +
									spellOrigin +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Items" ) {
				//Variables specific to items
				var itemType = spellListDatabase[i].itemtype;
				var itemValue = spellListDatabase[i].itemvalue;
				if ( itemType == "Artifact" ) spellType = '<img src="images/artifact.png">';
				else spellType = '<img src="images/items.png">';
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( itemValue ) itemValue = '<span><strong>Value: </strong>' + itemValue + '₡</span>';
				if ( spellOptional ) {
					spellOptional = '<span class="optional">Optional</span>';
					optionalSpell = ' optional';
				}
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell' + hideThis + optionalSpell + '" style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									spellType +
									spellName +
								'</h3>' +
							spellTier +
							'</div>' +
							'<div class="details">' +
								'<div class="stats">' +
									spellOptional +
									itemValue +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									spellOrigin +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Contact" ) {
				//Variables specific to contacts
				var contactSkill = spellListDatabase[i].itemvalue;
				var contactType = spellListDatabase[i].itemtype;					
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellName == "<hide>" ) hideThis = " hidden-spell";
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( contactSkill ) contactSkill = '<span><strong>Skills: </strong>' + contactSkill + '</span>';
				if ( contactType ) contactType = '<span><strong>Type: </strong>' + contactType + '</span>';
				if ( spellOptional ) {
					spellOptional = '<span class="optional">Optional</span>';
					optionalSpell = ' optional';
				}
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell' + hideThis + optionalSpell + '" style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									'<img src="images/contact.png">' +
									spellName +
								'</h3>' +
							spellTier +
							'</div>' +
							'<div class="details">' +
								'<div class="stats">' +
									spellOptional +
									contactType +
									contactSkill +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									spellOrigin +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && spellTier <= curTier && typeCheck == "Cyberware" ) {
				//Variables specific to cyberware
				var cyberwareLocation = spellListDatabase[i].itemtype;
				var cyberwareValue = spellListDatabase[i].itemvalue;
				var cyberwareType = spellListDatabase[i].itemlevel;
				spellType = '<img src="images/cyberware.png">';					
				//Check to see if these values exist to avoid
				//empty line breaks in the spell card
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( cyberwareValue ) cyberwareValue = '<span><strong>Value: </strong>' + cyberwareValue + '₡</span>';
				if ( cyberwareType ) cyberwareType = '<span><strong>Type: </strong>' + cyberwareType + '</span>';
				if ( cyberwareLocation ) cyberwareLocation = '<span><strong>Location: </strong>' + cyberwareLocation + '</span>';
				if ( spellOptional ) {
					spellOptional = '<span class="optional">Optional</span>';
					optionalSpell = ' optional';
				}
				var newOrigin = spellOrigin;
				spellOrigin = '<span class="origin">' + spellOrigin + '</span>';
				//If the spell ID is already on the page, just change
				//the origin name; otherwise, create a spell card
				if ( $('#' + spellID).length > 0 ) {
					$('#' + spellID + ' .origin').text(newOrigin);
				} else {
					$('#spellbook').append(
						'<div id="' + spellID + '" class="spell' + hideThis + optionalSpell +'" style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									spellType +
									spellName +
								'</h3>' +
							spellTier +
							'</div>' +
							'<div class="details">' +
								'<div class="stats">' +
									spellOptional +
									cyberwareLocation +
									cyberwareType +
									cyberwareValue +
								'</div>' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
								'<div class="stats">' +
									spellOrigin +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} else if ( spellListDatabase[i][curOption] == "TRUE" && typeCheck == "Lore" ) {
				if ( $('#' + spellID).length <= 0 ) {
					$('#archives').append(
						'<div id="' + spellID + '" class="lore" style="order: ' + spellOrder + '">' +
							'<div class="header">' +
								'<h3>' +
									spellName +
								'</h3>' +
								'</div>' +
							'<div class="details">' +
								'<div class="description">' +
									spellDescription +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				//Push this spell to the spell list array
				spellsList.push(parseInt(spellID));
			} 
		}
	});
	//Remove any spells that are not
	//in the active spell list array
	$('.spell, .lore').each( function() {
		var spellID = parseInt($(this).attr('id'));
		if ( spellID && $.inArray(spellID,spellsList) < 0 ) $(this).remove();
	});
	//Hide placeholder if there are spells
	//and show the filters in the spellbook
	if ( $('.spell', spellBook).length != 0 ) {
		$('.placeholder', spellBook).addClass('hidden-section');
		$('.filters', spellBook).removeClass('hidden-section');
	} else {
		$('.placeholder', spellBook).removeClass('hidden-section');
		$('.filters', spellBook).addClass('hidden-section');
	}
	//Hide stats section if empty
	$('.stats').each( function() {
		if ( $(this).is(':empty') ) $(this).hide();
	});
	//Show or hide filters based on current level
	for (var i = 0; i < $('.filters .button').length; i++) {
		var filterTier = i + 1;
		if ( filterTier <= curTier && curTier != 1 ) $('#filter-tier' + filterTier).removeClass('hidden-section');
		else $('#filter-tier' + filterTier).addClass('hidden-section');
	};
	//If filters were enabled, honor the filters
	//for any newly added spells
	$('.spell.hidden', spellBook).hide();
	filterButtons.each( function() {
		var thisButton = $(this);
		var thisModal = $(this).closest('.modal');
		var filter = $(this).attr('id');
		var tier;
		switch (filter) {
			case "filter-tier1":
				tier = "Tier 1";
			break;
			case "filter-tier2":
				tier = "Tier 2";
			break;
			case "filter-tier2":
				tier = "Tier 2";
			break;
			case "filter-tier3":
				tier = "Tier 3";
			break;
			case "filter-tier4":
				tier = "Tier 4";
			break;
			case "filter-tier5":
				tier = "Tier 5";
			break;
			case "filter-tier6":
				tier = "Tier 6";
			break;
		}
		if ( thisButton.hasClass('clicked') === false ) {
			$('.spell', thisModal).each( function() {
				var spellTier = $('.tier', this).text();
				if ( spellTier === tier && $(this).hasClass('hidden') == false ) $(this).addClass('hidden ' + filter);
			});
		} 
	});
	//If there are select spells, update the abilities
	//button to prompt user to make selections
	if ( $('img[src$="images/select.png"]', spellBook).length != $('.selectable.selected', spellBook).length ) {
		var selectionMade = $('.selectable.selected', spellBook).closest('.spell');
		var selectSpells = $('img[src$="images/select.png"]', spellBook).closest('.spell').not(selectionMade);
		spellbookButton.text('Make Selections');
		$('.spell:not(.optional), .spell.optional.selected', spellBook).not(selectSpells).addClass('hide-for-select');
	} else {
		spellbookButton.text('Abilities');
		$('.spell', spellBook).removeClass('hide-for-select');
	}
	populateSpellLists();
}
//Populate each individual spell list on the main character sheet
function populateSpellLists() {	
	//Move each spell to their respective lists
	$('#spellbook .spell').each( function() {
		var talentsVisible = talentsSection.parent('.spell-list').is(':visible');
		var actionsVisible = actionsSection.parent('.spell-list').is(':visible');
		var statusVisible = statusSection.parent('.spell-list').is(':visible');
		var skillsVisible = skillsSection.parent('.spell-list').is(':visible');
		var spellID = $(this).attr('id');
		var spellOrigin = '<span class="origin">' + $('.origin', this).text() + '</span>';
		for (var i = 0; i < spellListDatabase.length; i++) {
			if ( spellListDatabase[i].id === spellID ) {
				var spellName = spellListDatabase[i].name;
				var itemName = spellListDatabase[i].itemname;
				var spellTier = spellListDatabase[i].tier;
				var typeCheck = spellListDatabase[i].type;
				var spellTooltip = '<span class="description">' + spellListDatabase[i].tooltip + '</span>';
				var spellCasttime = spellListDatabase[i].casttime;
				var spellDuration = spellListDatabase[i].duration;
				var spellRange = spellListDatabase[i].range;
				var spellCooldown = spellListDatabase[i].cooldown;
				var spellDice = spellListDatabase[i].dice;
				var spellOptional = spellListDatabase[i].optional;
				var tooltipDice = '<span class="type">' + spellDice + '</span>';
				var spellOrder = parseInt(String(parseInt(spellTier) + 1) + '1' + leadZeros(parseInt(spellName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97,2) + leadZeros(parseInt(spellName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
				var tooltipName = '<h4 class="name">' + spellName + '</h4>';
				var statusName = '<li>' + spellName + '</li>';
				spellName = '<span>' + spellName + '</span>';
				if ( spellTier ) spellTier = '<div class="tier">Tier ' + spellTier + '</div>';
				if ( spellDuration ) spellDuration = '<span>Lasts ' + spellDuration + '</span>';
				if ( spellRange ) spellRange = '<span>' + spellRange + ' range</span>';
				if ( spellCasttime ) spellCasttime = '<span>Takes ' + spellCasttime + '</span>';
				if ( spellCooldown ) spellCooldown = '<span>' + spellCooldown + ' cooldown</span>';
				if ( $('#' + spellID, spellBook).hasClass('selected') ) spellOptional = false;
				//Action spell hotbars & tooltips
				if ( !spellOptional && typeCheck == "Action" && ($('#actions .spell[data-spellid="' + spellID + '"]').length <= 0) ) {
					var spellCost = '<span class="spell-handle">' + spellListDatabase[i].cost + '</span>';
					if ( !spellDice ) tooltipDice = '<span class="type">Feat</span>';
					var spellToAdd =
						'<div data-spellid="' + spellID + '" style="order: ' + spellOrder +'" class="spell">' +
							'<div class="wrapper">' +
								spellName +
								spellDice +
							'</div>' +
						'</div>';
					actionsSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
							tooltipName + 
							spellTier +
							spellCasttime +
							spellRange +
							spellDuration +
							spellCooldown +
							spellTooltip + 
							tooltipDice +
							spellOrigin +
						'</div>'
					);
					//Show the spell list section if there are spells in the list, otherwise hide it
					if ( !actionsVisible ) {
						$(spellToAdd).appendTo(actionsSection).css('width','100%');
						actionsSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(spellToAdd).appendTo(actionsSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300
						});
					}
				//Talent spell hotbars & tooltips
				} else if ( !spellOptional && typeCheck == "Talent" && $('#talents .spell[data-spellid="' + spellID + '"]').length <= 0 ) {
					if ( !spellDice ) tooltipDice = '<span class="type">Trait</span>';
					var spellToAdd =
						'<div data-spellid="' + spellID + '" style="order: ' + spellOrder +'" class="spell">' +
							'<div class="wrapper">' +
								spellName +
							'</div>' +
						'</div>';
					talentsSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
							tooltipName + 
							spellTier +
							spellCasttime +
							spellRange +
							spellDuration +
							spellCooldown +
							spellTooltip +
							tooltipDice +
							spellOrigin +
						'</div>'
					);
					//Show the spell list section if there are spells in the list, otherwise hide it
					if ( !talentsVisible ) {
						$(spellToAdd).appendTo(talentsSection).css('width','100%');
						talentsSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(spellToAdd).appendTo(talentsSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300
						});
					}
				//Status hotbars and tooltips
				} else if ( !spellOptional && typeCheck == "Status" && $('#status .status-effect[data-spellid="' + spellID + '"]').length <= 0 ) {
					if ( !spellDice ) tooltipDice = '<span class="type">Status</span>';
					var statusToAdd =
						'<div data-spellid="' + spellID + '" style="order: ' + spellOrder +'" class="status-effect">' +
							'<ul class="wrapper">' +
								statusName +
							'</ul>' +
						'</div>';
					statusSection.after(
						'<div data-spellid="' + spellID + '" class="tooltip">' +
							tooltipName + 
							spellTier +
							spellCasttime +
							spellRange +
							spellDuration +
							spellCooldown +
							spellTooltip + 
							tooltipDice +
							spellOrigin +
						'</div>'
					);
					//Show the spell list section if there are spells in the list, otherwise hide it
					if ( !statusVisible ) {
						$(statusToAdd).appendTo(statusSection).css('width','100%');
						statusSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(statusToAdd).appendTo(statusSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300
						});
					}
				//Update proficiency if skill already exists
				} else if ( !spellOptional && typeCheck == "Skill" && $('.spell[data-default="' + itemName + '"]', spellBook).length > 0 && $('#skills .spell[data-default="' + itemName + '"]').length > 0 ) {
					var skillsArray = [];
					var skillProficiency = 0;
					$('.spell[data-default="' + itemName + '"]', spellBook).each( function() {
						var thisProficiency = $(this).data('proficiency');
						switch (thisProficiency) {
							case "T":
								thisProficiency = 1;
							break;
							case "I":
								thisProficiency = -1;
							break;
							default:
								thisProficiency = 0;
						}
						skillsArray.push(thisProficiency);
					});
					for ( var j = 0; j < skillsArray.length; j++ ) skillProficiency += skillsArray[j];
					if ( skillProficiency > 0 ) skillProficiency = "+1d";
					else if ( skillProficiency < 0 ) skillProficiency = "-1d";
					else skillProficiency = "&#10022;";
					$('#skills .spell[data-default="' + itemName + '"] .proficiency').html(skillProficiency);
				//Add skills to the skill list
				} else if ( !spellOptional && typeCheck == "Skill" && $('#skills .spell[data-spellid="' + spellID + '"]').length <= 0 ) {
					var skillProficiency = spellListDatabase[i].itemtype;
					var customSkill = spellListDatabase[i].itemeffect;
					var skillSpellOrder = parseInt((parseInt(itemName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97) + leadZeros(parseInt(itemName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
					var defaultName = "";
					if ( customSkill == "<default>" ) {
						customSkill =  '" contenteditable="false"';
						defaultName = ' data-default="' + itemName + '"'
					} else {
						customSkill = ' editable" contenteditable="true"';
					}
					switch (skillProficiency) {
						case "T":
							skillProficiency = "+1d";
						break;
						case "I":
							skillProficiency = "-1d";
						break;
						default:
							skillProficiency = "&#10022;";
					}
					var skillToAdd =
						'<div data-spellid="' + spellID + '" style="order: ' + skillSpellOrder +'" class="spell"' + defaultName +'>' +
							'<div class="wrapper">' +
								'<div class="name' + customSkill + '">' + itemName + '</div>' +
								'<div class="proficiency">' + skillProficiency + '</div>' +
							'</div>' +
						'</div>';
					if ( !skillsVisible ) {
						$(skillToAdd).appendTo(skillsSection).css('width','100%');
						skillsSection.parent('.spell-list').stop().slideToggle(300);
					} else {
						$(skillToAdd).appendTo(skillsSection).stop().animate({
							'width' : '100%'
						}, {
							duration: 300
						});
					}
				//Add items to the inventory list
				} else if ( !spellOptional && typeCheck == "Items" && $('#equipment tr[data-spellid="' + spellID + '"]').length <= 0 && $('#artifacts tr[data-spellid="' + spellID + '"]').length <= 0 ) {
					var itemType = spellListDatabase[i].itemtype;
					var itemValue = spellListDatabase[i].itemvalue;
					var itemEffect = spellListDatabase[i].itemeffect;
					if ( !itemValue ) itemValue = 0;
					if ( itemType == "Artifact" ) {
						addArtifact(spellID,itemName,itemEffect);
					} else {
						switch ( itemType ) {
							case "Weapon":
							itemType = "WE";
							break;
							case "Clothing":
							itemType = "CL";
							break;
							default:
							itemType = "IT";
						}
						addItem(spellID,itemName,itemType,itemValue);
					}
				//Add to contact list
				} else if ( !spellOptional && typeCheck == "Contact" && $('#contacts tr[data-spellid="' + spellID + '"]').length <= 0 ) {
					var contactType = spellListDatabase[i].itemtype;
					var contactSkill = spellListDatabase[i].itemvalue;
					var contactDescription = spellListDatabase[i].itemeffect;
					switch ( contactType ) {
						case "Contact":
						contactType = "CT";
						break;
						case "Companion":
						contactType = "CP";
						break;
						default:
						contactType = "OT";
					}
					addContact(spellID,itemName,contactDescription,contactSkill,contactType);
				//Add cyberware to the cyberware
				} else if ( !spellOptional && typeCheck == "Cyberware" && $('#cyberware .cyberware[data-spellid="' + spellID + '"]').length <= 0 ) {
					var bodyPart = spellListDatabase[i].itemtype;
					var cyberwareLocation = bodyPart + "-cyberware";
					var cyberwareFunction = spellListDatabase[i].itemeffect;
					switch ( itemName ) {
						case "Weapon":
						itemName = "WE";
						break;
						default:
						itemName = "UT";
					}
					addCyberware(spellID,cyberwareLocation,cyberwareFunction,itemName);
					var bodyPartImg = $('#cyber-mannequin img.' + bodyPart);
					bodyPartImg.addClass('modded');
					enableCyberware.addClass('clicked');
					if ( cyberware.is(':visible') == false ) cyberware.stop().slideToggle(200);
					if ( bodyPartImg.hasClass('active') == false ) bodyPartImg.attr('src',  'images/cyber'+ bodyPart + '-modded.png');
				//Add to notes list
				} else if ( !spellOptional && typeCheck == "Note" && $('#notes tr[data-spellid="' + spellID + '"]').length <= 0 ) {
					var note = spellListDatabase[i].description;
					addNote(spellID,note);
				}
			}
		}
	});
	//Remove any items or spells not in the current spelllist
	$('.spell-list .spell, .spell-list .status-effect, .item-list tr, .tooltip, .cyberware').each( function() {
		var thisBar = $(this);
		var emptySpell = $('.name',thisBar).html();
		var thisHotbarList = thisBar.parent();
		var thisSpellList = thisBar.closest('.spell-list');
		var spellID = parseInt($(this).data('spellid'));
		if ( spellID && $.inArray(spellID,spellsList) < 0 ) {
			if ( thisBar.hasClass('spell') || thisBar.hasClass('status-effect') ) {
				thisBar.stop().slideToggle({
					duration: 300,
					complete: function() {
						thisBar.remove();
						if ( thisSpellList.is(':visible') && thisHotbarList.is(':empty') ) thisSpellList.stop().slideToggle(200);
					}
				});
			} else if ( thisBar.hasClass('cyberware') ) {
				var bodyPart = thisBar.attr('class').split(' ')[1];
				var emptyMods = 0;
				thisBar.remove();
				for (var i = 0; i < $('.cyberware.' + bodyPart).length; i++) {
					emptyMods++;
				}
				if ( !emptyMods ) {
					$('#cyber-mannequin img.' + bodyPart).removeClass('modded');
					if ( $('#cyber-mannequin img.' + bodyPart).hasClass('active') == false ) $('#cyber-mannequin img.' + bodyPart).attr('src',  'images/cyber'+ bodyPart + '.png')
				}
			} else {
				thisBar.remove();
			}
		}
	});
	//Arrange spell hotbars so they don't take up too much vertical-space
	arrangeSpells();
	//If selectable option in select spells matches
	//an existing ability that is already trained
	//disable it
	$('.selectable', spellBook).each( function() {
		var skill = $(this).text().trim();
		var skillTrained;
		var skillExists = $('.spell[data-default="' + skill + '"]', skillList).length > 0;
		if ( skillExists ) skillTrained = $('.spell[data-default="' + skill + '"] .proficiency select', skillList).val();
		var selectedSkill = $(this).hasClass('selected');
		if ( skillExists && !selectedSkill & skillTrained == "T" ) $(this).addClass('disabled');
	});
}
//Populate all of the active item select fields
function populateInventorySelect() {
	$('#equipment .equip select').chosen({
		disable_search: true,
		width: "fit-content"
	});
	$('#equipment .type select').chosen({
		disable_search: true,
		width: "fit-content"
	});
	$('#equipment .value select').chosen({
		disable_search: true,
		width: "fit-content"
	});
}
//Add a blank item, unless variables are parsed
function addItem(spellID,itemName,itemType,itemValue,itemState) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !itemName ) itemName = "";
	var itemToAdd =
		'<tr class="item"' + spellID + ' style="width: 0">' +
			'<td class="arrow mobile-handle"></td>' +
			'<td class="equip">' +
				'<select>' +
					'<option selected value="S">Stashed</option>' +
					'<option value="R">Readied</option>' +
					'<option value="E">Equipped</option>' +
				'</select>' +
			'</td>' +
			'<td class="name">' +
				'<div class="editable" contenteditable="true">' + itemName + '</div>' +
			'</td>' +
			'<td class="type">' +
				'<select>' +
					'<option selected value="IT">Item</option>' +
					'<option value="WE">Weapon</option>' +
					'<option value="CL">Clothing</option>' +
				'</select>' +
			'</td>' +
			'<td class="value">' +
				'<select>' +
					'<option selected value="0">Priceless</option>' +
					'<option value="1">Inexpensive</option>' +
					'<option value="2">Moderately Priced</option>' +
					'<option value="3">Expensive</option>' +
					'<option value="4">Very Expensive</option>' +
					'<option value="5">Exorbitant</option>' +
				'</select>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(itemToAdd).insertAfter('#equipment table tr:first-child');
	else inventoryList.append(itemToAdd);
	if ( itemName ) {
		var thisItem = $('.name .editable:contains("' + itemName + '")').closest('.item');
		$('.type select', thisItem).val(itemType);
		$('.type select', thisItem).trigger('chosen:updated');
		$('.value select', thisItem).val(itemValue);
		$('.value select', thisItem).trigger('chosen:updated');
		if ( itemState ) {
			$('.equip select',thisItem).val(itemState);
			$('.equip select',thisItem).trigger('chosen:updated');
		}
	}
	populateInventorySelect();
}
//Add a blank artifact, unless variables are parsed
function addArtifact(spellID,itemName,itemEffect) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !itemName ) itemName = "";
	if ( !itemEffect ) itemEffect = "";
	var artifactToAdd =
		'<tr class="item"' + spellID + '>' +
			'<td class="arrow mobile-handle"></td>' +
			'<td class="name">' +
				'<div class="editable" contenteditable="true">' + itemName + '</div>' +
			'</td>' +
			'<td class="effect">' +
				'<div class="mobile-label">Effect:</div>' +
				'<div class="editable" contenteditable="true">' + itemEffect + '</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(artifactToAdd).insertAfter('#artifacts table tr:first-child');
	else artifactsList.append(artifactToAdd);
}
//Populate all of the active item select fields
function populateCyberwareSelect() {
	$('#cyberware .type select').chosen({
		disable_search: true,
		placeholder_text_single: "Select one",		
		width: "fit-content"
	});
}
//Add a blank cyberware, unless variables are parsed
function addCyberware(spellID,bodyPart,cyberwareFunction,cyberwareType) {
	var contentEditable;
	var disabledSelect;
	if ( spellID ) {
		spellID = ' data-spellid="' + spellID + '"';
		contentEditable = false;
	} else {
		spellID = "";
		contentEditable = true;
	}
	if ( !cyberwareFunction ) cyberwareFunction = "";
	var cyberwareToAdd =
		'<div class="cyberware ' + bodyPart.replace('-cyberware','') + '"' + spellID + '>' +
			'<div class="function">' +
				'<div class="cyber-label"><span class="blue-text">run</span> <span class="yellow-text">$</span>FUNCTION.<span class="red-text">exec</span><span class="mobile-handle">&#9776;</span></div>' +
				'<div class="text-wrapper">' +
					'<div contenteditable="true" class="editable">' + cyberwareFunction + '</div>' +
				'</div>' +
			'</div>' +
			'<div class="type">' +
				'<div class="cyber-label"><span class="blue-text">var</span> TYPE =</div>' +
				'<div class="text-wrapper">' +
					'<select>' +
						'<option></option>' +
						'<option value="WE">"Weapon"</option>' +
						'<option value="UT">"Utility"</option>' +
					'</select>' +
				'</div>' +
			'</div>' +
		'</div>';
	$(cyberwareToAdd).appendTo($('#' + bodyPart)).stop().slideToggle({
		duration: 300,
		complete: function() {
			$(this).css('min-height','75px');
		}
	});
	if ( cyberwareFunction && cyberwareType ) {
		var thisCyberware = $('.cyberware .editable:contains("' + cyberwareFunction + '")').closest('.cyberware');
		$('.type select', thisCyberware).val(cyberwareType);
		$('.type select', thisCyberware).trigger('chosen:updated');
	}
	populateCyberwareSelect();
}
//Add a blank note, unless variables are parsed
function addNote(spellID,note) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !note ) note = "";
	var noteToAdd =
		'<tr class="item"' + spellID + '>' +
			'<td class="arrow mobile-handle hide-me"></td>' +
			'<td class="note">' +
				'<img class="pin mobile-handle" src="images/note-pin.png" />' +
				'<div class="editable" contenteditable="true">' + note + '</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(noteToAdd).insertAfter('#notes table tr:first-child');
	else notesList.append(noteToAdd);
}
//Populate dropdown for the contact type
function populateContactSelect() {
	$('#contacts .type select').chosen({
		disable_search: true,
		width: "fit-content"
	});
}
//Add a blank skill, unless variables are parsed
function addContact(spellID,contactName,contactDescription,contactSkill,contactType) {
	if ( spellID ) spellID = ' data-spellid="' + spellID + '"';
	else spellID = "";
	if ( !contactName ) contactName = "";
	if ( !contactDescription ) contactDescription = "";
	if ( !contactSkill ) contactSkill = "";
	var contactToAdd =
		'<tr class="item"' + spellID + '>' +
			'<td class="arrow mobile-handle"></td>' +
			'<td class="type">' +
				'<select>' +
					'<option selected value="CT">Contact</option>' +
					'<option value="CP">Companion</option>' +
					'<option value="OT">Other</option>' +
				'</select>' +
			'</td>' +
			'<td class="name">' +
				'<div class="editable" contenteditable="true">' + contactName + '</div>' +
			'</td>' +
			'<td class="effect">' +
				'<div class="mobile-label">Description:</div>' +
				'<div class="editable" contenteditable="true">' + contactDescription + '</div>' +
			'</td>' +
			'<td class="effect skill">' +
				'<div class="mobile-label">Skill:</div>' +
				'<div class="editable" contenteditable="true">' + contactSkill + '</div>' +
			'</td>' +
		'</tr>';
	if ( spellID ) $(contactToAdd).insertAfter('#contacts table tr:first-child');
	else contactList.append(contactToAdd);
	populateContactSelect();
	if ( contactName && contactType ) {
		var thisContact = $('.name .editable:contains("' + contactName + '")').closest('.item');
		$('.type select', thisContact).val(contactType);
		$('.type select', thisContact).trigger('chosen:updated');
	}
	populateInventorySelect();
}
function arrangeSpells() {
	if ( !isTouchDevice() ) {
		//Split Actions into columns of 10 or less
		if ( $('.spell', actionsSection).length >= 30 && $(window).width() >= 1000 ) {
			actionsSection.css('grid-template-columns', '1fr 1fr 1fr 1fr');
			actionsSection.closest('item-list').css('width', '100%');
		} else if ( $('.spell', actionsSection).length >= 20 && $(window).width() >= 800 ) {
			actionsSection.css('grid-template-columns', '1fr 1fr 1fr');
			if ( $(window).width() <= 1000 ) actionsSection.closest('item-list').css('width', '100%');
		} else if ( $('.spell', actionsSection).length >= 10 && $(window).width() >= 637 ) {
			actionsSection.css('grid-template-columns', '1fr 1fr');
			if ( $(window).width() <= 800 ) actionsSection.closest('item-list').css('width', '100%');
		} else {
			actionsSection.css('grid-template-columns', '1fr');
		}
		//Split Talents into columns of 5 or less
		if ( $('.spell', talentsSection).length >= 30 && $(window).width() >= 1000 ) talentsSection.css('grid-template-columns', '1fr 1fr 1fr 1fr');
		else if ( $('.spell', talentsSection).length >= 20 && $(window).width() >= 800 ) talentsSection.css('grid-template-columns', '1fr 1fr 1fr');
		else if ( $('.spell', talentsSection).length >= 10 && $(window).width() >= 637 ) talentsSection.css('grid-template-columns', '1fr 1fr');
		else talentsSection.css('grid-template-columns', '1fr');
		//Split Status Effects into columns of 5 or less
		if ( $('.status-effect', statusSection).length >= 30 && $(window).width() >= 1000 ) statusSection.css('grid-template-columns', '1fr 1fr 1fr 1fr');
		else if ( $('.status-effect', statusSection).length >= 20 && $(window).width() >= 800 ) statusSection.css('grid-template-columns', '1fr 1fr 1fr');
		else if ( $('.status-effect', statusSection).length >= 10 && $(window).width() >= 637 ) statusSection.css('grid-template-columns', '1fr 1fr');
		else statusSection.css('grid-template-columns', '1fr');
	//If touch device, just one column to avoid tooltips
	//moving stuff around too much
	} else {
		actionsSection.css('grid-template-columns', '1fr');
		talentsSection.css('grid-template-columns', '1fr');
		statusSection.css('grid-template-columns', '1fr');
	}
}
//Save function
function saveSheet() {
	base('Sheets').select({
		view: 'Grid view',
		filterByFormula: "{id} = '" + $('#sheet-id').val() + "'"
	}).eachPage(function page(records, fetchNextPage) {
		records.forEach(function(record) {
			recordID = record.id;
		});
		fetchNextPage();
	}, function done(err) {
		if (err) { console.error(err); return; }
		var isHybrid = "false";
		var feelingsLogic = "";
		var magicTech = "";
		var skillsArray = [];
		var itemNames = [];
		var itemIDs = [];
		var itemStates = [];
		var itemTypes = [];
		var itemCosts = [];
		var artifactNames = [];
		var artifactIDs = [];
		var artifactEffects = [];
		var contactNames = [];
		var contactIDs = [];
		var contactTypes = [];
		var contactDescriptions = [];
		var contactSkills = [];
		var cyberwareBodyParts = [];
		var cyberwareIDs = [];
		var cyberwareTypes = [];
		var cyberwareDescriptions = [];
		var notesArray = [];
		var noteIDs = [];
		if ( $('#hybrid-button div').hasClass('clicked') ) isHybrid = "true";
		else isHybrid = "false";
		if ( $('#logic-feelings .selected').length > 0 ) feelingsLogic = $('#logic-feelings .selected').attr('data-number');
		else feelingsLogic = "unset";
		if ( $('#magic-tech .selected').length > 0 ) magicTech = $('#magic-tech .selected').attr('data-number');
		else magicTech = "unset";
		//Building skills array
		$('#skills .spell:not([data-default])').each( function() {
			skillsArray.push($('.name',this).text());
		});
		if ( skillsArray.length < 1 ) skillsArray = "";
		else skillsArray = skillsArray.join('¬');
		//Building items arrays
		$('#equipment .item .name .editable').each( function() {
			itemNames.push($(this).text());
		});
		$('#equipment .item').each( function() {
			if ( $(this).attr('data-spellid') ) itemIDs.push($(this).attr('data-spellid'));
			else itemIDs.push('');
		});
		$('#equipment .item .equip select').each( function() {
			itemStates.push($(this).val());
		});
		$('#equipment .item .type select').each( function() {
			itemTypes.push($(this).val());
		});
		$('#equipment .item .value select').each( function() {
			itemCosts.push($(this).val());
		});
		if ( itemNames.length < 1 ) {
			itemNames = "";
			itemIDs = "";
			itemStates = "";
			itemTypes = "";
			itemCosts = "";
		} else {
			itemNames = itemNames.join('¬');
			itemIDs = itemIDs.join('¬');
			itemStates = itemStates.join('¬');
			itemTypes = itemTypes.join('¬');
			itemCosts = itemCosts.join('¬');
		}
		//Building artifacts arrays
		$('#artifacts .item .name .editable').each( function() {
			artifactNames.push($(this).text());
		});
		$('#artifacts .item').each( function() {
			if ( $(this).attr('data-spellid') ) artifactIDs.push($(this).attr('data-spellid'));
			else artifactIDs.push('');
		});
		$('#artifacts .item .effect .editable').each( function() {
			artifactEffects.push($(this).text());
		});
		if ( artifactNames.length < 1 ) {
			artifactNames = "";
			artifactIDs = "";
			artifactEffects = "";
		} else {
			artifactNames = artifactNames.join('¬');
			artifactIDs = artifactIDs.join('¬');
			artifactEffects = artifactEffects.join('¬');
		}
		//Building cyberware arrays
		$('.cyberware .editable').each( function() {
			cyberwareDescriptions.push($(this).text());
		});
		$('.cyberware').each( function() {
			var thisBodyPart = $(this).attr('class').replace('cyberware','').replace(/\s/g,'');
			cyberwareBodyParts.push(thisBodyPart);
			if ( $(this).attr('data-spellid') ) cyberwareIDs.push($(this).attr('data-spellid'));
			else cyberwareIDs.push('');
		});
		$('.cyberware .type select').each( function() {
			cyberwareTypes.push($(this).val());
		});
		if ( cyberwareDescriptions.length < 1 ) {
			cyberwareDescriptions = "";
			cyberwareIDs = "";
			cyberwareTypes = "";
			cyberwareBodyParts = "";
		} else {
			cyberwareDescriptions = cyberwareDescriptions.join('¬');
			cyberwareIDs = cyberwareIDs.join('¬');
			cyberwareTypes = cyberwareTypes.join('¬');
			cyberwareBodyParts = cyberwareBodyParts.join('¬');
		}
		//Building contacts arrays
		$('#contacts .item .name .editable').each( function() {
			contactNames.push($(this).text());
		});
		$('#contacts .item').each( function() {
			if ( $(this).attr('data-spellid') ) contactIDs.push($(this).attr('data-spellid'));
			else contactIDs.push('');
		});
		$('#contacts .item .type select').each( function() {
			contactTypes.push($(this).val());
		});
		$('#contacts .item .effect:not(.skill) .editable').each( function() {
			contactDescriptions.push($(this).text());
		});
		$('#contacts .item .skill .editable').each( function() {
			contactSkills.push($(this).text());
		});
		if ( contactNames.length < 1 ) {
			contactNames = "";
			contactIDs = "";
			contactTypes = "";
			contactDescriptions = "";
			contactSkills = "";
		} else {
			contactNames = contactNames.join('¬');
			contactIDs = contactIDs.join('¬');
			contactTypes = contactTypes.join('¬');
			contactDescriptions = contactDescriptions.join('¬');
			contactSkills = contactSkills.join('¬');
		}
		//Building notes arrays
		$('#notes .item .editable').each( function() {
			notesArray.push($(this).text());
		});
		$('#notes .item').each( function() {
			if ( $(this).attr('data-spellid') ) noteIDs.push($(this).attr('data-spellid'));
			else noteIDs.push('');
		});
		if ( notesArray.length < 1 ) {
			notesArray = "";
			noteIDs = "";
		} else {
			notesArray = notesArray.join('¬');
			noteIDs = noteIDs.join('¬');
		}
		base('Sheets').update([
		{
			"id": recordID,
			"fields": {
				"id": $('#sheet-id').val(),
				"name": $('#name').val(),
				"descriptor": $('#descriptors').val(),
				"species": $('#species').val(),
				"hybrid": isHybrid,
				"secondary-species": $('#secondary-species').val(),
				"type": $('#types').val(),
				"focus": $('#foci').val(),
				"secondary-focus": $('#secondary-foci').val(),
				"feelings-logic": feelingsLogic,
				"magic-tech": magicTech,
				"tier": $('#current-tier').text(),
				"xp": $('#xp-number').text(),
				"skills": skillsArray,
				"items": itemNames,
				"item-ids": itemIDs,
				"item-states": itemStates,
				"item-types": itemTypes,
				"item-costs": itemCosts,
				"artifacts": artifactNames,
				"artifact-ids": artifactIDs,
				"artifact-effects": artifactEffects,
				"contacts": contactNames,
				"contact-ids": contactIDs,
				"contact-types": contactTypes,
				"contact-descriptions": contactDescriptions,
				"contact-skills":contactSkills,
				"cyberwares": cyberwareDescriptions,
				"cyberware-ids": cyberwareIDs,
				"cyberware-types": cyberwareTypes,
				"cyberware-bodyparts": cyberwareBodyParts,
				"notes": notesArray,
				"note-ids": noteIDs
			}
		}
		], function (err) {	if (err) { console.error(err); return; }
		});
	});
}
//Autosave function for character sheet
function autoSave() {
	saveInterval = setInterval( function() { saveSheet(); }, 5000);
}
//Load character sheet function
function loadCharaSheet(sheetID,autoLoad) {
	var sheetList = [];
	var recordID;
	base('Sheets').select({
		view: 'Grid view',
		filterByFormula: "{id} = '" + sheetID + "'"
	}).eachPage(function page(records, fetchNextPage) {
		records.forEach(function(record) {
			recordID = record.id;
			sheetList.push(recordID);
		});
		fetchNextPage();
	}, function done(err) {
		if (err) { console.error(err); return; }
		if ( sheetList.length > 0 ) {
			base('Sheets').find(recordID, function(err, record) {
				if (err) { console.error(err); return; }
				var confirmDialog;
				if (autoLoad) confirmDialog = true;
				else confirmDialog = confirm('Load previously saved character sheet?');
				if (confirmDialog) {
					var doubleConfirm; 
					if (autoLoad) doubleConfirm = true;
					else doubleConfirm = confirm('Note: loading an existing character sheet will erase all information you entered on the current character sheet! Are you sure you want to proceed?');
					if (doubleConfirm) {
						$('#name').val(record.get('name'));
						$('#descriptors').val(record.get('descriptor'));
						$('#descriptors').trigger('chosen:updated');
						$('#species').val(record.get('species'));
						$('#secondary-species').val(record.get('secondary-species'));
						$('#types').val(record.get('type'));
						$('#foci').val(record.get('focus'));
						$('#secondary-foci').val(record.get('secondary-focus'));
						if ( record.get('tier') ) {
							curTier = record.get('tier');
							$('#current-tier').text(curTier);
						}
						if ( record.get('xp') ) $('#xp-number').text(record.get('xp'));
						curXP = parseInt(xpNumber.text().replace(' XP', ''));
						if ( curXP === (90 - ((parseInt($('#current-tier').text()) - 1) * 16)) ) xpUpButton.addClass('disabled');
						else xpUpButton.removeClass('disabled');
						if ( curXP >= 16 && nextTierButton.is(':hidden') ) nextTierButton.slideToggle(150);
						if ( curXP === 0 ) xpDownButton.addClass('disabled');
						else xpDownButton.removeClass('disabled');
						if ( curXP < 16 && nextTierButton.is(':visible') ) nextTierButton.slideToggle(150);
						if ( record.get('hybrid') === "true" ) {
							$('#hybrid-button div').addClass('clicked');
							if (hybridSection.is(':hidden')) {
								$('#character-attributes').addClass('with-sec-species');
								hybridSection.stop().slideToggle({
									duration: 300,
									done: function() {
										hybridSection.css('display','flex');
									}
								});
							} 
						} else {
							$('#hybrid-button div').removeClass('clicked');
							if (hybridSection.is(':visible')) {
								hybridSection.stop().slideToggle({
									duration: 300,
									done: function() {
										$('#character-attributes').removeClass('with-sec-species');
									}
								});
							}
						}
						//If user picks Forges a New Bond, show second focus
						if ( $('#foci').val() === "E2" && secFociSection.is(':hidden') ) {
							$('#character-attributes').addClass('with-sec-focus');
							if ($('#sec-focus-connector').is(':hidden')) $('#sec-focus-connector').stop().slideToggle(300);
							secFociSection.stop().slideToggle({
								duration: 300,
								done: function() {
									secFociSection.css('display','flex');
								}
							});
						} else if ( $('#foci').val() === "E2" && secFociSection.is(':visible') ) {
							if ($('#sec-focus-connector').is(':visible')) $('#sec-focus-connector').stop().slideToggle(300);
							secFociSection.stop().slideToggle({
								duration: 300,
								done: function() {
									$('#character-attributes').removeClass('with-sec-focus');
								}
							});
						}
						//If "Has More Money Than Sense" focus is selected
						if ( $('#foci').val() === "E8" || $('#secondary-foci').val() === "E8" ) {
							$('#descriptors option[value="M7"]').prop('disabled', true);
							descriptors.trigger('chosen:updated');
						} else {
							$('#descriptors option[value="M7"]').prop('disabled', false);
							descriptors.trigger('chosen:updated');
						}
						if ( record.get('feelings-logic') === "unset" ) {
							$('#logic-feelings .dice-number:not(.blocked)').removeClass('disabled');
							$('#logic-feelings .dice-number').removeClass('selected');
							$('#logic-feelings .dice h3').removeAttr('style');
							$('#logic-feelings .pre-selection').show();
							$('#logic-feelings .after-selection').hide();
						} else if ( record.get('feelings-logic') ) {
							var diceNumber = record.get('feelings-logic');
							$('#logic-feelings .dice-number').removeClass('selected disabled');
							$('#logic-feelings .dice-number[data-number="' + diceNumber + '"]').addClass('selected');
							$('#logic-feelings .dice-number').not('.selected').addClass('disabled');
							$('.logic-feelings-number').text(diceNumber);
							$('#logic-feelings h3:first-child').css('order','3');
							$('#logic-feelings h3:last-child').css('order','1');
							$('#logic-feelings .after-selection').show();
							$('#logic-feelings .pre-selection').hide();
						}
						if ( record.get('feelings-logic') === "unset" ) {
							$('#magic-tech .dice-number:not(.blocked)').removeClass('disabled');
							$('#magic-tech .dice-number').removeClass('selected');
							$('#magic-tech .dice h3').removeAttr('style');
							$('#magic-tech .pre-selection').show();
							$('#magic-tech .after-selection').hide();
						} else if ( record.get('feelings-logic') ) {
							var diceNumber = record.get('magic-tech');
							$('#magic-tech .dice-number').removeClass('selected disabled');
							$('#magic-tech .dice-number[data-number="' + diceNumber + '"]').addClass('selected');
							$('#magic-tech .dice-number').not('.selected').addClass('disabled');
							$('.magic-tech-number').text(diceNumber);
							$('#magic-tech h3:first-child').css('order','3');
							$('#magic-tech h3:last-child').css('order','1');
							$('#magic-tech .after-selection').show();
							$('#magic-tech .pre-selection').hide();
						}
						populateSpecies();
						populateTypes();
						populateFoci();
						populateSpells();
						//Load skills
						if ( record.get('skills') ) {
							var skillsArray = record.get('skills').split('¬');
							var editableSkills = $('#skills .spell:not([data-default]) .name');
							for (var i = 0; i < editableSkills.length; i++) {
								if ( skillsArray[i] ) {
									var skillName = skillsArray[i];
									var newOrder = parseInt((parseInt(skillName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97) + leadZeros(parseInt(skillName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
									editableSkills.eq(i).text(skillName);
									editableSkills.eq(i).closest('.spell').css('order', newOrder);
								}
							}
						}
						//Load items
						if ( record.get('items') ) {
							$('#equipment .item').each( function() {
								$(this).remove();
							});
							var itemNames = record.get('items').split('¬');
							var itemStates = record.get('item-states').split('¬');
							var itemTypes = record.get('item-types').split('¬');
							var itemCosts = record.get('item-costs').split('¬');
							if ( record.get('item-ids') ) {
								var itemIDs = record.get('item-ids').split('¬');
								for (var i = 0; i < itemNames.length; i++) {
									addItem(itemIDs[i],itemNames[i],itemTypes[i],itemCosts[i],itemStates[i]);
								}
							} else {
								for (var i = 0; i < itemNames.length; i++) {
									addItem(undefined,itemNames[i],itemTypes[i],itemCosts[i],itemStates[i]);
								}
							}
						} else {
							$('#equipment .item').each( function() {
								$(this).remove();
							});
							addItem();
						}
						//Load artifacts
						if ( record.get('artifacts') ) {
							$('#artifacts .item').each( function() {
								$(this).remove();
							});
							var artifactNames = record.get('artifacts').split('¬');
							var artifactEffects = record.get('artifact-effects').split('¬');
							if ( record.get('artifact-ids') ) {
								var artifactIDs = record.get('artifact-ids').split('¬');
								for (var i = 0; i < artifactNames.length; i++) {
									addArtifact(artifactIDs[i],artifactNames[i],artifactEffects[i]);
								}
							} else {
								for (var i = 0; i < artifactNames.length; i++) {
									addArtifact(undefined,artifactNames[i],artifactEffects[i]);
								}
							}
						} else {
							$('#artifacts .item').each( function() {
								$(this).remove();
							});
							addArtifact();
						}
						//Load cyberware
						if ( record.get('cyberwares') ) {
							if ($('#cyberware').is(':hidden')) $('#cyberware').stop().slideToggle(300);
							enableCyberware.addClass('clicked');
							$('.cyberware').each( function() {
								$(this).remove();
							});
							$('#cyber-mannequin img').each( function() {
								var cyberwareBodyPart = $(this).attr('class');
								$(this).attr('src',  'images/cyber'+ cyberwareBodyPart + '.png');
							});
							var cyberwareDescriptions = record.get('cyberwares').split('¬');
							var cyberwareTypes = record.get('cyberware-types').split('¬');
							var cyberwareBodyParts = record.get('cyberware-bodyparts').split('¬');
							if ( record.get('cyberware-ids') ) {
								var cyberwareIDs = record.get('cyberware-ids').split('¬');
								for (var i = 0; i < cyberwareDescriptions.length; i++) {
									var cyberImage = $('#cyber-mannequin img.' + cyberwareBodyParts[i]);
									var cyberwareBodyPart = cyberwareBodyParts[i] + "-cyberware";
									addCyberware(cyberwareIDs[i],cyberwareBodyPart,cyberwareDescriptions[i],cyberwareTypes[i]);
									cyberImage.addClass('modded');
									cyberImage.attr('src',  'images/cyber'+ cyberwareBodyParts[i] + '-modded.png');
								}
							} else {
								for (var i = 0; i < cyberwareDescriptions.length; i++) {
									var cyberImage = $('#cyber-mannequin img.' + cyberwareBodyParts[i]);
									var cyberwareBodyPart = cyberwareBodyParts[i] + "-cyberware";
									addCyberware(undefined,cyberwareBodyPart,cyberwareDescriptions[i],cyberwareTypes[i]);
									cyberImage.addClass('modded active');
									cyberImage.attr('src',  'images/cyber'+ cyberwareBodyParts[i] + '-modded.png');
								}
							}
						} else {
							$('.cyberware').each( function() {
								$(this).remove();
							});
							$('#cyber-mannequin img').each( function() {
								$(this).removeClass('modded active');
								var cyberwareBodyPart = $(this).attr('class');
								$(this).attr('src',  'images/cyber'+ cyberwareBodyPart + '.png');
							});
						}
						//Load contacts
						if ( record.get('contacts') ) {
							$('#contacts .item').each( function() {
								$(this).remove();
							});
							var contactNames = record.get('contacts').split('¬');
							var contactTypes = record.get('contact-types').split('¬');
							var contactDescriptions = record.get('contact-descriptions').split('¬');
							var contactSkills = record.get('contact-skills').split('¬');
							if ( record.get('contact-ids') ) {
								var contactIDs = record.get('contact-ids').split('¬');
								for (var i = 0; i < contactNames.length; i++) {
									addContact(contactIDs[i],contactNames[i],contactDescriptions[i],contactSkills[i],contactTypes[i]);
								}
							} else {
								for (var i = 0; i < contactNames.length; i++) {
									addContact(undefined,contactNames[i],contactDescriptions[i],contactSkills[i],contactTypes[i]);
								}
							}
						} else {
							$('#contacts .item').each( function() {
								$(this).remove();
							});
							addContact();
						}
						//Load notes
						if ( record.get('notes') ) {
							$('#notes .item').each( function() {
								$(this).remove();
							});
							var notesArray = record.get('notes').split('¬');
							if ( record.get('note-ids') ) {
								var noteIDs = record.get('note-ids').split('¬');
								for (var i = 0; i < notesArray.length; i++) {
									addNote(noteIDs[i],notesArray[i]);
								}
							} else {
								for (var i = 0; i < notesArray.length; i++) {
									addNote(undefined,notesArray[i]);
								}
							}
						} else {
							$('#notes .item').each( function() {
								$(this).remove();
							});
							addNote();
						}
						$('#sheet-id').addClass('loaded');
						$('#submit-sheet').addClass('disabled');
						$('#new-sheet').removeClass('disabled');
						$('#cancel-submit').addClass('disabled');
						if ( $('#disable-autosave').is(':checked') ) clearInterval(saveInterval);
						else autoSave();
						Cookies.set('sheetID',sheetID,{ expires: Infinity });
					}
				}
			});
		} else {
			Cookies.expire('sheetID');
			alert('Unable to find character sheet. Please try a different sheet name, or save the sheet instead.');
		}
	});
}
//Primary on load function
$(function() {
	popupError = $('#popup-error');
	descriptors = $('#descriptors');
	descriptorsOptions = $('#descriptors option');
	priSpecies = $('#species');
	secSpecies = $('#secondary-species');
	species = $('#species, #secondary-species');
	priSpeciesOptions = $('#species option');
	secSpeciesOptions = $('#secondary-species option');
	speciesOptions = $('#species option, #secondary-species option');
	types = $('#types');
	typesOptions = $('#types option');
	elementalistType = $('#types option[value="A3"]');
	genderFocusRow = $('#gender-focus');
	priFoci = $('#foci');
	secFoci = $('#secondary-foci');
	priFociOptions = $('#foci option');
	secFociOptions = $('#secondary-foci option');
	foci = $('#foci, #secondary-foci');
	fociOptions = $('#foci option, #secondary-foci option');
	secFociSection = $('#sec-focus-attribute');
	hybridSection = $('#sec-species-attribute');
	hybridButton = $('#hybrid-button div');
	hybridTooltip = $('#hybrid-tooltip');
	tierNumber = $('#current-tier');
	xpNumber = $('#xp-number');
	xpUpButton = $('#xp-up');
	xpDownButton = $('#xp-down');
	nextTierButton = $('#tier-button');
	magicTitle = $('#magic-title');
	magicTooltip = $('#magic-tooltip');
	techTitle = $('#tech-title');
	techTooltip = $('#tech-tooltip');
	logicTitle = $('#logic-title');
	logicTooltip = $('#logic-tooltip');
	feelingsTitle = $('#feelings-title');
	feelingsTooltip = $('#feelings-tooltip');
	resetButton = $('#reset-button');
	resetTooltip = $('#reset-tooltip');
	addSkillButton = $('#add-skill');
	spellBook = $('#spellbook');
	spellbookButton = $('#open-spellbook');
	filterButtons = $('.filters .button');
	loreButton = $('#open-archives');
	enableCyberware = $('#enable-cyberware');
	cyberwareTooltip = $('#cyberware-tooltip');
	skillsSection = $('#skills');
	actionsSection = $('#actions');
	talentsSection = $('#talents');
	statusSection = $('#status');
	spellHotbars = $('.spell-list .hotbars');
	addCyberwareButton = $('.add-cyberware');
	cyberware = $('#cyberware');
	cyberError = $('#cyberware .error');
	cyberwareSection = $('#cyber-mods');
	cyberBodyParts = $('.cyber-section');
	cyberwareImages = $('#cyber-mannequin img');
	cyberwareDeleteSpace = $('#cyberware .delete-space');
	addItemButton = $('#add-item');
	inventoryList = $('#equipment table');
	inventoryBody = $('#equipment tbody');
	itemsDeleteSpace = $('#equipment .delete-space');
	addArtifactButton = $('#add-artifact');
	artifactsList = $('#artifacts table');
	artifactsBody = $('#artifacts tbody');
	artifactsDeleteSpace = $('#artifacts .delete-space');
	addContactButton = $('#add-contact');
	contactList = $('#contacts table');
	contactBody = $('#contacts tbody');
	contactDeleteSpace = $('#contacts .delete-space');
	addNoteButton = $('#add-note');
	notesList = $('#notes table');
	notesBody = $('#notes tbody');
	notesDeleteSpace = $('#notes .delete-space');
	firstDrag = true;
	randomNameButton = $('#random-name');
	periodCount = 0;
	Airtable = require('airtable');
	base = new Airtable({apiKey: 'keymlfH0gK5O3u0wp'}).base('appP3SrsrqcRFnoX7');
	//Initial variables
	curArc = 2;
	curTier = 1;
	curXP = 0;
	spellListDatabase = [];
	//Setup spell list database
	Papa.parse('/cypher-character-builder/databases/spell-list.csv', {
		header: true,
		download: true,
		complete: function(results) {
			spellListDatabase = results.data;
		}
	});
	//Set story arc to hide elements not in current arc
	setStoryArc(curArc);
	//Sort and then setup chosen.js dropdowns
	sortOptions(descriptors,descriptorsOptions);
	descriptors.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a descriptor",
		width: "100%"
	});
	sortOptions(priSpecies,priSpeciesOptions);
	priSpecies.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a species",
		width: "100%"
	});
	sortOptions(secSpecies,secSpeciesOptions);
	secSpecies.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a species",
		width: "100%"
	});
	sortOptions(types,typesOptions);
	types.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a type",
		width: "100%"
	});
	sortOptions(priFoci,priFociOptions);
	priFoci.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a focus",
		width: "100%"
	});
	sortOptions(secFoci,secFociOptions);
	secFoci.chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a focus",
		width: "100%"
	});
	$('#genders').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select gender(s)",
		width: "100%"
	});
	$('#sexuality').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select sexuality(ies)",
		width: "100%"
	});
	$('#mental-disabilities').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select disorder(s)",
		width: "100%"
	});
	$('#temperament').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select temperament(s)",
		width: "100%",
		max_selected_options: 2
	});
	$('#academic-pursuit').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select pursuit(s)",
		width: "100%"
	});
	$('#traveling').chosen({
		disable_search: true,
		width: "100%"
	});
	$('#dating').chosen({
		disable_search: true,
		width: "100%"
	});
	$('#partying').chosen({
		disable_search: true,
		width: "100%"
	});
	$('#reading').chosen({
		disable_search: true,
		width: "100%"
	});
	$('#flavours').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select flavour(s)",
		width: "100%"
	});
	$('#relationship-status').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select status(es)",
		width: "100%"
	});
	$('#blood-type').chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select a blood type",
		width: "100%"
	});
	$('#mbti').chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select an MBTI type",
		width: "100%"
	});
	$('#virtue-alignment').chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select an alignment",
		width: "100%"
	});
	$('#order-alignment').chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select an alignment",
		width: "100%"
	});
	$('#enneagram').chosen({
		no_results_text: "No results found.",
		placeholder_text_single: "Select an Enneagram type",
		width: "100%"
	});
	$('#religion').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select belief(s)",
		width: "100%"
	});
	$('#sins').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select sin(s)",
		width: "100%"
	});
	$('#humour').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select type(s) of humour",
		width: "100%"
	});
	$('#vices').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select vice(s)",
		width: "100%"
	});
	$('#criminal-record').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select crime(s)",
		width: "100%"
	});
	$('#patron').chosen({
		no_results_text: "No results found.",
		placeholder_text_multiple: "Select celestial patron(s)",
		width: "100%"
	});
	//Auto resize textareas to work like editable content
	$('textarea').autogrow({vertical: true, horizontal: false});
	$('textarea').on('input', function() {
		var inputValue = $(this).val();
		var inputBorder = $(this).closest('.border');
		var borderHeight = $(this).height() + 10 + "px";
		if ( inputValue ) inputBorder.css('height', borderHeight);
		else inputBorder.css('height','29px');
	});
	//Populate inventory & skills select dropdowns
	//and initate drag and drop
	populateCyberwareSelect();
	populateInventorySelect();
	populateContactSelect();
	//Autoload sheet if accessing from existing device
	if ( Cookies.get('sheetID') ) {
		setTimeout( function() {
			$('#sheet-id').val(Cookies.get('sheetID'));
			$('#sheet-header').removeClass('toggled');
			$('#load-sheet-toggle').html('&#128447;');
			$('#load-sheet-toggle').removeClass('toggled');
			loadCharaSheet(Cookies.get('sheetID'),true);
		}, 1000);
	}
	//Cyberware Dragula
	var cyberwareDrake = dragula([cyberwareDeleteSpace[0]],{
			isContainer: function(el) {
				return el.classList.contains('cyber-section');
			}, moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}, accepts: function (el,target,source,sibling) {
				if ( target.classList.contains('cyber-section') && target != source ) return false;
				else if ( el.hasAttribute('data-spellid') && target.classList.contains('delete-space') ) return false;
				else if ( sibling === null || sibling.classList.contains('cyberware') ) return true;
			}
		}).on('drag', function(el,source) {
			if ( el.hasAttribute('data-spellid') && cyberError.is(':visible') == false ) {
				cyberError.text('Cyberware granted by character attributes cannot be removed');
				cyberError.stop().slideToggle(150);
			} else {
				cyberwareDeleteSpace.stop().slideToggle(150);
			}
			if ( firstDrag ) firstDrag = false;
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				cyberwareDeleteSpace.stop().animate({
					'height' : $('.gu-transit').height
				}, 150);
				cyberwareDeleteSpace.css('margin-top', String(parseInt($('.gu-transit').css('height').replace('px','')) + 40) + 'px');
			} else {
				cyberwareDeleteSpace.stop().animate({
					'height' : '185px'
				}, 150);
				cyberwareDeleteSpace.css('margin-top', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				cyberwareDrake.remove();
				var bodyPart = el.classList[1];
				var emptyMods = 0;
				for (var i = 0; i < $('.cyberware.' + bodyPart).length; i++) {
					emptyMods++;
				}
				if ( !emptyMods ) $('#cyber-mannequin img.' + bodyPart).removeClass('modded');
				if ( isTouchDevice() && $('.cyberware').length === 0 ) $('#cyberware-option em').hide();
			}
			if ( cyberError.is(':visible') ) cyberError.stop().slideToggle(300);			
			else if ( cyberwareDeleteSpace.is(':visible') ){
				cyberwareDeleteSpace.stop().animate({
					'margin-top' : '10px',
					'height' : '185px'
				}, 100, function() {
					$(this).css('height','');
					$(this).stop().slideToggle(200);
				});
			}
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			if ( cyberError.is(':visible') ) cyberError.stop().slideToggle(300);
			else if ( cyberwareDeleteSpace.is(':visible') ) {
				cyberwareDeleteSpace.stop().animate({
					'height' : '185px'
				}, 100, function() {
					$(this).css('height','');
					$(this).stop().slideToggle(200);
				});
			}
			firstDrag = true;
		});
	cyberwareDrake;
	//Inventory Dragula
	var itemsDrake = dragula([inventoryBody[0], itemsDeleteSpace[0]],{
			moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}
		}).on('drag', function(el,source) {
			itemsDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) firstDrag = false;
			if ( inventoryBody.children('tr:first-child').is(':visible') ) defaultContainerHeight = "31px";
			else defaultContainerHeight = "169px";
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				if ( inventoryBody.children('tr:first-child').is(':visible') ) {
					itemsDeleteSpace.stop().animate({
						'height' : $('.gu-transit').css('height')
					}, 150);
					inventoryList.css('padding-bottom', String(parseInt($('.gu-transit').css('height').replace('px','')) + 5) + 'px');
				} else {
					itemsDeleteSpace.stop().animate({
						'height' : String(parseInt($('.gu-transit').css('height').replace('px','')) - 20) + 'px'
					}, 150);
					if ( !isEven(inventoryBody.children().length) || addItemButton.css('width') == "40px" ) inventoryList.css('padding-bottom', $('.gu-transit').outerHeight(true) + 11);
					else inventoryList.css('padding-bottom', $('.gu-transit').outerHeight(true) - 208);
				}
			} else {
				itemsDeleteSpace.stop().animate({
					'height' : defaultContainerHeight
				}, 150);
				inventoryList.css('padding-bottom', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 1 ) {
						addItem();
						inventoryList.removeAttr('style');
				} else {
					inventoryList.stop().animate({
						'padding-bottom' : '0'
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				itemsDrake.remove();
			} else {
				inventoryList.removeAttr('style');
			}
			itemsDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			itemsDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		});
	itemsDrake;
	//Artifacts Dragula
	var artifactsDrake = dragula([artifactsBody[0], artifactsDeleteSpace[0]],{
			moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}
		}).on('drag', function(el,source) {
			artifactsDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) firstDrag = false;
			if ( artifactsBody.children('tr:first-child').is(':visible') ) defaultContainerHeight = "31px";
			else defaultContainerHeight = "76px";
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				if ( artifactsBody.children('tr:first-child').is(':visible') ) {
					artifactsDeleteSpace.stop().animate({
						'height' : $('.gu-transit').css('height')
					}, 150);
					artifactsList.css('padding-bottom', String(parseInt($('.gu-transit').css('height').replace('px','')) + 5) + 'px');
				} else {
					itemsDeleteSpace.stop().animate({
						'height' : String(parseInt($('.gu-transit').css('height').replace('px','')) - 20) + 'px'
					}, 150);
					if ( !isEven(artifactsBody.children().length) || addArtifactButton.css('width') == "40px" ) artifactsList.css('padding-bottom', $('.gu-transit').outerHeight(true) + 11);
					else artifactsList.css('padding-bottom', $('.gu-transit').outerHeight(true) - 208);
				}
			} else {
				artifactsDeleteSpace.stop().animate({
					'height' : defaultContainerHeight
				}, 150);
				artifactsList.css('padding-bottom', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 1 ) {
						addArtifact();
						artifactsList.removeAttr('style');
				} else {
					artifactsList.stop().animate({
						'padding-bottom' : '0'
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				artifactsDrake.remove();
			} else {
				artifactsList.removeAttr('style');
			}
			artifactsDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			artifactsDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		});
	artifactsDrake;
	//Contacts Dragula
	var contactDrake = dragula([contactBody[0], contactDeleteSpace[0]],{
			moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}
		}).on('drag', function(el,source) {
			contactDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) firstDrag = false;
			if ( contactBody.children('tr:first-child').is(':visible') ) defaultContainerHeight = "31px";
			else defaultContainerHeight = "161px";
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				if ( contactBody.children('tr:first-child').is(':visible') ) {
					contactDeleteSpace.stop().animate({
						'height' : $('.gu-transit').css('height')
					}, 150);
					contactList.css('padding-bottom', String(parseInt($('.gu-transit').css('height').replace('px','')) + 5) + 'px');
				} else {
					itemsDeleteSpace.stop().animate({
						'height' : String(parseInt($('.gu-transit').css('height').replace('px','')) - 20) + 'px'
					}, 150);
					if ( !isEven(contactBody.children().length) || addContactButton.css('width') == "40px" ) contactList.css('padding-bottom', $('.gu-transit').outerHeight(true) + 11);
					else contactList.css('padding-bottom', $('.gu-transit').outerHeight(true) - 208);
				}
			} else {
				contactDeleteSpace.stop().animate({
					'height' : defaultContainerHeight
				}, 150);
				contactList.css('padding-bottom', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 1 ) {
						addContact();
						contactList.removeAttr('style');
				} else {
					contactList.stop().animate({
						'padding-bottom' : '0'
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				contactDrake.remove();
			} else {
				contactList.removeAttr('style');
			}
			contactDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			contactDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		});
	contactDrake;
	//Notes Dragula
	var notesDrake = dragula([notesBody[0], notesDeleteSpace[0]],{
			moves: function(el,container,handle) {
				return handle.classList.contains('mobile-handle');
			}
		}).on('drag', function(el,source) {
			notesDeleteSpace.stop().slideToggle(150);
			if ( firstDrag ) firstDrag = false;
			if ( notesBody.children('tr:first-child').is(':visible') ) defaultContainerHeight = "31px";
			else defaultContainerHeight = "38px";
		}).on('shadow', function(el,container,source) {
			if ( container.classList.contains('delete-space') ) {
				notesDeleteSpace.stop().animate({
					'height' : $('.gu-transit').css('height')
				}, 150);
				if ( notesBody.children('tr:first-child').is(':visible') ) {
					notesList.css('padding-bottom', String(parseInt($('.gu-transit').css('height').replace('px','')) + 5) + 'px');
				} else {
					notesList.css('padding-bottom', $('.gu-transit').outerHeight(true));
				}
			} else {
				notesDeleteSpace.stop().animate({
					'height' : defaultContainerHeight
				}, 150);
				notesList.css('padding-bottom', '');
			}
		}).on('drop', function(el,target,source,sibling) {
			if ( target.classList.contains('delete-space') ) {
				if ( source.children.length === 1 ) {
						addNote();
						notesList.removeAttr('style');
				} else {
					notesList.stop().animate({
						'padding-bottom' : '0'
					}, 300, function() {
						$(this).removeAttr('style');
					});
				}
				notesDrake.remove();
			} else {
				notesList.removeAttr('style');
			}
			notesDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		}).on('cancel', function(el,container,source) {
			notesDeleteSpace.stop().animate({
				'height' : defaultContainerHeight
			}, 100, function() {
				$(this).css('height','');
				$(this).stop().slideToggle(200);
			});
			firstDrag = true;
		});
	notesDrake;
	//Close error pop-up if OK button is clicked
	$('.button', popupError).click( function() {
		popupError.stop().slideToggle(300);
	});
	//[H] button to show or hide secondary species dropdown and reset its value
	hybridButton.click(function(){
		var priSpeciesVal = priSpecies.val();
		$(this).toggleClass('clicked');
		if (hybridSection.is(':hidden')) $('#character-attributes').addClass('with-sec-species');
		hybridSection.stop().slideToggle({
			duration: 300,
			done: function() {
				if (hybridSection.is(':visible')) hybridSection.css('display','flex');
				else $('#character-attributes').removeClass('with-sec-species');
			}
		});
		secSpecies.val('');
		populateSpecies();
		populateTypes();
		populateFoci();
		populateSpells();
	});
	//Reset button to reset all values and hide extra sections
	//Does not affect hybrid toggle
	resetButton.click(function(){
		availSpellCount = 4;
		selectedSpellCount = 0;
		descriptors.val('');
		priSpecies.val('');
		secSpecies.val('');
		types.val('');
		priFoci.val('');
		secFoci.val('');
		secFociSection.stop().hide();
		descriptors.trigger('chosen:updated');
		setStoryArc(curArc);
		populateSpecies();
		populateTypes();
		populateFoci();
		$('.selected', spellBook).removeClass('selected');
		populateSpells();
		loreButton.text('Lore');
		spellbookButton.text('Abilities');
		filterButtons.addClass('clicked');
		$('.dice-number:not(.blocked)').removeClass('disabled');
		$('.dice-number').removeClass('selected');
		$('.dice h3').removeAttr('style');
		$('.pre-selection').show();
		$('.after-selection').hide();
		randomNameButton.hide();
	});
	//Populate relevant lists each time the select list is interacted
	//with, populate spells, and show the reset button
	descriptors.on('change', function() {
		populateFoci();
		populateSpells();
	});
	species.on('change', function() {
		populateSpecies();
		populateTypes();
		populateFoci();
		populateSpells();
		loreButton.text('New Lore');
		randomNameButton.css('display','flex');
	});
	types.on('change', function() {
		populateSpecies();
		populateFoci();
		populateSpells();
		loreButton.text('New Lore');
	});
	foci.on('change', function() {
		var curFocus = priFoci.val();
		//If user picks Forges a New Bond, show second focus
		if ( curFocus == "E2" && $(this).attr('id') == "foci" ) {
			$('#character-attributes').addClass('with-sec-focus');
			$('#sec-focus-connector').stop().slideToggle(300);
			secFociSection.stop().slideToggle({
				duration: 300,
				done: function() {
					secFociSection.css('display','flex');
				}
			});
		} else if ( $(this).attr('id') == "foci" && secFociSection.is(':visible') ) {
			secFoci.val('');
			$('#sec-focus-connector').stop().slideToggle(300);
			secFociSection.stop().slideToggle({
				duration: 300,
				done: function() {
					$('#character-attributes').removeClass('with-sec-focus');
				}
			});
		}
		//If "Has More Money Than Sense" focus is selected
		if ( curFocus === "E8" || secFoci.val() === "E8" ) {
			$('#descriptors option[value="M7"]').prop('disabled', true);
			descriptors.trigger('chosen:updated');
		} else {
			$('#descriptors option[value="M7"]').prop('disabled', false);
			descriptors.trigger('chosen:updated');
		}
		populateSpecies();
		populateTypes();
		populateFoci();
		populateSpells();
	});
	//Toggle optional character options
	$('#open-options').click( function() {
		$('#character-options').stop().slideToggle({
			duration: 300, 
			start: function() {
				$(this).css('display', 'flex');
			}
		});
	});
	//Show cyberware section tracker
	//but only when no cyberware is installed
	enableCyberware.click( function() {
		if ( $('.cyberware').length === 0 ) {
			$(this).toggleClass('clicked');
			cyberware.stop().slideToggle(500);
		}
	});
	//Focus editable div fields when clicking on outter cells
	$('.item-list, #skills, #cyberware').on('click', 'td, div.spell, div.text-wrapper', function() {
		$('.editable', this).focus();
	});
	//Re-order skills on focus loss
	$('#skills').on('blur', '.editable', function() {
		var skillName = $(this).html();
		var newOrder = parseInt((parseInt(skillName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(0)) - 97) + leadZeros(parseInt(skillName.replace(/[^A-Za-z0-9_]/g,'').replace(/\s+/g,'').toLowerCase().charCodeAt(1)) - 97,2));
		$(this).closest('.spell').css('order', newOrder);
	});
	//Add skills when respective button is clicked
	addSkillButton.click( function() { addSkill(); });
	//Add notes and items when respective button is clicked
	addItemButton.click( function() { addItem(); });
	addArtifactButton.click( function() { addArtifact(); });
	addContactButton.click( function() { addContact(); });
	addNoteButton.click( function() { addNote(); });
	addCyberwareButton.click( function() { 
		var bodyPart = $(this).closest('.cyber-section').attr('id').replace('-cyberware','');
		addCyberware(undefined,$(this).closest('.cyber-section').attr('id'));
		$('#cyber-mannequin img.' + bodyPart).addClass('modded');
		if ( isTouchDevice() ) $('#cyberware-option em').show();
	});	
	statusSection.on('click', '.status-effect', function() {
		$(this).toggleClass('active');
	});
	//Filter inputs for value fields
	$('.item-list').on('keydown blur paste', '.value .editable', function(e){
		var thisVal = $(this).html();
		var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
        var isCursorMoveOrDeleteAction = ([116,9,46,8,37,38,39,40].indexOf(e.keyCode) != -1);
        var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >=96 && e.keyCode <= 105);
        var vKey = 86, cKey = 67, aKey = 65;
		var isPeriodKey = [190].indexOf(e.keyCode) != -1;
		periodCount = 0;
		for (i = 0; i < thisVal.length; i++) {
			if (thisVal[i] == ".") periodCount++;
		}
		var onePeriod = periodCount === 0;
        switch(true){
            case isCursorMoveOrDeleteAction:
            case isModifierkeyPressed == false && isNumKeyPressed:
            case (e.metaKey || e.ctrlKey) && ([vKey,cKey,aKey].indexOf(e.keyCode) != -1):
			case isPeriodKey && onePeriod:
                break;
            default:
                e.preventDefault();
        }
	});
	//Highlight currently selected body part
	//and show the section to the right
	cyberwareImages.click( function() {
		var bodyPart = $(this).attr('class').split(' ')[0];
		var thisSection = $('#' + bodyPart + '-cyberware');
		$('#' + bodyPart + '-cyberware').stop().slideToggle(300);
		$(this).toggleClass('active');
		if ( $(this).hasClass('active') ) $(this).attr('src',  'images/cyber'+ bodyPart + '-hover.png');
		else if ( $(this).hasClass('modded') && $(this).hasClass('active') == false ) $(this).attr('src',  'images/cyber'+ bodyPart + '-modded.png');
		else $(this).attr('src',  'images/cyber'+ bodyPart + '.png');
		if ( $('#cyber-mods > div:not(#cyber-intro):visible').length === 1 ) $('#cyber-intro').stop().slideToggle(300);
		else if ( $('#cyber-intro').is(':visible') ) $('#cyber-intro').stop().slideToggle(300);
	});
	//Show modals on click
	$('#buttons .modal-button, .modal-background, .modal, .modal-header .close.button').click( function(e) {
		if(e.target !== e.currentTarget) return;
		var modal;
		if ( $(this).attr('id') ) {
			modal = $(this).attr('id').replace('open-','')
			modal = $('#' + modal).closest('.modal-background');
		} else if ( $(this).hasClass('close') || $(this).hasClass('modal') ) {
			modal = $(this).closest('.modal-background');
		} else {
			modal = $(this);
		}
		if ( modal.hasClass('visible') && $(this).find('#rules').length < 1 ) {
			modal.removeClass('visible');
			$('body').css('overflow-y','auto');
			$('.spell.disabled', modal).hide();
		} else {
			modal.addClass('visible');
			$('body').css('overflow-y','hidden');
		}
		if ( $(this).attr('id') == "open-archives" ) loreButton.text('Lore');
	});
	//Filter spells in spellbook based on selection
	filterButtons.click( function() {
		var thisButton = $(this);
		var thisModal = $(this).closest('.modal');
		var filter = $(this).attr('id');
		var tier;
		switch (filter) {
			case "filter-tier1":
				tier = "Tier 1";
			break;
			case "filter-tier2":
				tier = "Tier 2";
			break;
			case "filter-tier2":
				tier = "Tier 2";
			break;
			case "filter-tier3":
				tier = "Tier 3";
			break;
			case "filter-tier4":
				tier = "Tier 4";
			break;
			case "filter-tier5":
				tier = "Tier 5";
			break;
			case "filter-tier6":
				tier = "Tier 6";
			break;
		}
		if ( filter.indexOf('filter') > -1 ) {
			$('.spell', thisModal).each( function() {
				var spellTier = $('.tier', this).text();
				if ( (spellTier === tier) && ($(this).hasClass(filter) || $(this).hasClass('hidden') == false) ) {
					$(this).stop().slideToggle(500, function() {
						$(this).toggleClass('hidden ' + filter);
					});
				}
			});
		} 
		thisButton.toggleClass('clicked');
	});
	//Add optional spells to item lists once selected
	spellBook.on('click', 'li.selectable', function() {
		var spellList = $(this).closest('ul');
		spellList.children('li.selectable').not(this).addClass('disabled');
		$(this).addClass('selected');
		spellList.children('li.selectable').each( function() {
			var spellID = $(this).data('spellid');
			var isSelected = $(this).hasClass('selected');
			if ( spellID.length > 4 ) {
				spellID = spellID.split(',');
				for (i = 0; i < spellID.length; i++) {
					if ( !isSelected ) {
						$('#' + spellID[i], spellBook).stop().slideToggle(500, function() {
							$('#' + spellID[i], spellBook).addClass('hidden-spell');
						});
					} else $('#' + spellID[i], spellBook).addClass('selected');
				}
			} else {
				if ( !isSelected ) {
					$('#' + spellID, spellBook).stop().slideToggle(500, function() {
						$('#' + spellID, spellBook).addClass('hidden-spell');
					});
				} else $('#' + spellID, spellBook).addClass('selected');
			}
		});
		populateSpells();
	});
	//Re-arrange spell hotbars when window is resized
	$( window ).resize(function() {arrangeSpells();});
	//Highlight selected dice number
	//and then disable the others
	$('.dice-number').click( function() {
		var parentSection = $(this).closest('.dice');
		var diceSection = $(this).closest('.dice-counter');
		var diceType = diceSection.attr('id');
		var diceNumber = $('.number', this).text();
		$('.dice-number', parentSection).not(this).addClass('disabled');
		$(this).addClass('selected');
		$('.' + diceType + '-number').text(diceNumber);
		$('h3:first-child', parentSection).css('order','3');
		$('h3:last-child', parentSection).css('order','1');
		$('.after-selection', diceSection).show();
		$('.pre-selection', diceSection).hide();
	});
	//Increase and decrease XP amounts when buttons
	//are pushed and check for XP amount for level up
	xpUpButton.click( function() {
		var displayedXP = xpNumber.text().replace(' XP', '');
		xpDownButton.removeClass('disabled');
		curXP++;
		xpNumber.text(curXP + ' XP');
		if ( curXP === (90 - ((curTier - 1) * 16)) ) xpUpButton.addClass('disabled');
		if ( curXP >= 16 && nextTierButton.is(':hidden') ) nextTierButton.slideToggle(150);
	});
	xpDownButton.click( function() {
		var displayedXP = xpNumber.text().replace(' XP', '');
		xpUpButton.removeClass('disabled');
		curXP--;
		xpNumber.text(curXP + ' XP');
		if ( curXP === 0 ) xpDownButton.addClass('disabled');
		else if ( curXP < 16 && nextTierButton.is(':visible') ) nextTierButton.slideToggle(150);
	});
	//Click to advance to the next tier
	//and run spell function to populate new spells
	nextTierButton.click( function() {
		var displayedTier = tierNumber.text();
		var displayedXP = xpNumber.text().replace(' XP', '');
		curTier++;
		curXP = curXP - 16;
		tierNumber.text(curTier);
		xpNumber.text(curXP + ' XP');
		populateSpells();
		if ( curXP < 16 && nextTierButton.is(':visible') ) nextTierButton.slideToggle(150);
		if ( curXP === 0 ) xpDownButton.addClass('disabled');
	});
	//Click headers to expand sub-headers and content in the rules
	//and check for any visible 'child' headers or topics to
	//collapse when closing a section
	function toggleRules(child) {
		var childID = child.attr('id');
		child.stop().slideToggle({
			duration: 300,
			start: function() {
				if ( child.is('table') ) child.addClass('ensure-block');
			},
			complete: function() {
				child.removeClass('ensure-block');
			}
		});
		childExists(childID);
	}
	function childExists(childID) {
		if ( childID ) {
			var child = $('.' + childID);
			if ( child.is(':visible') ) {
				child.each( function() {
					toggleRules($(this));
					$(this).removeClass('active');
					$(this).removeClass('expanded');
				});		
			}				
		};
	}
	$('#rules *').click( function() {
		var elementID = $(this).attr('id');
		$(this).toggleClass('active');
		if ( elementID ) {
			var child = $('.' + elementID);
			child.each( function() {
				toggleRules($(this));
				$(this).removeClass('active');
				$(this).removeClass('expanded');
			});
			if ( $(this).is('h5') ) $(this).toggleClass('expanded');
		}
	});
	//Open to the specific area in the rules for the clicked button
	//expanding and scrolling down to the specific section as necessary
	$('.rules-anchor').click( function() {
		var ruleSection = $('.' + $(this).data('rule'));
		var ruleTitle = $('#' + $(this).data('rule'));
		var modal = $('#rules').closest('.modal-background');
		var counter = 0;
		if ( modal.hasClass('visible') === false ) {
			modal.addClass('visible');
			$('body').css('overflow-y','hidden');
		}
		if ( ruleSection.is(':visible') === false && ruleTitle.is('h3') ) {
			ruleTitle.addClass('active');
			ruleSection.stop().slideToggle(300, function() {
				if ( counter === 0 ) {
					modal.animate({
						scrollTop: (ruleTitle.offset().top - 15)
					},500);
					counter++;
				}
			});
		} else if ( ruleSection.is(':visible') === false && ruleTitle.is('h4') ) {
			var h3Title = $('#' + ruleTitle.attr('class').replace('expandable','').replace('active','').replace(/\s/g,''));
			var h3Section = $('.' + ruleTitle.attr('class').replace('expandable','').replace('active','').replace(/\s/g,''));
			if ( h3Title.hasClass('active') === false ) {
				h3Title.addClass('active');
				h3Section.stop().slideToggle(300);
			}
			ruleTitle.addClass('active');
			ruleSection.stop().slideToggle(300, function() {
				if ( counter === 0 ) {
					modal.animate({
						scrollTop: (ruleTitle.offset().top - 15)
					},500);
					counter++;
				}
			});
		} else if ( ruleSection.is(':visible') === false && ruleTitle.is('h5') ){
			var h4Title = $('#' + ruleTitle.attr('class').replace('expandable','').replace('active','').replace('expanded','').replace(/\s/g,''));
			var h4Section = $('.' + ruleTitle.attr('class').replace('expandable','').replace('active','').replace(/\s/g,''));
			var h3Title = $('#' + h4Title.attr('class').replace('expandable','').replace('active','').replace(/\s/g,''));
			var h3Section = $('.' + h4Title.attr('class').replace('expandable','').replace('active','').replace(/\s/g,''));
			if ( h3Title.hasClass('active') === false ) {
				h3Title.addClass('active');
				h3Section.stop().slideToggle(300);
			}
			if ( h4Title.hasClass('active') === false ) {
				h4Title.addClass('active');
				h4Section.stop().slideToggle(300);
			}
			ruleTitle.addClass('active expanded');
			ruleSection.stop().slideToggle(300, function() {
				if ( counter === 0 ) {
					modal.animate({
						scrollTop: (ruleTitle.offset().top - 15)
					},500);
					counter++;
				}
			});
		} else {
			if ( counter === 0 ) {
				modal.animate({
					scrollTop: (ruleTitle.offset().top - 15)
				},500);
				counter++;
			}
		}
	});
	//Search through tables in the Rules modal
	//and filter results based on input
	$('#rules .filter-input').keyup( function() {
		var inputClass = $(this).attr('class').replace('expandable','').replace('active','').replace('expanded','').replace('filter-input','').replace(/\s/g,'');
		var tableRow = $('table.' + inputClass + ' tbody tr');
		var value = $(this).val().toLowerCase();
		tableRow.filter( function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
		});
	});
	//Listeners for mobile vs listeners for desktop
	if ( isTouchDevice() ) {
		//Show a sliding tooltip on click
		spellHotbars.on('click', '.spell, .status-effect', function() {
			var hotbar = $(this);
			var spellID = hotbar.data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			//$('.tooltip:visible').not(tooltip).stop().slideToggle(500);
			if (tooltip.is(':visible')) {
				tooltip.stop().slideToggle(500, function() {
					tooltip.appendTo($('body'));
				});
			} else {
				tooltip.appendTo(hotbar);
				tooltip.stop().slideToggle({
					duration: 500,
					start: function() {
						tooltip.css('display','flex');
					}
				});
			}
		});
		$( window ).resize(function() {
			var tooltip = $('.tooltip:visible');
			var hotbarWidth = tooltip.parent('.spell').width();
			tooltip.css('width', hotbarWidth - 40 );
		});
	} else {
		//Highlight the current bodypart on mouseover
		$('#cyber-mannequin img').hover( function() {
			var thisSection = $(this).attr('class').split(' ')[0];
			if ( $(this).hasClass('active') == false ) $(this).attr('src',  'images/cyber'+ thisSection + '-hover.png');
		}, function() {
			var thisSection = $(this).attr('class').split(' ')[0];
			if ( $(this).hasClass('modded') && $(this).hasClass('active') == false) $(this).attr('src',  'images/cyber'+ thisSection + '-modded.png');
			else if ( $(this).hasClass('modded') == false && $(this).hasClass('active') == false ) $(this).attr('src',  'images/cyber'+ thisSection + '.png');
		});
		//Show tooltips on hover
		function tooltipPosition(targetElement,tooltip) {
			var fromLeft = targetElement.pageX - 20;
			var windowWidth = $(window).width();
			if ( fromLeft < 10 ) fromLeft = 10;
			else if ( fromLeft > windowWidth - (tooltip.width() + 30) ) fromLeft = windowWidth - (tooltip.width() + 30);
			tooltip.css('top', targetElement.pageY - (tooltip.height() + 35));
			tooltip.css('left', fromLeft);
			if ( !isHovering ) tooltip.addClass('visible');
		}
		spellHotbars.on('mouseenter', '.spell, .status-effect', function(targetElement) {
			var spellID = $(this).data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			tooltipPosition(targetElement,tooltip);
		});
		spellHotbars.on('mouseleave', '.spell, .status-effect', function(targetElement) {
			var spellID = $(this).data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			tooltip.removeClass('visible');
			isHovering = false;
		});
		spellHotbars.on('mousemove', '.spell, .status-effect', function(targetElement){
			var spellID = $(this).data('spellid');
			var tooltip = $('.tooltip[data-spellid="' + spellID + '"]');
			isHovering = true;
			tooltipPosition(targetElement,tooltip);
		});
		hybridButton.hover( function(targetElement){
			if ( hybridButton.hasClass('clicked') === false ) {
				tooltipPosition(targetElement,hybridTooltip);
			}
		}, function() {
			isHovering = false;
			hybridTooltip.removeClass('visible');
		});
		hybridButton.mousemove( function(targetElement){
			if ( hybridButton.hasClass('clicked') === false ) {
				isHovering = true;
				tooltipPosition(targetElement,hybridTooltip);
			}
		});
		resetButton.hover( function(targetElement){
			tooltipPosition(targetElement,resetTooltip);
		}, function() {
			isHovering = false;
			resetTooltip.removeClass('visible');
		});
		resetButton.mousemove( function(targetElement){
			isHovering = true;
			tooltipPosition(targetElement,resetTooltip);
		});
		enableCyberware.hover( function(targetElement){
			tooltipPosition(targetElement,cyberwareTooltip);
			if ( $('.cyberware').length ) $('em', cyberwareTooltip).css('display','block');
			else $('em', cyberwareTooltip).css('display','none')
		}, function() {
			isHovering = false;
			cyberwareTooltip.removeClass('visible');
		});
		enableCyberware.mousemove( function(targetElement){
			isHovering = true;
			tooltipPosition(targetElement,cyberwareTooltip);
		});
		magicTitle.hover( function(targetElement){
			tooltipPosition(targetElement,magicTooltip);
		}, function() {
			isHovering = false;
			magicTooltip.removeClass('visible');
		});
		magicTitle.mousemove( function(targetElement){
			isHovering = true;
			tooltipPosition(targetElement,magicTooltip);
		});
		techTitle.hover( function(targetElement){
			tooltipPosition(targetElement,techTooltip);
		}, function() {
			isHovering = false;
			techTooltip.removeClass('visible');
		});
		techTitle.mousemove( function(targetElement){
			isHovering = true;
			tooltipPosition(targetElement,techTooltip);
		});
		logicTitle.hover( function(targetElement){
			tooltipPosition(targetElement,logicTooltip);
		}, function() {
			isHovering = false;
			logicTooltip.removeClass('visible');
		});
		logicTitle.mousemove( function(targetElement){
			isHovering = true;
			tooltipPosition(targetElement,logicTooltip);
		});
		feelingsTitle.hover( function(targetElement){
			tooltipPosition(targetElement,feelingsTooltip);
		}, function() {
			isHovering = false;
			feelingsTooltip.removeClass('visible');
		});
		feelingsTitle.mousemove( function(targetElement){
			isHovering = true;
			tooltipPosition(targetElement,feelingsTooltip);
		});
	}
	//Filter inputs sheet id field
	$('#sheet-id').on('keydown blur paste', function(e){
		var thisVal = $(this).html();
		var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
        var isCursorMoveOrDeleteAction = ([116,9,46,8,37,38,39,40].indexOf(e.keyCode) != -1);
        var isAlphaKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >=96 && e.keyCode <= 105);
        var vKey = 86, cKey = 67, aKey = 65;
		switch(true){
            case isCursorMoveOrDeleteAction:
            case isModifierkeyPressed == false && isAlphaKeyPressed:
            case (e.metaKey || e.ctrlKey) && ([vKey,cKey,aKey].indexOf(e.keyCode) != -1):
                break;
            default:
                e.preventDefault();
        }
	});
	//Character Sheet Saving
	$('#submit-sheet').click( function() {
		var sheetList = [];
		var recordID;
		var sheetID = $('#sheet-id').val();
		if ( !sheetID ) {
			alert('Please enter a sheet ID!');
		} else {
			base('Sheets').select({
				view: 'Grid view',
				filterByFormula: "{id} = '" + sheetID + "'"
			}).eachPage(function page(records, fetchNextPage) {
			records.forEach(function(record) {
				recordID = record.id;
				sheetList.push(recordID);
			});
				fetchNextPage();
			}, function done(err) {
				if (err) { console.error(err); return; }
				if ( sheetList.length === 0 ) {
					base('Sheets').create([
						{
							"fields": {
							  "id": $('#sheet-id').val()
							}
						}
					], function(err, records) {
						if (err) { console.error(err); return; }
						alert('Character sheet created!');
						$('#submit-sheet').addClass('disabled');
						$('#cancel-submit').addClass('disabled');
						$('#new-sheet').removeClass('disabled');
						$('#load-sheet').removeClass('disabled');
						$('#sheet-id').addClass('loaded');
						saveSheet();
						if ( $('#disable-autosave').is(':checked') ) clearInterval(saveInterval);
						else autoSave();
						Cookies.set('sheetID',$('#sheet-id').val(),{ expires: Infinity });
					});
				} else {
					alert('That character sheet already exists. Click Open to load an existing one, or type in a different name.');
				}
			});
		}
	});
	//Character Sheet Loading
	$('#load-sheet').click( function() {
		var sheetID = $('#sheet-id').val();
		if ( !sheetID ) {
			alert('Please enter a sheet ID!');
		} else {
			clearInterval(saveInterval);
			if ( $('#sheet-id').hasClass('loaded') ) {
				currentSheetID = sheetID;
				$('#sheet-id').removeClass('loaded');
				$('#new-sheet').addClass('disabled');
				$('#cancel-submit').removeClass('disabled');
			} else {
				loadCharaSheet(sheetID);
			}
		}
	});
	//New Button
	$('#new-sheet').click( function() {
		clearInterval(saveInterval);
		currentSheetID = $('#sheet-id').val();
		$(this).addClass('disabled');
		$('#submit-sheet').removeClass('disabled');
		$('#load-sheet').addClass('disabled');
		$('#sheet-id').removeClass('loaded');
		$('#cancel-submit').removeClass('disabled');
	});
	//Cancel Button
	$('#cancel-submit').click( function() {
		$('#sheet-id').val(currentSheetID);
		$(this).addClass('disabled');
		$('#new-sheet').removeClass('disabled');
		$('#load-sheet').removeClass('disabled');
		$('#submit-sheet').addClass('disabled');
		$('#sheet-id').addClass('loaded');
		if ( $('#disable-autosave').is(':checked') ) clearInterval(saveInterval);
		else autoSave();
	});
	//Pick random name based on species selected
	randomNameButton.click( function() { 
		if ( secSpecies.val() ) {
			randomName(priSpecies.val(),secSpecies.val());
		} else {
			randomName(priSpecies.val());
		}
	});
	//Slideout for save/load sheet
	$('#load-sheet-toggle').click( function() {
		if ($('#sheet-header').hasClass('toggled')) $(this).html('&#128447;');
		else $(this).html('&#9932;');
		$('#sheet-header').toggleClass('toggled');
		$(this).toggleClass('toggled');
	});
	$('#disable-autosave').click( function() {
		if ( $(this).is(':checked') ) clearInterval(saveInterval);
		else autoSave();
	});
});