// 이이지 업로드 모듈 생성
function UploadImage(){};

UploadImage.prototype.addImageFile = function(id, e, file){
    const div = document.getElementById(id);
    const imgElement = div.querySelector('img'); // div 요소 안의 모든 img 요소를 선택합니다.

    // 이미지가 이미 존재하는지 확인합니다.
    if (imgElement != null) {
        // 이미지의 src 속성을 변경합니다.
        $(imgElement).attr('src', e.target.result);
        $(imgElement).attr('data-file', file.name);
    } else {
        // 이미지가 없으면 새로 생성하여 추가합니다.
        const img = document.createElement('img');
        img.setAttribute('src', e.target.result);
        img.setAttribute('class', "product-image");
        img.setAttribute('data-file', file.name);
        div.appendChild(img);
    }
}
//
let uploadImage = new UploadImage();

// 평점 모듈 생성
function Rating(){};

Rating.prototype.rate = 0;
Rating.prototype.setRate = function(newrate){
    //별점 마킹 - 클릭한 별 이하 모든 별 체크 처리
    this.rate = newrate;
    let items = document.querySelectorAll('.rate-radio');
    items.forEach(function(item, idx){
        if(idx < newrate){
            item.checked = true;
        }else{
            item.checked = false;
        }
    });
}

let rating = new Rating(); //별점 인스턴스 생성

document.addEventListener('DOMContentLoaded', function(){
    //별점선택 이벤트 리스너
    document.querySelector('.rating').addEventListener('click',function(e){
        let elem = e.target;
        if(elem.classList.contains('rate-radio')){
            rating.setRate(parseInt(elem.value));
        }
    })

    // 이미지 업로드 리스너
    const realUpload = document.querySelector('.real-upload');
    const upload = document.querySelector('.upload');
    upload.addEventListener('click', () => realUpload.click());

    realUpload.addEventListener('change',function(e) {
         const uploadFiles = [];
         const file = e.currentTarget.files[0];

         // 파일 타입 검사
         if (!file.type.match("image/.*")) {
           alert('이미지 파일만 업로드가 가능합니다.');
           return
         }

         // 이미지 파일 변경
         uploadFiles.push(file);
         const reader = new FileReader();
         reader.onload = (e) => {
             uploadImage.addImageFile('upload-img',e, file);
         };
        reader.readAsDataURL(file);
    })
});


function saveMyReview() {
    let orderSeq = $("#order-info-seq").val();
    let reviewSeq = $("#review-seq").val();

    if(orderSeq == ''){
        orderSeq = 0;
    }

    if(reviewSeq == ''){
        reviewSeq = 0;
    }

    const content = $("#review-content").val();
    const imagePath = $("#upload-img img").attr("src");
    const imageForm = document.getElementById('product-image-form');
    const rate = $('input[name=rating]:checked').length;
    let formData = new FormData(imageForm);
    let sizeType = {};

    formData.append("orderSeq", orderSeq);
    formData.append("reviewSeq", reviewSeq);
    formData.append("content", content);
    formData.append("score", rate);

    $.ajax({
        type: "POST",
        url: "/myPage/saveMyReview",
        contentType: false, // 필수: FormData를 사용하기 때문에 false로 설정
        processData: false, // 필수: FormData를 사용하기 때문에 false로 설정
        data:formData,
        success: function(response){
            console.log("등록");
            alert("등록되었습니다.");
            window.location.href = "http://localhost:8081/myPage/myOrderList";
        },
        error: function(xhr, status, error) {
            alert("등록에 실패했습니다.");
        }
    });
}