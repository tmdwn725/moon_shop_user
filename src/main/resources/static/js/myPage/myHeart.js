/* 좋아요 페이지 JavaScript - 모던 무채색 디자인에 맞춘 개선된 버전 */

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeHeartPage();
});

// 페이지 초기화
function initializeHeartPage() {
    console.log('좋아요 페이지 초기화 완료');
    
    // 전역 함수로 등록 (HTML과 호환)
    window.toggleHeart = toggleHeart;
    window.addToCart = addToCart;
    window.quickView = quickView;
}

// 하트 토글 기능
function toggleHeart(element, productSeq) {
    if (!productSeq) {
        console.error('productSeq가 없습니다.');
        return;
    }
    
    const isActive = element.classList.contains('active');
    
    showLoading();
    
    $.ajax({
        type: "POST",
        url: isActive ? "/heart/delete" : "/heart/add",
        data: { productSeq: productSeq },
        success: function(response, textStatus, xhr) {
            hideLoading();
            
            if (xhr.status === 200) {
                if (isActive) {
                    // 하트 제거 - 카드 전체를 애니메이션과 함께 제거
                    element.classList.remove('active');
                    const heartCard = element.closest('.heart-item');
                    if (heartCard) {
                        heartCard.style.transform = 'scale(0.8)';
                        heartCard.style.opacity = '0';
                        setTimeout(() => {
                            heartCard.remove();
                            updateHeartCount();
                            checkEmptyHearts();
                        }, 300);
                    }
                    showNotification('좋아요에서 제거되었습니다.', 'info');
                } else {
                    element.classList.add('active');
                    showNotification('좋아요에 추가되었습니다.', 'success');
                }
            } else {
                showNotification('로그인이 필요한 서비스입니다.', 'warning');
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('하트 업데이트 실패:', error);
            
            if (xhr.status === 401) {
                showNotification('로그인이 필요한 서비스입니다.', 'warning');
            } else {
                showNotification('오류가 발생했습니다. 다시 시도해주세요.', 'error');
            }
        }
    });
}

// 장바구니 추가
function addToCart(productSeq) {
    if (!productSeq) {
        console.error('productSeq가 없습니다.');
        return;
    }
    
    showLoading();
    
    // 상품의 기본 사이즈 정보를 가져와야 하므로 상품 상세 페이지로 이동
    // 실제 구현에서는 사이즈 선택 모달을 띄우거나 기본 사이즈로 추가할 수 있음
    window.location.href = `/product/productInfo?productSeq=${productSeq}`;
}

// 빠른 보기
function quickView(productSeq) {
    if (!productSeq) {
        console.error('productSeq가 없습니다.');
        return;
    }
    
    // 상품 상세 페이지를 새 탭에서 열기
    window.open(`/product/productInfo?productSeq=${productSeq}`, '_blank');
}

// 하트 개수 업데이트
function updateHeartCount() {
    const heartItems = document.querySelectorAll('.heart-item');
    const heartCountElement = document.querySelector('.heart-count');
    
    if (heartCountElement) {
        const count = heartItems.length;
        heartCountElement.textContent = `${count}개 상품`;
    }
}

// 빈 하트 상태 확인
function checkEmptyHearts() {
    const heartItems = document.querySelectorAll('.heart-item');
    const heartContent = document.querySelector('.heart-content');
    const emptyHearts = document.querySelector('.empty-hearts');
    
    if (heartItems.length === 0) {
        if (heartContent) heartContent.style.display = 'none';
        if (emptyHearts) emptyHearts.style.display = 'block';
    }
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingToast = document.querySelector('.notification-toast.show');
    if (existingToast) {
        existingToast.classList.remove('show');
    }
    
    // 아이콘 매핑
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-times-circle', 
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    // 색상 매핑
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107', 
        'info': '#17a2b8'
    };
    
    // 토스트 요소 찾기 또는 생성
    let toast = document.getElementById('notification-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'notification-toast';
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-info-circle toast-icon"></i>
                <span class="toast-message">메시지</span>
            </div>
        `;
        document.body.appendChild(toast);
    }
    
    // 토스트 내용 업데이트
    const icon = toast.querySelector('.toast-icon');
    const messageElement = toast.querySelector('.toast-message');
    
    if (icon) {
        icon.className = `fas ${icons[type] || icons['info']} toast-icon`;
        icon.style.color = colors[type] || colors['info'];
    }
    
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    // 토스트 표시
    setTimeout(() => toast.classList.add('show'), 10);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 로딩 표시
function showLoading() {
    const existingLoader = document.querySelector('.heart-loader');
    if (existingLoader) return;
    
    const loader = document.createElement('div');
    loader.className = 'heart-loader';
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
        animation: heartSpin 0.8s linear infinite;
    `;
    
    // 스피너 애니메이션 CSS 추가
    if (!document.getElementById('heart-spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'heart-spinner-styles';
        style.textContent = `
            @keyframes heartSpin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loader);
}

// 로딩 숨기기
function hideLoading() {
    const loader = document.querySelector('.heart-loader');
    if (loader) {
        loader.remove();
    }
}

// 카드 호버 효과 개선
document.addEventListener('DOMContentLoaded', function() {
    const heartCards = document.querySelectorAll('.heart-card');
    
    heartCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// 이미지 로드 에러 처리
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/images/placeholder.jpg'; // 기본 이미지 경로
            this.alt = '이미지를 불러올 수 없습니다';
        });
    });
});

// 무한 스크롤 (선택사항)
function initializeInfiniteScroll() {
    let isLoading = false;
    let currentPage = 1;
    
    window.addEventListener('scroll', function() {
        if (isLoading) return;
        
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            loadMoreProducts();
        }
    });
    
    function loadMoreProducts() {
        isLoading = true;
        showLoading();
        
        $.ajax({
            url: `/myPage/myHeartList`,
            type: 'GET',
            data: { 
                page: currentPage + 1,
                ajax: true 
            },
            success: function(data) {
                hideLoading();
                isLoading = false;
                currentPage++;
                
                // 새로운 상품들을 그리드에 추가
                const heartGrid = document.querySelector('.heart-grid');
                if (heartGrid && data) {
                    heartGrid.insertAdjacentHTML('beforeend', data);
                }
            },
            error: function() {
                hideLoading();
                isLoading = false;
            }
        });
    }
}

// 키보드 접근성 개선
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        
        if (focusedElement.classList.contains('heart-card')) {
            e.preventDefault();
            focusedElement.click();
        }
        
        if (focusedElement.classList.contains('heart-icon')) {
            e.preventDefault();
            focusedElement.click();
        }
    }
});

console.log('좋아요 페이지 JavaScript 로드 완료');