/* 마이페이지 JavaScript - 모던 무채색 디자인에 맞춘 개선된 버전 */

// 정규식 상수들
const letterRegExp = new RegExp("[a-z]");
const capsLockRegExp = new RegExp("[A-Z]");
const numberRegExp = new RegExp("[0-9]");
const symbolRegExp = new RegExp("\\W");

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeMyPage();
});

// 페이지 초기화
function initializeMyPage() {
    setupProfileImageUpload();
    setupPasswordModal();
    setupEmailModal();
    setupToastNotifications();
    
    console.log('마이페이지 초기화 완료');
}

// 프로필 이미지 업로드 설정
function setupProfileImageUpload() {
    const profileEditBtn = document.getElementById('profile-edit-btn');
    const profileUpload = document.getElementById('profile-upload');
    
    if (profileEditBtn && profileUpload) {
        profileEditBtn.addEventListener('click', function() {
            profileUpload.click();
        });
        
        profileUpload.addEventListener('change', handleProfileImageChange);
    }
}

// 프로필 이미지 변경 처리
function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 파일 타입 검증
    if (!file.type.match("image/*")) {
        showNotification('이미지 파일만 업로드 가능합니다.', 'error');
        return;
    }
    
    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('10MB 이하의 이미지만 업로드 가능합니다.', 'error');
        return;
    }
    
    // 이미지 미리보기
    const reader = new FileReader();
    reader.onload = function(e) {
        const currentImage = document.getElementById('current-profile-image');
        const placeholder = document.querySelector('.profile-image-placeholder');
        
        if (currentImage) {
            currentImage.src = e.target.result;
        } else if (placeholder) {
            // 플레이스홀더를 이미지로 교체
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Profile Image';
            img.className = 'profile-image';
            img.id = 'current-profile-image';
            placeholder.parentNode.replaceChild(img, placeholder);
        }
    };
    reader.readAsDataURL(file);
    
    // 서버에 업로드
    uploadProfileImage(file);
}

// 프로필 이미지 업로드
function uploadProfileImage(file) {
    const formData = new FormData();
    formData.append('profile', file);
    
    showLoading();
    
    $.ajax({
        type: "POST",
        url: "/myPage/updateProfile",
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            hideLoading();
            showNotification('프로필 이미지가 변경되었습니다.', 'success');
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('프로필 이미지 업로드 실패:', error);
            showNotification('프로필 이미지 변경에 실패했습니다.', 'error');
        }
    });
}

// 비밀번호 모달 설정
function setupPasswordModal() {
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordModal = document.getElementById('passwordModal');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            showPasswordModal();
        });
    }
    
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', handlePasswordChange);
    }
    
    // 입력 검증 이벤트
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (currentPassword) currentPassword.addEventListener('input', validatePasswordForm);
    if (newPassword) newPassword.addEventListener('input', validateNewPassword);
    if (confirmPassword) confirmPassword.addEventListener('input', validatePasswordForm);
}

// 비밀번호 모달 표시
function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.style.display = 'block';
        resetPasswordForm();
    }
}

// 비밀번호 모달 닫기
function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.style.display = 'none';
        resetPasswordForm();
    }
}

// 비밀번호 폼 리셋
function resetPasswordForm() {
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // 에러 메시지 초기화
    document.getElementById('currentPasswordError').textContent = '';
    document.getElementById('newPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
    
    // 버튼 비활성화
    document.getElementById('savePasswordBtn').disabled = true;
}

// 새 비밀번호 유효성 검증
function validateNewPassword() {
    const newPassword = document.getElementById('newPassword');
    const errorElement = document.getElementById('newPasswordError');
    const password = newPassword.value;
    
    if (!password) {
        errorElement.textContent = '';
        validatePasswordForm();
        return;
    }
    
    if (password.length < 8) {
        errorElement.textContent = '8자리 이상 입력해 주세요.';
        validatePasswordForm();
        return;
    }
    
    if (checkFourConsecutiveChar(password)) {
        errorElement.textContent = '4개 이상 연속으로 동일한 문자는 사용할 수 없습니다.';
        validatePasswordForm();
        return;
    }
    
    if (!isValidPassword(password)) {
        errorElement.textContent = '숫자, 영문 대소문자, 특수문자 중 두 가지 이상 조합해 주세요.';
        validatePasswordForm();
        return;
    }
    
    errorElement.textContent = '';
    validatePasswordForm();
}

// 비밀번호 폼 전체 검증
function validatePasswordForm() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const saveBtn = document.getElementById('savePasswordBtn');
    
    const currentPasswordError = document.getElementById('currentPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    // 현재 비밀번호 검증
    if (currentPassword && currentPassword.length < 4) {
        currentPasswordError.textContent = '현재 비밀번호를 정확히 입력해 주세요.';
    } else {
        currentPasswordError.textContent = '';
    }
    
    // 비밀번호 확인 검증
    if (confirmPassword && newPassword !== confirmPassword) {
        confirmPasswordError.textContent = '비밀번호가 일치하지 않습니다.';
    } else {
        confirmPasswordError.textContent = '';
    }
    
    // 전체 폼 유효성 검증
    const isValid = currentPassword.length >= 4 &&
                   newPassword.length >= 8 &&
                   confirmPassword.length >= 8 &&
                   newPassword === confirmPassword &&
                   !document.getElementById('newPasswordError').textContent &&
                   !document.getElementById('currentPasswordError').textContent;
    
    saveBtn.disabled = !isValid;
}

// 비밀번호 변경 처리
function handlePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (currentPassword === newPassword) {
        showNotification('현재 비밀번호와 새 비밀번호가 같습니다.', 'warning');
        return;
    }
    
    showLoading();
    
    $.ajax({
        type: "POST",
        url: "/myPage/changePassword",
        data: {
            password: currentPassword,
            newPassword: newPassword
        },
        dataType: "json",
        success: function(response) {
            hideLoading();
            closePasswordModal();
            
            if (response.result === 'success') {
                showNotification('비밀번호가 변경되었습니다.', 'success');
            } else {
                showNotification(response.message || '비밀번호 변경에 실패했습니다.', 'error');
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('비밀번호 변경 실패:', error);
            showNotification('비밀번호 변경 중 오류가 발생했습니다.', 'error');
        }
    });
}

// 이메일 모달 설정
function setupEmailModal() {
    const changeEmailBtn = document.getElementById('change-email-btn');
    const emailModal = document.getElementById('emailModal');
    const sendVerificationBtn = document.getElementById('sendVerificationBtn');
    const saveEmailBtn = document.getElementById('saveEmailBtn');
    
    if (changeEmailBtn) {
        changeEmailBtn.addEventListener('click', showEmailModal);
    }
    
    if (sendVerificationBtn) {
        sendVerificationBtn.addEventListener('click', sendEmailVerification);
    }
    
    if (saveEmailBtn) {
        saveEmailBtn.addEventListener('click', handleEmailChange);
    }
    
    // 이메일 입력 검증
    const newEmailInput = document.getElementById('newEmail');
    if (newEmailInput) {
        newEmailInput.addEventListener('input', validateEmailForm);
    }
    
    // 인증번호 입력 검증
    const verificationCodeInput = document.getElementById('emailVerificationCode');
    if (verificationCodeInput) {
        verificationCodeInput.addEventListener('input', validateEmailForm);
    }
}

// 이메일 모달 표시
function showEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'block';
        resetEmailForm();
    }
}

// 이메일 모달 닫기
function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'none';
        resetEmailForm();
    }
}

// 이메일 폼 리셋
function resetEmailForm() {
    document.getElementById('newEmail').value = '';
    document.getElementById('emailVerificationCode').value = '';
    document.getElementById('emailVerificationCode').disabled = true;
    
    // 에러 메시지 초기화
    document.getElementById('newEmailError').textContent = '';
    document.getElementById('verificationError').textContent = '';
    
    // 버튼 상태 초기화
    document.getElementById('sendVerificationBtn').disabled = true;
    document.getElementById('saveEmailBtn').disabled = true;
}

// 이메일 폼 검증
function validateEmailForm() {
    const email = document.getElementById('newEmail').value;
    const verificationCode = document.getElementById('emailVerificationCode').value;
    const sendBtn = document.getElementById('sendVerificationBtn');
    const saveBtn = document.getElementById('saveEmailBtn');
    
    // 이메일 유효성 검증
    const isValidEmailFormat = isValidEmail(email);
    sendBtn.disabled = !isValidEmailFormat;
    
    if (email && !isValidEmailFormat) {
        document.getElementById('newEmailError').textContent = '올바른 이메일 형식을 입력해 주세요.';
    } else {
        document.getElementById('newEmailError').textContent = '';
    }
    
    // 인증번호 입력 검증
    const hasVerificationCode = verificationCode.length >= 4;
    saveBtn.disabled = !(isValidEmailFormat && hasVerificationCode);
}

// 이메일 인증번호 발송
function sendEmailVerification() {
    const email = document.getElementById('newEmail').value;
    
    if (!isValidEmail(email)) {
        showNotification('올바른 이메일 주소를 입력해 주세요.', 'warning');
        return;
    }
    
    showLoading();
    
    $.ajax({
        type: "POST",
        url: "/sendEmail",
        data: { email: email },
        success: function(response) {
            hideLoading();
            showNotification('인증번호가 발송되었습니다.', 'success');
            document.getElementById('emailVerificationCode').disabled = false;
            document.getElementById('emailVerificationCode').focus();
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('이메일 발송 실패:', error);
            showNotification('인증번호 발송에 실패했습니다.', 'error');
        }
    });
}

// 이메일 변경 처리
function handleEmailChange() {
    const email = document.getElementById('newEmail').value;
    const verificationCode = document.getElementById('emailVerificationCode').value;
    const memberId = document.getElementById('member-id').value;
    
    showLoading();
    
    $.ajax({
        type: "POST",
        url: "/emailAuth",
        data: {
            email: email,
            code: verificationCode,
            memberId: memberId
        },
        success: function(response) {
            hideLoading();
            closeEmailModal();
            showNotification('이메일이 변경되었습니다.', 'success');
            
            // 페이지의 이메일 정보 업데이트
            const emailDisplay = document.querySelector('.info-value span');
            if (emailDisplay) {
                emailDisplay.textContent = email;
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('이메일 변경 실패:', error);
            showNotification('인증에 실패했습니다. 다시 시도해 주세요.', 'error');
        }
    });
}

// 토스트 알림 시스템 설정
function setupToastNotifications() {
    // 토스트 스타일이 이미 있는지 확인
    if (!document.getElementById('mypage-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'mypage-notification-styles';
        style.textContent = `
            .mypage-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 8px;
                background: white;
                border: 1px solid #e9ecef;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 350px;
                font-size: 14px;
            }
            
            .mypage-notification.show {
                transform: translateX(0);
            }
            
            .mypage-notification i {
                font-size: 18px;
            }
            
            .mypage-notification.success {
                border-left: 4px solid #28a745;
            }
            .mypage-notification.success i {
                color: #28a745;
            }
            
            .mypage-notification.error {
                border-left: 4px solid #dc3545;
            }
            .mypage-notification.error i {
                color: #dc3545;
            }
            
            .mypage-notification.warning {
                border-left: 4px solid #ffc107;
            }
            .mypage-notification.warning i {
                color: #ffc107;
            }
            
            .mypage-notification.info {
                border-left: 4px solid #17a2b8;
            }
            .mypage-notification.info i {
                color: #17a2b8;
            }
            
            @media (max-width: 480px) {
                .mypage-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.mypage-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 아이콘 매핑
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-times-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `mypage-notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons['info']}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션 적용
    setTimeout(() => notification.classList.add('show'), 10);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 로딩 표시
function showLoading() {
    const existingLoader = document.querySelector('.mypage-loader');
    if (existingLoader) return;
    
    const loader = document.createElement('div');
    loader.className = 'mypage-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    const spinner = loader.querySelector('.loader-spinner');
    spinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 3px solid #e9ecef;
        border-top-color: #1a1a1a;
        border-radius: 50%;
        animation: mypageSpin 0.8s linear infinite;
    `;
    
    // 스피너 애니메이션 CSS 추가
    if (!document.getElementById('mypage-spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'mypage-spinner-styles';
        style.textContent = `
            @keyframes mypageSpin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loader);
}

// 로딩 숨기기
function hideLoading() {
    const loader = document.querySelector('.mypage-loader');
    if (loader) {
        loader.remove();
    }
}

// 유틸리티 함수들
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
    
    return violationCnt <= 2;
}

function getPasswordRulePoint(password) {
    var point = 0;
    if (letterRegExp.test(password)) {
        point += 4;
    }
    
    if (capsLockRegExp.test(password)) {
        point += 4;
    }
    
    if (numberRegExp.test(password)) {
        point += 4;
    }
    
    if (symbolRegExp.test(password)) {
        point += 4;
    }
    
    return point;
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    const passwordModal = document.getElementById('passwordModal');
    const emailModal = document.getElementById('emailModal');
    
    if (e.target === passwordModal) {
        closePasswordModal();
    }
    
    if (e.target === emailModal) {
        closeEmailModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePasswordModal();
        closeEmailModal();
    }
});

// 전역 함수로 등록 (HTML과 호환)
window.closePasswordModal = closePasswordModal;
window.closeEmailModal = closeEmailModal;

console.log('마이페이지 JavaScript 로드 완료');