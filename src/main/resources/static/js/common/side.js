$(document).ready(function () {
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace("myReviewInfo","myOrderList");
    const urls = ["myPage", "myOrderList", "myHeartList"];

    for(url of urls) {
        const urlEle = document.getElementById(url);
        if(currentUrl.includes("/myPage/" + url)){
            urlEle.className = 'nav-link';
        }else {
            urlEle.className = 'nav-link collapsed';
        }
    }

    let duration = 300;
    let $sidebar = $('.sidebar');
    let $sidebarButton = $sidebar.find('.sidebar-btn').on('click', function(){
        $sidebar.toggleClass('close');
        if($sidebar.hasClass('close')){
            $sidebar.stop(true).animate({left: '-270px'}, duration, 'easeInBack');
            $sidebar.fadeIn();
            $sidebarButton.find('span').text('>>');
        }else{
            $sidebar.stop(true).animate({left: '0px'}, duration, 'easeOutBack');
            $sidebarButton.find('span').text('<<');
        };
    });
})
