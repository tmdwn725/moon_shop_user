// 상품 목록 페이지 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // 카테고리 토글 기능
    const categoryToggles = document.querySelectorAll('.category-toggle');
    
    categoryToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);
            const isActive = this.classList.contains('active');
            
            // 모든 카테고리 닫기
            categoryToggles.forEach(t => {
                t.classList.remove('active');
                const target = document.querySelector(t.getAttribute('data-target'));
                if (target) {
                    target.classList.remove('active');
                }
            });
            
            // 현재 카테고리 토글
            if (!isActive && targetElement) {
                this.classList.add('active');
                targetElement.classList.add('active');
            }
        });
    });
    
    // 뷰 모드 전환 (그리드/리스트)
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('products-grid');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewMode = this.getAttribute('data-view');
            
            // 버튼 활성화 상태 변경
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 그리드 클래스 변경
            productsGrid.classList.remove('list-view');
            if (viewMode === 'list') {
                productsGrid.classList.add('list-view');
            }
            
            // 로컬 스토리지에 설정 저장
            localStorage.setItem('productViewMode', viewMode);
        });
    });
    
    // 저장된 뷰 모드 복원
    const savedViewMode = localStorage.getItem('productViewMode');
    if (savedViewMode) {
        const savedViewBtn = document.querySelector(`[data-view="${savedViewMode}"]`);
        if (savedViewBtn) {
            savedViewBtn.click();
        }
    }
    
    // 좋아요 기능
    const heartButtons = document.querySelectorAll('.heart-btn');
    
    heartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 상품 클릭 이벤트 방지
            
            const heartIcon = this.querySelector('i');
            const productSeq = this.id.replace('heart-', '');
            
            // 하트 상태 토글
            if (heartIcon.classList.contains('fas')) {
                // 좋아요 취소
                heartIcon.classList.remove('fas', 'active');
                heartIcon.classList.add('far');
                removeFromWishlist(productSeq);
            } else {
                // 좋아요 추가
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas', 'active');
                addToWishlist(productSeq);
            }
        });
    });
    
    // 장바구니 버튼
    const cartButtons = document.querySelectorAll('.cart-btn');
    
    cartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 상품 클릭 이벤트 방지
            
            // 간단한 피드백 효과
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // TODO: 장바구니 추가 로직 구현
            showNotification('장바구니에 추가되었습니다!');
        });
    });
    
    // 정렬 기능
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            // TODO: 정렬 로직 구현
            console.log('정렬 방식:', sortValue);
        });
    }
    
    // 빠른 보기 버튼
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    
    quickViewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 상품 클릭 이벤트 방지
            
            // TODO: 빠른 보기 모달 구현
            console.log('빠른 보기 클릭');
        });
    });
    
});

// 좋아요 추가 함수
function addToWishlist(productSeq) {
    // TODO: 서버로 좋아요 추가 요청
    console.log('좋아요 추가:', productSeq);
}

// 좋아요 제거 함수
function removeFromWishlist(productSeq) {
    // TODO: 서버로 좋아요 제거 요청
    console.log('좋아요 제거:', productSeq);
}

// 알림 메시지 표시 함수
function showNotification(message) {
    // 기존 알림이 있다면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1a1a1a;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // 자동 제거
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 이미지 로딩 에러 처리
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/img/placeholder-product.jpg'; // 플레이스홀더 이미지
            this.style.opacity = '0.7';
        });
    });
});

// 반응형 카테고리 사이드바 (모바일에서 토글)
function initMobileSidebar() {
    if (window.innerWidth <= 1024) {
        const sidebar = document.querySelector('.filter-sidebar');
        const toggleBtn = document.createElement('button');
        
        toggleBtn.innerHTML = '<i class="fas fa-filter"></i> 필터';
        toggleBtn.className = 'mobile-filter-toggle';
        toggleBtn.style.cssText = `
            display: block;
            width: 100%;
            padding: 1rem;
            background: #1a1a1a;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 1rem;
            cursor: pointer;
        `;
        
        toggleBtn.addEventListener('click', function() {
            sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
        });
        
        if (sidebar && !document.querySelector('.mobile-filter-toggle')) {
            sidebar.parentNode.insertBefore(toggleBtn, sidebar);
            sidebar.style.display = 'none';
        }
    }
}

// 페이지 로드 및 리사이즈 시 모바일 사이드바 초기화
window.addEventListener('load', initMobileSidebar);
window.addEventListener('resize', initMobileSidebar);