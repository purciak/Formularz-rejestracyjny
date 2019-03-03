(function($){

	$(document).ready(function(){

		function clearFieldFeedbacks($field) {
			
			var $formGroup = $field.closest('.form-group');
			var $feedbacks = $formGroup.find('.invalid-feedback,.valid-feedback');

			$formGroup.removeClass('has-error');
			$formGroup.removeClass('has-success');
			$feedbacks.remove();
		}

		function showFieldError($field, message) {
			showFieldFeedback($field, message, 'error');
		}

		function showFieldSuccess($field, message) {
			message = message||'Ok!';

			showFieldFeedback($field, message, 'success');
		}

		function showFieldFeedback($field, message, type) {
			var $feedback = $('<div>');
			var $formGroup = $field.closest('.form-group');

			if ('error' == type) {
				$feedback.addClass('invalid-feedback');
				$formGroup.addClass('has-error');
			} else {
				$feedback.addClass('valid-feedback');
				$formGroup.addClass('has-success');
			}
			
			$feedback.text(message);

			
			
			$formGroup.append($feedback);
		}

		function validateFieldName(fieldName) {
			// debugger;
			var $field = getFieldByName(fieldName);
			var nameValue = $field.val();

			nameValue = $.trim(nameValue);
			var nameValueParts = nameValue.split(' ');
			
			if (nameValueParts.length < 2) {
				showFieldError($field, 'Nie podałeś imienia i nazwiska');
				return false;
			}

			return true;
		}

		function validateFieldEmail(fieldName) {
			// debugger;
			var $fieldEmail = getFieldByName(fieldName);
			var value = $fieldEmail.val();

			
			var regex = /^[a-z0-9]+@[a-z0-9]+.[a-z]{2,}$/;
			if (!regex.test(value)) {
				showFieldError($fieldEmail, 'Nie poprawny adres e-mail');
				return false;
			}

			return true;
		}

		function validateFieldPassword(fieldName) {
			var $fieldPassword = getFieldByName(fieldName);
			var value = $fieldPassword.val();

			if (value.length < 8) {
				showFieldError($fieldPassword, 'Hasło musi posiadać minimum 8 znaków');
				return false;
			}

			return true;
		}

		function validateFieldPasswordConfirmation(fieldName) {
			var $field = getFieldByName(fieldName);
			var value = $field.val();

			var $passwordField = getFieldByName('password');
			var passwordValue = $passwordField.val();

			if (value != passwordValue) {
				showFieldError($field, 'Hasła nie są identyczne');
				return false;
			}

			return true;
		}

		function validateFieldSex(fieldName) {
			
			var $fields = getFieldByName(fieldName);

			if (!$fields.is(':checked')) {
				showFieldError($fields, 'Musisz zaznaczyć płeć');
				return false;
			}

			return true;
		}

		function validateFieldNotEmpty(fieldName) {
			
			var $field = getFieldByName(fieldName);
			var fieldValue = $field.val();
			fieldValue = $.trim(fieldValue);

			if (0 == fieldValue.length) {
				showFieldError($field, 'Pole jest wymagane');
				return false;
			}

			return true;
		}

		function validateFieldPromos(fieldName) {
			var $fields = getFieldByName(fieldName);
			
			var fieldsCheckedCount = $fields.filter(':checked').length;

			if (fieldsCheckedCount < 2) {
				showFieldError($fields, 'Zaznacz przynajmniej dwie promocje');
				return false;
			}

			return true;
		}

		function validateFieldPhone(fieldName) {
			var $field = getFieldByName(fieldName);
			var fieldValue = $field.val();
			var regex = /^\+\d{2}( \d{3}){3}/;

			if (0 == fieldValue.length) {
				return true;
			}

			if (!regex.test(fieldValue)) {
				showFieldError($field, 'Wymagany format: +XX XXX XXX XXX');
				return false;
			}

			return true;
		}

		function validateField(fieldName, validators) {
			
			var i, l, validator, $field;

			$field = getFieldByName(fieldName);
			i = 0;
			l = validators.length;

			clearFieldFeedbacks($field);

			for(i=0; i<l; i++) {
				validator = validators[i];

				if(!validator(fieldName)) {
					return false;
				}
			}

			showFieldSuccess($field);
			return true;
		}

		function validateOnFieldEvent() {
			var fieldName, validators;

			fieldName = this.getAttribute('name');

			if (typeof fieldsToValidate[fieldName] != 'undefined') {
				validators = fieldsToValidate[fieldName];
				validateField(fieldName, validators)
			}
		}

		function isInputChoice($item) {
			var itemType = $item.attr('type');

			return ('radio' == itemType || 'checkbox' == itemType || $item.is('select'));
		}

		
		var getFieldByName = (function () {
			var cache = {};

			return function (fieldName){
				if (typeof cache[fieldName] == 'undefined') {
					cache[fieldName] = $('[name="'+fieldName+'"]');
				}

				return cache[fieldName];
			};
		})();


		var fieldsToValidate = {
			'full-name': [
				validateFieldNotEmpty,
				validateFieldName
			],
			'email': [
				validateFieldNotEmpty,
				validateFieldEmail
			],
			'password': [
				validateFieldNotEmpty,
				validateFieldPassword,
			],
			'password-confirmation': [
				validateFieldNotEmpty,
				validateFieldPasswordConfirmation
			],
			'sex': [
				validateFieldSex
			],
			'rumor': [
				validateFieldNotEmpty
			],
			'promos[]': [
				validateFieldPromos
			],
			'address': [
				validateFieldNotEmpty
			],
			'phone': [
				validateFieldPhone
			]
		};

		var $form = $('#registration-form');
		var $formFields = $form.find(':input');


		$formFields.each(function(index, item){
			var $item = $(item);

			if (isInputChoice($item)) {
				$item.change(validateOnFieldEvent);
			} else {
				$item.blur(validateOnFieldEvent);
			}
		});

		
		$('#registration-form').submit(function(evt){
			var formValid, fieldName, fieldValidators;

			formValid = true;

			for(fieldName in fieldsToValidate) {
				fieldValidators = fieldsToValidate[fieldName];

				if (!validateField(fieldName, fieldValidators)){
					formValid = false;
				}
			}
		
			if (!formValid) {
				evt.preventDefault();

				var $formGroupsWithError = $form.find('.form-group.has-error');
				
				$formGroupsWithError
					.filter(function(index, item){
					
						var $item = $(item);
						var $input = $item.find(':input').first();

						return !isInputChoice($input);
					})
					.first()
					.find(':input')
					.focus();

			}
		});

	});

})(jQuery);