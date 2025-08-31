/* 장바구니 페이지 JavaScript - 모던 무채색 디자인에 맞춘 개선된 버전 */

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
});

// 페이지 초기화
function initializeCartPage() {
    setupNotifications();
    initializeQuantityControls();
    initializeModal();
    updateCartSummary();
    
    // 전역 함수로 등록 (기존 HTML과 호환)
    window.updateQuantity = updateQuantity;
    window.updateTotalPrice = updateTotalPrice;
    window.removeCartItem = removeCartItem;
    window.selectAllItems = selectAllItems;
    window.removeSelectedItems = removeSelectedItems;
    window.proceedToCheckout = proceedToCheckout;
    window.applyCoupon = applyCoupon;
    window.closeModal = closeModal;
}

// 수량 컨트롤 초기화
function initializeQuantityControls() {
    // 수량 입력 필드에 이벤트 리스너 추가
    document.querySelectorAll('.quantity-selector input[type="number"]').forEach(input => {
        input.addEventListener('change', function() {
            validateQuantity(this);
            const cartSeq = getCartSeqFromElement(this);
            updateTotalPrice(cartSeq);
            updateCartSummary();
        });
        
        input.addEventListener('blur', function() {
            validateQuantity(this);
        });
    });
}

// 수량 업데이트 함수 (+ / - 버튼용)
function updateQuantity(cartSeq, change) {
    try {
        console.log('수량 업데이트:', cartSeq, change);
        
        const quantityInput = document.getElementById('quantity' + cartSeq);
        if (!quantityInput) {
            console.error('수량 입력 필드를 찾을 수 없습니다:', cartSeq);
            return;
        }
        
        let currentQuantity = parseInt(quantityInput.value) || 1;
        let newQuantity = currentQuantity + change;
        
        // 수량 제한
        if (newQuantity < 1) {
            newQuantity = 1;
        } else if (newQuantity > 99) {
            newQuantity = 99;
            showNotification('최대 99개까지 구매 가능합니다.', 'warning');
        }
        
        quantityInput.value = newQuantity;
        updateTotalPrice(cartSeq);
        updateCartSummary();
        
        // 서버에 수량 변경 요청
        updateQuantityOnServer(cartSeq, newQuantity);
        
    } catch (error) {
        console.error('수량 업데이트 중 에러:', error);
        showNotification('수량 업데이트 중 오류가 발생했습니다.', 'error');
    }
}

// 상품별 총가격 업데이트
function updateTotalPrice(cartSeq) {
    try {
        const quantityInput = document.getElementById('quantity' + cartSeq);
        const priceInput = document.getElementById('price' + cartSeq);
        const totalElement = document.getElementById('total' + cartSeq);
        
        if (!quantityInput || !priceInput || !totalElement) {
            console.error('필수 요소를 찾을 수 없습니다:', cartSeq);
            return;
        }
        
        const quantity = parseInt(quantityInput.value) || 1;
        const price = parseInt(priceInput.value) || 0;
        const total = price * quantity;
        
        totalElement.textContent = formatPrice(total) + '원';
        
        console.log('가격 업데이트:', { cartSeq, quantity, price, total });
        
    } catch (error) {
        console.error('가격 업데이트 중 에러:', error);
    }
}

// 서버에 수량 변경 요청
function updateQuantityOnServer(cartSeq, quantity) {
    $.ajax({
        type: "POST",
        url: "/cart/updateProductQuantity",
        data: {
            cartSeq: cartSeq,
            quantity: quantity
        },
        dataType: "json",
        success: function(response) {
            console.log('수량 변경 성공:', response);
            if (response.success) {
                // 성공 시 특별한 동작 없음 (UI는 이미 업데이트됨)
            } else {
                showNotification(response.message || '수량 변경에 실패했습니다.', 'error');
            }
        },
        error: function(xhr, status, error) {
            console.error('수량 변경 실패:', error);
            showNotification('수량 변경에 실패했습니다.', 'error');
        }
    });
}

// 장바구니 아이템 삭제
function removeCartItem(cartSeq) {
    showConfirmModal(
        '상품을 장바구니에서 삭제하시겠습니까?',
        function() {
            performRemoveCartItem(cartSeq);
        }
    );
}

// 실제 장바구니 아이템 삭제 수행
function performRemoveCartItem(cartSeq) {
    showLoading();
    
    $.ajax({
        url: "/cart/removeCartInfo",
        type: "DELETE",
        data: { cartSeq: cartSeq },
        dataType: "json",
        success: function(response) {
            hideLoading();
            
            if (response.success) {
                showNotification('상품이 장바구니에서 삭제되었습니다.', 'success');
                
                // 아이템 요소 제거 (애니메이션 적용)
                const cartItem = document.querySelector(`[data-cart-seq="${cartSeq}"]`);
                if (cartItem) {
                    cartItem.style.transform = 'translateX(-100%)';
                    cartItem.style.opacity = '0';
                    setTimeout(() => {
                        cartItem.remove();
                        updateCartSummary();
                        checkEmptyCart();
                    }, 300);
                } else {
                    // 페이지 새로고침으로 fallback
                    window.location.reload();
                }
            } else {
                showNotification(response.message || '삭제에 실패했습니다.', 'error');
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('삭제 실패:', error);
            showNotification('삭제에 실패했습니다.', 'error');
        }
    });
}

// 전체 선택/해제
function selectAllItems() {
    const cartItems = document.querySelectorAll('.cart-item');
    const allSelected = Array.from(cartItems).every(item => item.classList.contains('selected'));
    
    cartItems.forEach(item => {
        if (allSelected) {
            item.classList.remove('selected');
        } else {
            item.classList.add('selected');
        }
    });
    
    const action = allSelected ? '해제' : '선택';
    showNotification(`전체 상품이 ${action}되었습니다.`, 'info');
}

// 선택 상품 삭제
function removeSelectedItems() {
    const selectedItems = document.querySelectorAll('.cart-item.selected');
    
    if (selectedItems.length === 0) {
        showNotification('삭제할 상품을 선택해주세요.', 'warning');
        return;
    }
    
    showConfirmModal(
        `선택한 ${selectedItems.length}개 상품을 삭제하시겠습니까?`,
        function() {
            const cartSeqs = Array.from(selectedItems).map(item => 
                item.getAttribute('data-cart-seq')
            );
            
            performRemoveMultipleItems(cartSeqs);
        }
    );
}

// 여러 아이템 삭제 수행
function performRemoveMultipleItems(cartSeqs) {
    showLoading();
    
    Promise.all(cartSeqs.map(cartSeq => 
        $.ajax({
            url: "/cart/removeCartInfo",
            type: "DELETE",
            data: { cartSeq: cartSeq },
            dataType: "json"
        })
    )).then(() => {
        hideLoading();
        showNotification('선택한 상품들이 삭제되었습니다.', 'success');
        window.location.reload();
    }).catch(error => {
        hideLoading();
        console.error('다중 삭제 실패:', error);
        showNotification('일부 상품 삭제에 실패했습니다.', 'error');
        window.location.reload();
    });
}

// 주문하기
function proceedToCheckout() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartItems.length === 0) {
        showNotification('장바구니에 상품이 없습니다.', 'warning');
        return;
    }
    
    // 수량 검증
    let hasInvalidQuantity = false;
    cartItems.forEach(item => {
        const quantityInput = item.querySelector('input[type="number"]');
        if (quantityInput && (parseInt(quantityInput.value) < 1 || parseInt(quantityInput.value) > 99)) {
            hasInvalidQuantity = true;
        }
    });
    
    if (hasInvalidQuantity) {
        showNotification('올바른 수량을 입력해주세요.', 'warning');
        return;
    }
    
    // 폼 제출
    const form = document.getElementById('myCart');
    if (form) {
        showLoading();
        form.submit();
    } else {
        showNotification('주문 정보를 찾을 수 없습니다.', 'error');
    }
}

// 쿠폰 적용
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim();
    
    if (!couponCode) {
        showNotification('쿠폰 코드를 입력해주세요.', 'warning');
        return;
    }
    
    showLoading();
    
    // 쿠폰 적용 API 호출 (예시)
    $.ajax({
        url: "/coupon/apply",
        type: "POST",
        data: { couponCode: couponCode },
        success: function(response) {
            hideLoading();
            if (response.success) {
                showNotification('쿠폰이 적용되었습니다.', 'success');
                updateCartSummary();
                document.getElementById('couponCode').value = '';
            } else {
                showNotification(response.message || '유효하지 않은 쿠폰입니다.', 'warning');
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('쿠폰 적용 실패:', error);
            showNotification('쿠폰 적용에 실패했습니다.', 'error');
        }
    });
}

// 장바구니 요약 정보 업데이트
function updateCartSummary() {
    try {
        let subtotal = 0;
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(item => {
            const quantityInput = item.querySelector('input[type="number"]');
            const priceInput = item.querySelector('input[id^="price"]');
            
            if (quantityInput && priceInput) {
                const quantity = parseInt(quantityInput.value) || 0;
                const price = parseInt(priceInput.value) || 0;
                subtotal += price * quantity;
            }
        });
        
        // 요약 정보 업데이트
        const subtotalElement = document.getElementById('subtotalAmount');
        const totalElement = document.getElementById('totalAmount');
        
        if (subtotalElement) {
            subtotalElement.textContent = formatPrice(subtotal) + '원';
        }
        if (totalElement) {
            totalElement.textContent = formatPrice(subtotal) + '원';
        }
        
        console.log('장바구니 요약 업데이트:', { subtotal, itemCount: cartItems.length });
        
    } catch (error) {
        console.error('장바구니 요약 업데이트 중 에러:', error);
    }
}

// 빈 장바구니 상태 확인
function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartContent = document.querySelector('.cart-content');
    const emptyCart = document.querySelector('.empty-cart');
    
    if (cartItems.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
    }
}

// 유틸리티 함수들
function validateQuantity(input) {
    let value = parseInt(input.value);
    
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 99) {
        value = 99;
    }
    
    input.value = value;
}

function getCartSeqFromElement(element) {
    const cartItem = element.closest('.cart-item');
    return cartItem ? cartItem.getAttribute('data-cart-seq') : null;
}

function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price);
}

// 모달 관련 함수들
function initializeModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const messageElement = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (modal && messageElement && confirmBtn) {
        messageElement.textContent = message;
        modal.style.display = 'block';
        
        // 기존 이벤트 리스너 제거 후 새로 추가
        confirmBtn.onclick = function() {
            closeModal();
            if (onConfirm) onConfirm();
        };
    }
}

function closeModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 알림 시스템 설정
function setupNotifications() {
    // 알림 스타일이 이미 있는지 확인
    if (!document.getElementById('cart-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-notification-styles';
        style.textContent = `
            .cart-notification {
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
            
            .cart-notification.show {
                transform: translateX(0);
            }
            
            .cart-notification i {
                font-size: 18px;
            }
            
            .cart-notification.success {
                border-left: 4px solid #28a745;
            }
            .cart-notification.success i {
                color: #28a745;
            }
            
            .cart-notification.error {
                border-left: 4px solid #dc3545;
            }
            .cart-notification.error i {
                color: #dc3545;
            }
            
            .cart-notification.warning {
                border-left: 4px solid #ffc107;
            }
            .cart-notification.warning i {
                color: #ffc107;
            }
            
            .cart-notification.info {
                border-left: 4px solid #17a2b8;
            }
            .cart-notification.info i {
                color: #17a2b8;
            }
            
            @media (max-width: 480px) {
                .cart-notification {
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
    const existingNotification = document.querySelector('.cart-notification');
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
    notification.className = `cart-notification ${type}`;
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
    const existingLoader = document.querySelector('.cart-loader');
    if (existingLoader) return;
    
    const loader = document.createElement('div');
    loader.className = 'cart-loader';
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
        animation: cartSpin 0.8s linear infinite;
    `;
    
    // 스피너 애니메이션 CSS 추가
    if (!document.getElementById('cart-spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-spinner-styles';
        style.textContent = `
            @keyframes cartSpin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loader);
}

// 로딩 숨기기
function hideLoading() {
    const loader = document.querySelector('.cart-loader');
    if (loader) {
        loader.remove();
    }
}

// 레거시 함수들 (기존 코드와 호환성 유지)
function getPaymentInfo() {
    proceedToCheckout();
}

function removeCartInfo(cartSeq) {
    removeCartItem(cartSeq);
}

function increaseQuantity(element, cartSeq, totalPrice) {
    updateQuantity(cartSeq, 1);
    return totalPrice;
}

function decreaseQuantity(element, cartSeq, totalPrice) {
    updateQuantity(cartSeq, -1);
    return totalPrice;
}

function setTotalPrice(fn, element, cartSeq) {
    updateTotalPrice(cartSeq);
    updateCartSummary();
}

console.log('장바구니 페이지 JavaScript 로드 완료');