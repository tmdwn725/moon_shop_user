const likeEle = document.getElementsByClassName("heartIcn")[0];

likeEle.addEventListener('click', function(){
    const spanEle = likeEle.querySelector('span');
    const spanClass = spanEle.getAttribute('class');
    let updateYn = 'N';
    if(spanClass == 'icon_heart_alt') {
        updateYn = 'Y';
    }
    const productSeq = likeEle.getAttribute('id');
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
       }
    });
});