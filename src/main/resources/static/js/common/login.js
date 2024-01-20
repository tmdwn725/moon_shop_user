/*
로그인 js
*/

const time_to_show_login = 400;
const time_to_hidden_login = 200;


document.addEventListener("DOMContentLoaded", function(){
 if(document.getElementById('error').value){
    alert(document.getElementById('error').value);
 }
});

function change_to_login() {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";
    document.querySelector('.cont_form_login').style.display = "block";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";
    setTimeout(function(){  document.querySelector('.cont_form_login').style.opacity = "1"; },time_to_show_login);

    setTimeout(function(){
    document.querySelector('.cont_form_sign_up').style.display = "none";
    },time_to_hidden_login);

    $("#login_change").css("display", "none");
    $("#login").css("display", "block");
 }

  const time_to_show_sign_up = 100;
  const time_to_hidden_sign_up = 400;

function change_to_sign_up(at) {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_sign_up";
    document.querySelector('.cont_form_sign_up').style.display = "block";
    document.querySelector('.cont_form_login').style.opacity = "0";

    setTimeout( function(){
        document.querySelector('.cont_form_sign_up').style.opacity = "1";
    },time_to_show_sign_up);

    setTimeout( function(){
        document.querySelector('.cont_form_login').style.display = "none";
    },time_to_hidden_sign_up);
}

const time_to_hidden_all = 500;

function hidden_login_and_sign_up() {
    document.querySelector('.cont_forms').className = "cont_forms";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";
    document.querySelector('.cont_form_login').style.opacity = "0";

    setTimeout( function(){
        document.querySelector('.cont_form_sign_up').style.display = "none";
        document.querySelector('.cont_form_login').style.display = "none";
    },time_to_hidden_all );
 }

// 우편번호 찾기
document.getElementById("btn-zip-code-sch").addEventListener('click', function(){
    new daum.Postcode({
        oncomplete: function(data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        const address = ''; // 주소 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            address = data.roadAddress;
        } else { // 사용자가 지번 주소를 선택했을 경우(J)
            address = data.jibunAddress;
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        document.getElementById('zip-code').value = data.zonecode;
        document.getElementById("address").value = address;
        // 커서를 상세주소 필드로 이동한다.
        document.getElementById("detail-address").focus();
        }
    }).open();
});

// 아이디 중복 확인
document.getElementById("id-dup-chk").addEventListener('click', function(){
    const memberId = document.getElementById("member-id").value;
    $.ajax({
        type: "POST",
        url: "/idDupChk",
        data: {memberId: memberId},
        success: function(response){
            if(response.dupYn == 'N'){
                document.getElementById("member-id-chk-yn").value="Y";
                alert("사용할 수 있는 아이디입니다.");
            }else {
                document.getElementById("member-id-chk-yn").value="N";
                alert("이미존재하는 아이디입니다.");
            }
        },
        error: function(xhr, status, error) {
            alert("중복확인에 실패했습니다. 다시 시도해주세요");
        }
    });
});

// 회원가입
document.getElementById("btn-sign-up").addEventListener('click',function(){

    const param = {
        email : document.getElementById("email").value,
        name : document.getElementById("member-name").value,
        memberId : document.getElementById("member-id").value,
        password : document.getElementById("member-pw").value,
        telNo : document.getElementById("tel-no").value,
        zipCode : document.getElementById("zip-code").value,
        address : document.getElementById("address").value,
        detailAddress : document.getElementById("detail-address").value
    }

    const confirmPassword = document.getElementById('confirm-pw').value;
    const idChkYn = document.getElementById("member-id-chk-yn").value;

    if (param.password === '') {
        alert('현재 비밀번호를 입력해주세요.');
        return false;
    }

    if (param.password.length < 4) {
        alert('비밀번호 4자 이상이여야합니다.');
        return false;
    }

    if (param.password !== confirmPassword) {
        alert('비밀번호와 재입력 비밀번호가 같지 않습니다.');
        document.getElementById('confirm-pw').value= "";
        document.getElementById('member-pw').value= "";
        return false;
    }

    if(idChkYn == 'N') {
        alert("아이디 중복확인해주시기 바랍니다.");
        return false;
    }

     $.ajax({
        type: "POST",
        url: "/signUp",
        data: param,
        success: function(response){
            alert("가입되었습니다. 다시 로그인해주세요");
            location.reload(true);
        },
        error: function(xhr, status, error) {
            alert("가입에 실패했습니다. 다시 시도해주세요");
        }
    });
});