/* 상품 상세 페이지 JavaScript - 개선된 버전 */

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeProductPage();
});

// 페이지 초기화
function initializeProductPage() {
    initializeQuantityControls();
    initializeSizeSelection();
    initializeImageGallery();
    initializeHeartButton();
    setupNotifications();
}

// 수량 컨트롤 초기화
function initializeQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            validateQuantity(this);
            updateTotalPrice();
        });
        
        quantityInput.addEventListener('blur', function() {
            validateQuantity(this);
        });
    }
}

// 사이즈 선택 초기화
function initializeSizeSelection() {
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    
    sizeInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateSizeSelection();
        });
    });
}

// 이미지 갤러리 초기화
function initializeImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            setActiveImage(this);
        });
    });
}

// 찜 버튼 초기화
function initializeHeartButton() {
    const heartBtn = document.querySelector('.btn-icon[onclick*="toggleHeart"]');
    
    if (heartBtn) {
        heartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleHeartStatus(this);
        });
    }
}

// 수량 유효성 검사
function validateQuantity(input) {
    let value = parseInt(input.value);
    
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 99) {
        value = 99;
    }
    
    input.value = value;
}

// 총 가격 업데이트
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const priceElement = document.getElementById('totalPrice');
    
    if (priceElement) {
        const unitPrice = parseInt(priceElement.dataset.price);
        const totalPrice = unitPrice * quantity;
        priceElement.textContent = totalPrice.toLocaleString() + '원';
    }
}

// 사이즈 선택 업데이트
function updateSizeSelection() {
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    if (selectedSize) {
        const associatedLabel = document.querySelector(`label[for="${selectedSize.id}"]`);
        if (associatedLabel) {
            associatedLabel.classList.add('active');
        }
    }
}

// 활성 이미지 설정
function setActiveImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailImg = thumbnail.querySelector('img');
    
    if (mainImage && thumbnailImg) {
        // 기존 active 클래스 제거
        document.querySelectorAll('.thumbnail-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 새로운 active 클래스 추가
        thumbnail.classList.add('active');
        
        // 메인 이미지 변경
        mainImage.src = thumbnailImg.src;
    }
}

// 찜 상태 토글
function toggleHeartStatus(button) {
    const productSeq = button.id;
    const isActive = button.classList.contains('active');
    
    showLoading();
    
    $.ajax({
        type: "POST",
        url: isActive ? "/heart/delete" : "/heart/add",
        data: { productSeq: productSeq },
        success: function(response) {
            hideLoading();
            
            if (response.success) {
                button.classList.toggle('active');
                const action = isActive ? '삭제' : '추가';
                showNotification(`찜 목록에서 ${action}되었습니다.`, 'success');
            } else {
                showNotification('로그인이 필요한 서비스입니다.', 'warning');
            }
        },
        error: function() {
            hideLoading();
            showNotification('오류가 발생했습니다. 다시 시도해주세요.', 'error');
        }
    });
}

// 장바구니 추가
function addCart() {
    try {
        console.log('장바구니 추가 시작');
        
        // 수량 확인
        const quantityElement = document.getElementById("quantity");
        if (!quantityElement) {
            console.error('수량 입력 필드를 찾을 수 없습니다.');
            showNotification('수량을 확인할 수 없습니다.', 'error');
            return;
        }
        const quantity = quantityElement.value;
        console.log('수량:', quantity);
        
        // 사이즈 선택 확인 (여러 방법으로 시도)
        let sizeInput = document.querySelector('.product-page input[name=size]:checked');
        if (!sizeInput) {
            sizeInput = document.querySelector('input[name=size]:checked');
        }
        
        if (!sizeInput) {
            console.error('사이즈가 선택되지 않았습니다.');
            showNotification('사이즈를 선택해주세요.', 'warning');
            return;
        }
        
        const productStockSeq = sizeInput.value;
        console.log('선택된 사이즈:', productStockSeq);
        
        showLoading();
        
        $.ajax({
            type: "GET",
            url: "/product/addProductCart",
            data: {
                quantity: quantity,
                productStockSeq: productStockSeq
            },
            success: function(response, textStatus, xhr) {
                console.log('응답 상태:', xhr.status);
                console.log('응답 데이터:', response);
                hideLoading();
                
                // HTTP 200 응답이면 성공으로 처리
                if (xhr.status === 200) {
                    showNotification('장바구니에 추가되었습니다.', 'success');
                    updateCartCount();
                } else {
                    showNotification('장바구니 추가에 실패했습니다.', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX 에러:', {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    error: error
                });
                
                hideLoading();
                
                if (xhr.status === 401) {
                    showNotification('로그인이 필요한 서비스입니다.', 'warning');
                } else if (xhr.status === 403) {
                    showNotification('권한이 없습니다.', 'warning');
                } else if (xhr.status === 500) {
                    showNotification('서버 오류가 발생했습니다.', 'error');
                } else {
                    showNotification('장바구니 추가에 실패했습니다. (상태: ' + xhr.status + ')', 'error');
                }
            }
        });
        
    } catch (e) {
        console.error('장바구니 추가 중 에러:', e);
        hideLoading();
        showNotification('오류가 발생했습니다: ' + e.message, 'error');
    }
}

// 바로구매
function purchaseNow() {
    const quantity = document.getElementById("quantity").value;
    const sizeInput = document.querySelector('input[name=size]:checked');
    
    if (!sizeInput) {
        showNotification('사이즈를 선택해주세요.', 'warning');
        return;
    }
    
    // 구매 페이지로 이동하는 로직
    showNotification('바로구매 기능 준비중입니다.', 'info');
}

// 리뷰 페이징
function paging(page, productSeq) {
    const reviewContainer = document.getElementById('reviews');
    
    if (reviewContainer) {
        // 로딩 표시
        reviewContainer.innerHTML = '<div class="loading-reviews"><i class="fas fa-spinner fa-spin"></i><p>리뷰를 불러오는 중...</p></div>';
        
        $.ajax({
            url: "/product/reviewList",
            type: 'POST',
            data: {
                page: page,
                productSeq: productSeq
            },
            dataType: 'html',
            success: function(data) {
                reviewContainer.innerHTML = data;
                reviewContainer.scrollIntoView({ behavior: 'smooth' });
            },
            error: function() {
                reviewContainer.innerHTML = '<div class="error-message"><p>리뷰를 불러오는데 실패했습니다.</p></div>';
            }
        });
    }
}

// 장바구니 개수 업데이트
function updateCartCount() {
    $.ajax({
        type: "GET",
        url: "/cart/count",
        dataType: "json",
        success: function(response) {
            const cartBadges = document.querySelectorAll('.cart-count');
            cartBadges.forEach(badge => {
                badge.textContent = response.count || 0;
            });
        }
    });
}

// 알림 시스템 설정
function setupNotifications() {
    // 알림 스타일이 이미 있는지 확인
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                background: white;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 350px;
                font-size: 14px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification i {
                font-size: 18px;
            }
            
            .notification.success {
                border-left: 4px solid #28a745;
            }
            .notification.success i {
                color: #28a745;
            }
            
            .notification.error {
                border-left: 4px solid #dc3545;
            }
            .notification.error i {
                color: #dc3545;
            }
            
            .notification.warning {
                border-left: 4px solid #ffc107;
            }
            .notification.warning i {
                color: #ffc107;
            }
            
            .notification.info {
                border-left: 4px solid #17a2b8;
            }
            .notification.info i {
                color: #17a2b8;
            }
            
            .loading-reviews {
                text-align: center;
                padding: 60px 20px;
                color: #6c757d;
            }
            
            .loading-reviews i {
                font-size: 24px;
                margin-bottom: 15px;
            }
            
            .error-message {
                text-align: center;
                padding: 60px 20px;
                color: #dc3545;
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
    }
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
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
    notification.className = `notification ${type}`;
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
    const existingLoader = document.querySelector('.page-loader');
    if (existingLoader) return;
    
    const loader = document.createElement('div');
    loader.className = 'page-loader';
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
        animation: spin 0.8s linear infinite;
    `;
    
    // 스피너 애니메이션 CSS 추가
    if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loader);
}

// 로딩 숨기기
function hideLoading() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.remove();
    }
}

// 리뷰 정렬 (기존 함수와 호환)
const ReviewSort = {
    apiCall: function(sortType) {
        const productSeq = new URLSearchParams(window.location.search).get('productSeq');
        if (productSeq) {
            paging(1, productSeq);
        }
    }
};

// 사이즈 선택 함수
function selectSize(labelElement) {
    // 모든 사이즈 버튼에서 active 클래스 제거
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    
    // 클릭된 버튼에 active 클래스 추가
    labelElement.classList.add('active');
    
    // 해당 라디오 버튼 체크
    const radioId = labelElement.getAttribute('for');
    const radioInput = document.getElementById(radioId);
    if (radioInput) {
        radioInput.checked = true;
        console.log('사이즈 선택됨:', radioInput.value);
    }
}

// 전역 함수로 내보내기 (기존 HTML과 호환)
window.addCart = addCart;
window.purchaseNow = purchaseNow;
window.paging = paging;
window.toggleHeart = toggleHeartStatus;
window.ReviewSort = ReviewSort;
window.selectSize = selectSize;