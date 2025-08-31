// 기존 refund 함수 (하위 호환성 유지)
function refund(paymentSeq){
    refundPayment(paymentSeq);
}

// 새로운 refundPayment 함수 - 올바른 URL 사용
function refundPayment(paymentSeq) {
    if (!paymentSeq) {
        alert('결제 정보가 없습니다.');
        return;
    }
    
    // 확인 대화상자
    if (!confirm('정말로 결제를 취소하시겠습니까?')) {
        return;
    }
    
    // 로딩 표시
    showLoading();
    
    $.ajax({
        type: "POST",
        url: "/myPage/refund",
        data: { paymentSeq: paymentSeq },
        dataType: "json",
        success: function(response) {
            hideLoading();
            
            // JSON 응답 처리
            if (typeof response === 'string') {
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    console.log('응답이 이미 JSON 형식이 아닙니다.');
                }
            }
            
            if (response && response.success) {
                alert(response.message || '결제가 성공적으로 취소되었습니다.');
            } else {
                alert(response.message || '결제 취소에 실패했습니다.');
            }
            
            // 페이지 새로고침
            window.location.reload();
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('결제 취소 오류:', error);
            
            if (xhr.status === 400) {
                alert('잘못된 요청입니다.');
            } else if (xhr.status === 401) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            } else if (xhr.status === 500) {
                alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } else {
                alert('결제 취소에 실패했습니다. 다시 시도해주세요.');
            }
        }
    });
}

// 로딩 표시 함수
function showLoading() {
    const existingLoader = document.querySelector('.order-loader');
    if (existingLoader) return;
    
    const loader = document.createElement('div');
    loader.className = 'order-loader';
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
        animation: orderSpin 0.8s linear infinite;
    `;
    
    // 스피너 애니메이션 CSS 추가
    if (!document.getElementById('order-spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'order-spinner-styles';
        style.textContent = `
            @keyframes orderSpin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loader);
}

// 로딩 숨기기
function hideLoading() {
    const loader = document.querySelector('.order-loader');
    if (loader) {
        loader.remove();
    }
}