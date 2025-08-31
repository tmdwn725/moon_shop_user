// 페이지 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // heartIcn 요소가 존재하는지 확인
    const likeEle = document.getElementsByClassName("heartIcn")[0];
    
    if (likeEle) {
        likeEle.addEventListener('click', function(){
            const spanEle = likeEle.querySelector('span');
            
            if (!spanEle) {
                console.error('Heart span element not found');
                return;
            }
            
            const spanClass = spanEle.getAttribute('class');
            let updateYn = 'N';
            if(spanClass == 'icon_heart_alt') {
                updateYn = 'Y';
            }
            const productSeq = likeEle.getAttribute('id');
            
            if (!productSeq) {
                console.error('Product sequence not found');
                return;
            }
            
            $.ajax({
                type: "get",
                url: "/product/updateHeartInfo",
                data: {
                    productSeq : productSeq,
                    updateYn : updateYn
                },
                success: function(){
                    if(updateYn == 'Y') {
                        spanEle.className = 'icon_heart';
                        spanEle.style.color = 'red';
                    }else {
                        spanEle.className = 'icon_heart_alt';
                        spanEle.style.color = '';
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Heart update failed:', error);
                }
            });
        });
    } else {
        console.log('heartIcn element not found on this page');
    }
});