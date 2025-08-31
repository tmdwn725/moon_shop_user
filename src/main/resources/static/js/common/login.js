/* 로그인/회원가입 JavaScript */

document.addEventListener("DOMContentLoaded", function() {
    // 초기화
    initializeEventListeners();
    
    // 에러 메시지 처리
    const errorElement = document.getElementById('error');
    if(errorElement && errorElement.value) {
        showNotification(errorElement.value, 'error');
    }
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 폼 전환 버튼
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    
    if(showSignupBtn) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSignupForm();
        });
    }
    
    if(showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }
    
    // 로그인 폼 제출
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            if(!validateLoginForm()) {
                e.preventDefault();
            } else {
                showLoading();
            }
        });
    }
    
    // 아이디 중복 확인
    const idDupChkBtn = document.getElementById('id-dup-chk');
    if(idDupChkBtn) {
        idDupChkBtn.addEventListener('click', checkDuplicateId);
    }
    
    // 우편번호 찾기
    const zipCodeBtn = document.getElementById('btn-zip-code-sch');
    if(zipCodeBtn) {
        zipCodeBtn.addEventListener('click', searchZipCode);
    }
    
    // 회원가입 버튼
    const signUpBtn = document.getElementById('btn-sign-up');
    if(signUpBtn) {
        signUpBtn.addEventListener('click', handleSignUp);
    }
    
    // 입력 필드 실시간 유효성 검사
    setupRealtimeValidation();
}

// 로그인 폼 표시
function showLoginForm() {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    loginContainer.style.animation = 'fadeIn 0.5s ease';
}

// 회원가입 폼 표시
function showSignupForm() {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
    signupContainer.style.animation = 'fadeIn 0.5s ease';
}

// 로그인 폼 유효성 검사
function validateLoginForm() {
    const memberId = document.getElementById('memberId').value.trim();
    const password = document.getElementById('password').value;
    
    if(!memberId) {
        showNotification('아이디를 입력해주세요.', 'warning');
        document.getElementById('memberId').focus();
        return false;
    }
    
    if(!password) {
        showNotification('비밀번호를 입력해주세요.', 'warning');
        document.getElementById('password').focus();
        return false;
    }
    
    return true;
}

// 아이디 중복 확인
function checkDuplicateId() {
    const memberId = document.getElementById('member-id').value.trim();
    
    if(!memberId) {
        showNotification('아이디를 입력해주세요.', 'warning');
        document.getElementById('member-id').focus();
        return;
    }
    
    if(memberId.length < 4) {
        showNotification('아이디는 4자 이상이어야 합니다.', 'warning');
        return;
    }
    
    showLoading();
    
    $.ajax({
        type: "POST",
        url: "/idDupChk",
        data: { memberId: memberId },
        success: function(response) {
            hideLoading();
            if(response.dupYn === 'N') {
                document.getElementById("member-id-chk-yn").value = "Y";
                showNotification('사용 가능한 아이디입니다.', 'success');
                // 아이디 필드를 읽기 전용으로 설정
                document.getElementById('member-id').style.backgroundColor = '#f0f8ff';
            } else {
                document.getElementById("member-id-chk-yn").value = "N";
                showNotification('이미 사용중인 아이디입니다.', 'error');
                document.getElementById('member-id').focus();
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            showNotification('중복 확인에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    });
}

// 우편번호 찾기
function searchZipCode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 도로명 주소 우선 사용
            const address = data.roadAddress || data.jibunAddress;
            
            // 입력 필드에 값 설정
            document.getElementById('zip-code').value = data.zonecode;
            document.getElementById('address').value = address;
            
            // 상세주소 필드로 포커스 이동
            document.getElementById('detail-address').focus();
            
            showNotification('주소가 입력되었습니다.', 'success');
        }
    }).open();
}

// 회원가입 처리
function handleSignUp() {
    // 유효성 검사
    if(!validateSignUpForm()) {
        return;
    }
    
    const param = {
        email: document.getElementById("email").value.trim(),
        name: document.getElementById("member-name").value.trim(),
        memberId: document.getElementById("member-id").value.trim(),
        password: document.getElementById("member-pw").value,
        telNo: document.getElementById("tel-no").value.replace(/-/g, ''),
        zipCode: document.getElementById("zip-code").value,
        address: document.getElementById("address").value,
        detailAddress: document.getElementById("detail-address").value.trim()
    };
    
    showLoading();
    
    $.ajax({
        type: "POST",
        url: "/signUp",
        data: param,
        success: function(response) {
            hideLoading();
            showNotification('회원가입이 완료되었습니다. 로그인해주세요.', 'success');
            
            // 2초 후 로그인 폼으로 전환
            setTimeout(function() {
                showLoginForm();
                // 가입한 아이디를 로그인 폼에 자동 입력
                document.getElementById('memberId').value = param.memberId;
                document.getElementById('password').focus();
            }, 2000);
        },
        error: function(xhr, status, error) {
            hideLoading();
            showNotification('회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    });
}

// 회원가입 폼 유효성 검사
function validateSignUpForm() {
    const email = document.getElementById("email").value.trim();
    const memberId = document.getElementById("member-id").value.trim();
    const password = document.getElementById("member-pw").value;
    const confirmPw = document.getElementById("confirm-pw").value;
    const name = document.getElementById("member-name").value.trim();
    const telNo = document.getElementById("tel-no").value.trim();
    const zipCode = document.getElementById("zip-code").value;
    const address = document.getElementById("address").value;
    const detailAddress = document.getElementById("detail-address").value.trim();
    const idChkYn = document.getElementById("member-id-chk-yn").value;
    const agreeTerms = document.getElementById("agree-terms").checked;
    
    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        showNotification('올바른 이메일 형식을 입력해주세요.', 'warning');
        document.getElementById('email').focus();
        return false;
    }
    
    // 아이디 중복 확인 여부
    if(idChkYn !== 'Y') {
        showNotification('아이디 중복확인을 해주세요.', 'warning');
        return false;
    }
    
    // 비밀번호 검증
    if(password.length < 4) {
        showNotification('비밀번호는 4자 이상이어야 합니다.', 'warning');
        document.getElementById('member-pw').focus();
        return false;
    }
    
    if(password !== confirmPw) {
        showNotification('비밀번호가 일치하지 않습니다.', 'warning');
        document.getElementById('confirm-pw').value = '';
        document.getElementById('confirm-pw').focus();
        return false;
    }
    
    // 이름 검증
    if(name.length < 2) {
        showNotification('이름을 올바르게 입력해주세요.', 'warning');
        document.getElementById('member-name').focus();
        return false;
    }
    
    // 전화번호 검증
    const telRegex = /^[0-9]{10,11}$/;
    if(!telRegex.test(telNo.replace(/-/g, ''))) {
        showNotification('올바른 전화번호를 입력해주세요.', 'warning');
        document.getElementById('tel-no').focus();
        return false;
    }
    
    // 주소 검증
    if(!zipCode || !address) {
        showNotification('우편번호 찾기를 통해 주소를 입력해주세요.', 'warning');
        return false;
    }
    
    if(!detailAddress) {
        showNotification('상세주소를 입력해주세요.', 'warning');
        document.getElementById('detail-address').focus();
        return false;
    }
    
    // 이용약관 동의
    if(!agreeTerms) {
        showNotification('이용약관에 동의해주세요.', 'warning');
        return false;
    }
    
    return true;
}

// 실시간 유효성 검사 설정
function setupRealtimeValidation() {
    // 비밀번호 확인 실시간 검사
    const confirmPwInput = document.getElementById('confirm-pw');
    if(confirmPwInput) {
        confirmPwInput.addEventListener('blur', function() {
            const password = document.getElementById('member-pw').value;
            const confirmPw = this.value;
            
            if(confirmPw && password !== confirmPw) {
                this.style.borderColor = '#dc3545';
                showNotification('비밀번호가 일치하지 않습니다.', 'warning');
            } else if(confirmPw && password === confirmPw) {
                this.style.borderColor = '#28a745';
            }
        });
    }
    
    // 아이디 변경 시 중복확인 초기화
    const memberIdInput = document.getElementById('member-id');
    if(memberIdInput) {
        memberIdInput.addEventListener('input', function() {
            document.getElementById('member-id-chk-yn').value = 'N';
            this.style.backgroundColor = '';
        });
    }
    
    // 전화번호 자동 포맷팅
    const telNoInput = document.getElementById('tel-no');
    if(telNoInput) {
        telNoInput.addEventListener('input', function() {
            let value = this.value.replace(/[^0-9]/g, '');
            if(value.length > 11) {
                value = value.slice(0, 11);
            }
            this.value = value;
        });
    }
}

// 알림 메시지 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if(existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getIconByType(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션 추가
    setTimeout(() => notification.classList.add('show'), 10);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 알림 타입별 아이콘
function getIconByType(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'times-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || icons['info'];
}

// 로딩 표시
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

// 로딩 숨기기
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// 알림 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification i {
        font-size: 20px;
    }
    
    .notification-success {
        border-left: 4px solid #28a745;
    }
    
    .notification-success i {
        color: #28a745;
    }
    
    .notification-error {
        border-left: 4px solid #dc3545;
    }
    
    .notification-error i {
        color: #dc3545;
    }
    
    .notification-warning {
        border-left: 4px solid #ffc107;
    }
    
    .notification-warning i {
        color: #ffc107;
    }
    
    .notification-info {
        border-left: 4px solid #17a2b8;
    }
    
    .notification-info i {
        color: #17a2b8;
    }
    
    @media (max-width: 480px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);