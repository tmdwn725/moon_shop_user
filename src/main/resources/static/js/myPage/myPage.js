var letterRegExp = new RegExp("[a-z]");
var capsLockRegExp = new RegExp("[A-Z]");
var numberRegExp = new RegExp("[0-9]");
var symbolRegExp = new RegExp("\\W");

<!-- profile -->
// 프로필 이미지 클릭
$("#change-profile-image-btn").click(function (e) {
    e.preventDefault();
    $("#profile-image-area").css("display", "none");
    $("#change-profile-image-area").css("display", "");
});

$("#change-profile-image-cancel-btn").click(function (e) {
    e.preventDefault();
    $("#profile-image").val('');
    $("#profile-image-area").css("display", "");
    $("#change-profile-image-area").css("display", "none");
    $("#profile-backGround-image").css('background-image', $("#profile-image").data('backup-img'));
});

$("#change-profile-image-finish-btn").click(function (e) {
    e.preventDefault();
    var files = $("#profile-image")[0].files[0];
    var defaultImageValue = $('#defaultImage').val();
    if ($('#defaultImage').val() == '') {
        defaultImageValue = 'false';
    }

    if (null != files || defaultImageValue === 'true') {
        var filesName;

        if (defaultImageValue !== 'true' && (filesName = files.name) && !(filesName.toLowerCase().endsWith("jpg") || filesName.toLowerCase().endsWith("png") || filesName.toLowerCase().endsWith("jpeg") || filesName.toLowerCase().endsWith("gif"))) {
            alert('gif/jpg/png 파일만 등록할 수 있습니다.');
            return false;
        } else if (defaultImageValue !== 'true' && files.size > maxUploadSize) {
            alert(maxUploadSizeMsg);
            return false;
        } else {

            var message;

            if (defaultImageValue == 'true') {
                message = "기본 이미지로 변경하시겠습니까?";
            } else {
                message = "프로필 사진을 변경하시겠습니까?";
            }

            if (confirm(message)) {

                var formData = new FormData();
                formData.append('file', files);
                formData.append('defaultImage', defaultImageValue);
            }
        }
    } else {
        alert('사진파일을 선택해 주세요.');
    }
});

<!-- password -->
$("#change-password-btn").click(function (e) {
    e.preventDefault();
    $("#password-area").css("display", "none");
    $("#change-password-area").css("display", "");
});

// 비밀번호 변경 취소 버튼 클릭
$("#change-password-cancel-btn").click(function (e) {
    e.preventDefault();
    $("#password").val('');
    $("#newPassword").val('');
    $("#confirmPassword").val('');
    $("#password-area").css("display", "");
    $("#change-password-area").css("display", "none");
    $("#new-password-invalid").css("display", "none");
    $("#valid-newPassword").css("display", "none");
    $("#password-invalid").css("display", "none");
    $("#valid-password").css("display", "none");
    $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
    $("#change-password-finish-btn").prop('disabled', true);
    $("#newPassword").attr('class', 'n-input');
});

$("#password").keyup(function (e) {
    e.preventDefault();
    var password = $("#password");
    var newPassword = $("#newPassword");
    var confirmPassword = $("#confirmPassword");
    var displayValue = $("#new-password-invalid").css("display");
    var passwordInvalidDisplayValue = $('#password-invalid').css("display");

    if (password.val().length >= 4 &&
        newPassword.val().length >= 8 &&
        confirmPassword.val().length >= 8 &&
        displayValue == 'none' &&
        passwordInvalidDisplayValue == 'none'
    ) {
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent');
        $("#change-password-finish-btn").prop('disabled', false);
    } else {
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#change-password-finish-btn").prop('disabled', true);
    }

    value = $(this).val();
    var passwordInvalid = $('#password-invalid');
    var newPasswordInvalid = $("#new-password-invalid");

    if (!value) {
        passwordInvalid.css('display', '');
        passwordInvalid.text('');
        return false;
    }

    if (password.val().length < 4) {
        passwordInvalid.css('display', '');
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#change-password-finish-btn").prop('disabled', true);
        $("#password_div").attr("class", "input-password__wrap input-danger");
        passwordInvalid.text("4자리 이상 입력해 주십시오.");
        return false;
    }

    passwordInvalid.css('display', 'none');
    $("#password_div").attr("class", "input-password__wrap ");
    if (passwordInvalid.css("display") === 'none' && newPasswordInvalid.css("display") === 'none' && confirmPassword.val().length >= 8) {
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent');
        $("#change-password-finish-btn").prop('disabled', false);
    }
});

// 신규 비밀번호 입력
$("#newPassword").keyup(function (e) {
    e.preventDefault();
    var newPassword = $("#newPassword");

    if (newPassword.val() == '' || newPassword.val().length < 8) {
        newPassword.attr('class', 'n-input input-danger');
        $("#valid-newPassword").css("display", "none");
        $("#new-password-invalid").css("display", "");
        $("#new-password-invalid").text("8자리 이상 입력해 주십시오.");
        $("#newPassword_div").attr("class", "input-password__wrap input-danger");
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#change-password-finish-btn").prop('disabled', true);
        return false;
    } else if (checkFourConsecutiveChar(newPassword.val())) {
        newPassword.attr('class', 'n-input input-danger');
        $("#valid-newPassword").css("display", "none");
        $("#new-password-invalid").css("display", "");
        $("#new-password-invalid").text("4개 이상 연속으로 동일한 문자는 사용하실 수 없습니다.");
        $("#newPassword_div").attr("class", "input-password__wrap input-danger");
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#change-password-finish-btn").prop('disabled', true);
        return false;
    } else if (!isValidPassword(newPassword.val())) {
        newPassword.attr('class', 'n-input input-danger');
        $("#valid-newPassword").css("display", "none");
        $("#new-password-invalid").css("display", "");
        $("#new-password-invalid").text("숫자 ,영문 대소문자, 특수문자 중 두가지 이상으로 조합해 주십시오.");
        $("#newPassword_div").attr("class", "input-password__wrap input-danger");
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#change-password-finish-btn").prop('disabled', true);
        return false;
    } else {
        var points = getPassordRulePoint(newPassword.val());
        newPassword.attr('class', 'n-input');
        $("#new-password-invalid").css("display", "none");
        $("#valid-newPassword").css("display", "");
        $("#valid-newPassword").text("사용 가능한 비밀번호입니다.");
        $("#newPassword_div").attr("class", "input-password__wrap");
        var confirmPassword = $("#confirmPassword");
        var password = $("#password");
        if (password.val().length >= 4 && confirmPassword.val().length >= 8) {
            $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent');
            $("#change-password-finish-btn").prop('disabled', false);
        } else {
            $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
            $("#change-password-finish-btn").prop('disabled', true);
        }
    }
    return true;
});

// 신규 비밀번호 재입력
$("#confirmPassword").keyup(function (e) {
    e.preventDefault();
    var password = $("#password");
    var newPassword = $("#newPassword");
    var confirmPassword = $("#confirmPassword");
    var displayValue = $("#new-password-invalid").css("display");
    var passwordInvalidDisplayValue = $('#password-invalid').css("display");

    if (password.val().length >= 4 &&
        newPassword.val().length >= 8 &&
        confirmPassword.val().length >= 8 &&
        displayValue == 'none' &&
        passwordInvalidDisplayValue == 'none'
    ) {
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent');
        $("#change-password-finish-btn").prop('disabled', false);
    } else {
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#change-password-finish-btn").prop('disabled', true);
    }
});

// 비밀번호 변경
$("#change-password-finish-btn").click(function (e) {
    e.preventDefault();

    const password = $("#password").val();
    const newPassword = $("#newPassword").val();
    const confirmPassword = $("#confirmPassword").val();

    if (password === '') {
        alert('현재 비밀번호를 입력해주세요.');
        return false;
    }

    if (password.length < 4) {
        alert('비밀번호 4자 이상이여야합니다.');
        return false;
    }

    if (newPassword !== confirmPassword) {
        alert('신규 비밀번호와 재입력 비밀번호가 같지 않습니다.');
        $("#confirmPassword").val('');
        $("#newPassword").val('');
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#change-password-finish-btn").prop('disabled', true);
        $("#new-password-invalid").text('');
        $("#valid-newPassword").text('');
        return false;
    }

    if (password === newPassword) {
        alert('현재 비밀번호와 신규 비밀번호가 동일합니다.');
        $("#newPassword").val('');
        $("#confirmPassword").val('');
        $("#change-password-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#change-password-finish-btn").prop('disabled', true);
        $("#new-password-invalid").text('');
        $("#valid-newPassword").text('');
        return false;
    }

    if (confirm('비밀번호를 변경하시겠습니까?')) {
        $.ajax({
            type: "POST",
            url: "/myPage/changePassword",
            dataType: "json", // 예상되는 응답 형식을 JSON으로 지정
            data:{"password" : password, "newPassword" : newPassword},
            success: function(response){
                alert(response.message);
                if(response.result === 'success') {
                    location.href = "myPage/myPage"
                }
            },
            error: function(xhr, status, error) {
                alert("변경중 오류가 발생했습니다.");
            }
        });
    }
});

//
$("#change-nickName-btn").click(function (e) {
    e.preventDefault();
    $("#currentNickName").show();
    $("#nickName").removeClass('input-danger');
    $("#nickName-area").css("display", "none");
    $("#change-nickName-area").css("display", "");
    $("#nicknameValidationMessage").hide();
    $("#nickName").val("").focus();
});

$("#change-nickName-cancel-btn").click(function (e) {
    e.preventDefault();
    $("#nickName-area").css("display", "");
    $("#change-nickName-area").css("display", "none");
    $("#nickName").val("");
    $("#change-nickName-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
    $("#change-nickName-finish-btn").prop('disabled', true);
    $("#nicknameValidationMessage").css("display", "none");
    $("#valid-nickName").css("display", "none");
});

<!-- email -->
$("#change-email-btn").click(function (e) {
    e.preventDefault();
    $("#email-area").css("display", "none");
    $("#change-email-area").css("display", "");
    $("#send-authentication-email").attr('class', 'n-btn btn-sm btn-accent disabled');
    $("#send-authentication-email").prop('disabled', true);
    $("#change-email-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
    $("#change-email-finish-btn").prop('disabled', true);
});

$("#change-email-cancel-btn").click(function (e) {
    e.preventDefault();
    $("#email-area").css("display", "");
    $("#change-email-area").css("display", "none");
    $("#send-authentication-email").attr('class', 'n-btn btn-sm btn-accent disabled');
    $("#send-authentication-email").prop('disabled', true);
    $("#change-email-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
    $("#change-email-finish-btn").prop('disabled', true);
    $("#email").val("");
    $("#email-authTempKey").val("");
});

$("#email").keyup(function (e) {
    e.preventDefault();
    var email = $("#email");
    var emailLength = email.val().length;

    if (emailLength > 0) {
        $("#send-authentication-email").attr('class', 'n-btn btn-sm btn-accent');
        $("#send-authentication-email").prop('disabled', false);
    } else {
        $("#send-authentication-email").attr('class', 'n-btn btn-sm btn-accent disabled');
        $("#send-authentication-email").prop('disabled', true);
    }
});

 $("#send-authentication-email").click(function (e) {
    e.preventDefault();
    const email = $("#email");
    const emailValue = email.val();

    if (!isValidEmail(emailValue)) {
        alert('이메일 주소가 올바르지 않습니다.');
        return false;
    } else {
        if (confirm('인증 메일을 발송하시겠습니까??')) {

            $.ajax({
                type: "post",
                url: "/sendEmail",
                dataType: "json", // 예상되는 응답 형식을 JSON으로 지정
                data:{'email': emailValue},
                success: function(response){
                    alert(responseData.message);
                    $("#send-authentication-email").attr('class', 'n-btn btn-sm btn-accent');
                    $("#send-authentication-email").prop('disabled', false);
                },
                error: function(xhr, status, error) {
                    alert("변경중 오류가 발생했습니다.");
                }
            });
        }
    }
});

function isValidEmail(email) {
    const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email);
}

function checkFourConsecutiveChar(password) {
    for (var i = 0; i < password.length - 3; i++) {
        if (password.charAt(i) == password.charAt(i + 1) &&
            password.charAt(i + 1) == password.charAt(i + 2) &&
            password.charAt(i + 2) == password.charAt(i + 3)) {
            return true;
        }
    }
    return false;
}

function isValidPassword(password) {
    var violationCnt = 0;
    if (!letterRegExp.test(password)) {
        violationCnt++;
    }

    if (!capsLockRegExp.test(password)) {
        violationCnt++;
    }

    if (!numberRegExp.test(password)) {
        violationCnt++;
    }

    if (!symbolRegExp.test(password)) {
        violationCnt++;
    }

    if (violationCnt > 2) {
        return false;
    } else {
        return true;
    }
}

function getPassordRulePoint(password) {
    var point = 0;
    if (letterRegExp.test(password)) {
        point = point + 4;
    }

    if (capsLockRegExp.test(password)) {
        point = point + 4;
    }

    if (numberRegExp.test(password)) {
        point = point + 4;
    }

    if (symbolRegExp.test(password)) {
        point = point + 4;
    }

    return point;
}