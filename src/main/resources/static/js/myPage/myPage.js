const letterRegExp = new RegExp("[a-z]");
const capsLockRegExp = new RegExp("[A-Z]");
const numberRegExp = new RegExp("[0-9]");
const symbolRegExp = new RegExp("\\W");

<!-- profile -->
// 프로필 이미지 클릭
const upload = document.querySelector('.upload-profile');
const realUpload = document.querySelector('.real-upload');

realUpload.addEventListener('change', getImageFiles);
upload.addEventListener('click', () => realUpload.click());

function getImageFiles(e) {
    const uploadFiles = [];
    const file = e.currentTarget.files[0];
    const imageId = this.id;

    // 파일 타입 검사
    if (!file.type.match("image/.*")) {
        alert('이미지 파일만 업로드가 가능합니다.');
        return
    }

    uploadFiles.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
        addImageFile('upload-img',e, file);
    };
    reader.readAsDataURL(file);
}

// 이미지 파일 추가
function addImageFile(id, e, file) {
    const div = document.getElementById(id);
    const imgElements = div.querySelector('img'); // div 요소 안의 모든 img 요소를 선택합니다.

    // 이미지가 이미 존재하는지 확인합니다.
    if (imgElements != null) {
        // 이미지의 src 속성을 변경합니다.
        $(imgElements).attr('src', e.target.result);
        $(imgElements).attr('data-file', file.name);
    } else {
        // 이미지가 없으면 새로 생성하여 추가합니다.
        const img = document.createElement('img');
        img.setAttribute('src', e.target.result);
        img.setAttribute('class', "product-image");
        img.setAttribute('width', "200px");
        img.setAttribute('data-file', file.name);
        div.appendChild(img);
    }
}
// 프로필 변경
$("#change-profile-image-finish-btn").click(function (e) {
    e.preventDefault();
    var files = $("#profile")[0].files[0];

    if (null != files) {
        var filesName = files.name;

        if (!(filesName.toLowerCase().endsWith("jpg") || filesName.toLowerCase().endsWith("png") || filesName.toLowerCase().endsWith("jpeg") || filesName.toLowerCase().endsWith("gif"))) {
            alert('gif/jpg/png 파일만 등록할 수 있습니다.');
            return false;
        } else if (files.size > 10000000) {
            alert("500MB 이하의 파일만 등록가능합니다.");
            return false;
        } else {

            if (confirm( "프로필 사진을 변경하시겠습니까?")) {

                const imageForm = document.getElementById('profile-form');
                const formData = new FormData(imageForm);

                $.ajax({
                     type: "post",
                     url: "/myPage/updateProfile",
                     contentType: false, // 필수: FormData를 사용하기 때문에 false로 설정
                     processData: false, // 필수: FormData를 사용하기 때문에 false로 설정
                     data: formData,
                     success: function(response){
                         alert("변경되었습니다.");
                     },
                     error: function(xhr, status, error) {
                         alert("변경 중 오류가 발생했습니다.");
                     }
                 });
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
            type: "post",
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
    emailCancel();
});

function emailCancel(){
    $("#email-area").css("display", "");
    $("#change-email-area").css("display", "none");
    $("#send-authentication-email").attr('class', 'n-btn btn-sm btn-accent disabled');
    $("#send-authentication-email").prop('disabled', true);
    $("#change-email-finish-btn").attr('class', 'n-btn btn-sm btn-accent disabled');
    $("#change-email-finish-btn").prop('disabled', true);
    $("#email").val("");
    $("#email-authTempKey").val("");
}

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

// 이메일 인증번호 전송
document.getElementById('send-authentication-email').addEventListener('click', function(e){
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
                data:{'email': emailValue},
                success: function(response){
                    alert("전송이 완료되었습니다.");
                    $("#send-authentication-email").attr('class', 'n-btn btn-sm btn-accent');
                    $("#send-authentication-email").prop('disabled', false);
                    $("#change-email-finish-btn").prop('disabled', false);
                },
                error: function(xhr, status, error) {
                    alert("전송중 오류가 발생했습니다.");
                }
            });
        }
    }
});

// 이메일 인증
document.getElementById('change-email-finish-btn').addEventListener('click', function(e){
    e.preventDefault();
    const emailValue = document.getElementById("email").value;
    const authCode = document.getElementById("email-authTempKey").value;
    const memberId = document.getElementById("member-id").value;
    $.ajax({
         type: "post",
         url: "/emailAuth",
         data:{'email': emailValue, 'code': authCode, 'memberId':memberId},
         success: function(response){
             alert("인증되었습니다.");
             document.getElementById("currentEmail").innerText=emailValue;
             emailCancel();
         },
         error: function(xhr, status, error) {
             alert("인증에 실패했습니다.");
         }
     });
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