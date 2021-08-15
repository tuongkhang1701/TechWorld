function Validator(formSelector) {
    var _this = this;
    var formRules = {};

    function getParent(element, selector) {
        return element.closest(selector);
    }
    /**
     * Quy ước tạo rules:
     * - Nếu không có lỗi => return undefined
     * - Nếu có lỗi => return error message
     * 
     */
    var validatorRules = {
            required: function(value) {
                return value ? undefined : "Vui lòng nhập trường này";
            },
            email: function(value) {
                var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                return regex.test(value) ? undefined : "Trường này phải là email";
            },
            phone: function(value) {
                var regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
                return regex.test(value) ? undefined : "Trường này phải là số điện thoại";
            },
            min: function(min) {
                return function(value) {
                    return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
                }
            },
            max: function(max) {
                return function(value) {
                    return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự`;
                }
            }
        }
        //Lấy ra form trong DOM theo selector
    var formElement = document.querySelector(formSelector);
    //Chỉ xử lí khi có element trong DOM
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for (var rule of rules) {
                var isRuleHasValue = rule.includes(':');
                var ruleInfo;

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':');

                    rule = ruleInfo[0];
                }

                var isFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    isFunc = isFunc(ruleInfo[1]);
                }
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(isFunc);
                } else {
                    formRules[input.name] = [isFunc];
                }
            }
            //Lắng nghe sự kiện để validate(blur, change...)
            input.onblur = handleValidate;
            input.oninput = handleClear;
        }

        //Hàm thực hiện validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if (errorMessage) break;
            }

            //Nếu có lỗi hiển thị lỗi ra UI website
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');

                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }
        //Hàm clear error message
        function handleClear(event) {
            var formGroup = getParent(event.target, '.form-group');
            if (formGroup) {
                if (formGroup.classList.contains('invalid')) {
                    formGroup.classList.remove('invalid');

                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = '';
                    }
                }
            }
        }
    }
    //Xử lí hành vi submit form
    formElement.onsubmit = function(event) {
            event.preventDefault();
            var inputs = formElement.querySelectorAll('[name][rules]');
            var isValid = true;
            for (var input of inputs) {
                if (!handleValidate({
                        target: input
                    })) {
                    isValid = false;
                }
            }

            //Khi không có lỗi thì submit form
            if (isValid) {
                if (typeof _this.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }

                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    //Gọi lại hàm onSubmit và trả về kèm giá trị
                    _this.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }
        }
        // console.log(formElement);

}