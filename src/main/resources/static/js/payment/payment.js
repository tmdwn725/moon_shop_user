/**
 * 쿠폰 변경
 */
function changeMemberCoupon(memberCouponSeq, cartSeq, price) {
    let minPrice = 0;
    if(memberCouponSeq != 0) {
        minPrice = parseFloat(document.getElementById('minPrice' + memberCouponSeq).value);
        price = parseFloat(price);
        if(minPrice > price) {
            alert(minPrice + "원 이하는 해당 쿠폰을 사용할 수 없습니다.");
            return;
        }

    }

    const selectEl = document.getElementById('pre-coupon'+ cartSeq);
    if(selectEl.value !== '0'){
        addPrice(selectEl.value, price, minPrice);
    }
    if(memberCouponSeq != 0) {
        minusPrice(memberCouponSeq, price, minPrice);
    }

    const selects = document.getElementsByName("sel-coupon");
    for(el of selects) {
        const options = el.querySelectorAll('option')
        for(let option of options) {
          if (option.value === memberCouponSeq && option.value !== '0') {
            option.disabled = true; // memberCouponSeq에 해당하는 option을 비활성화
          } else if(option.value === selectEl.value){
            option.disabled = false; // 나머지 option은 활성화
          } else {
            continue;
          }
        }
    }

    selectEl.value = memberCouponSeq;
}

/**
 * 상품 가격 추가
 */
function addPrice(memberCouponSeq, proPrice, minPrice) {
    // 최대할인금액
    const maxDiscPrice = parseFloat(document.getElementById('maxDiscPrice' + memberCouponSeq).value);
    const discRate = parseFloat('0.' + document.getElementById('discRate' + memberCouponSeq).value);
    let disPrice = proPrice * discRate;
    if(maxDiscPrice < disPrice) {
        disPrice = maxDiscPrice;
    }
    const disTotPrice = parseFloat(document.getElementById('dis-price').value) - disPrice;
    const totPrice = parseFloat(document.getElementById('tot-price').value) + disPrice;

    document.getElementById('dis-price-txt').textContent = '₩' + disTotPrice.toLocaleString('en-US');
    document.getElementById('dis-price').value =  disTotPrice;
    document.getElementById('tot-price-txt').textContent = '₩' + totPrice.toLocaleString('en-US');
    document.getElementById('tot-price').value =  totPrice;
}

/**
 * 상품 가격 감소
 */
function minusPrice(memberCouponSeq, proPrice, minPrice) {
    // 최대할인금액
    const maxDiscPrice = parseFloat(document.getElementById('maxDiscPrice' + memberCouponSeq).value);
    const discRate = parseFloat('0.' + document.getElementById('discRate' + memberCouponSeq).value);
    let disPrice = proPrice * discRate;
    const disTotPrice = parseFloat(document.getElementById('dis-price').value) + disPrice;

    if(maxDiscPrice < disPrice) {
        disPrice = maxDiscPrice;
    }
    const totPrice = parseFloat(document.getElementById('tot-price').value) - disPrice;

    document.getElementById('dis-price-txt').textContent = '₩' + disTotPrice.toLocaleString('en-US');
    document.getElementById('dis-price').value =  disTotPrice;
    document.getElementById('tot-price-txt').textContent = '₩' + totPrice.toLocaleString('en-US');
    document.getElementById('tot-price').value =  totPrice;
}

/**
 * 결제
 */
function getPayment(){
    //가맹점 식별코드
    IMP.init("imp17552170");
    const memberNm = document.getElementById("memberNm").value;
    const address = document.getElementById("address").value + " " + document.getElementById("detailAddress").value
    const zipCode = document.getElementById("zip-code").value;
    const telNo = document.getElementById("tel-no").value;
    const email = document.getElementById("email").value;
    const totalPrice = document.getElementById("tot-price").value;
    const cartElements = document.getElementsByName("cart-seq");
    const memberCouponElements = document.getElementsByName("sel-coupon");

    const cartSeqList = [];
    for (const input of cartElements) {
        cartSeqList.push(input.value);
    }

    const memberCouponSeqList = [];
    for (const sel of memberCouponElements) {
        memberCouponSeqList.push(sel.value);
    }

    let orderData = {"totalPrice": totalPrice, "payType": "CARD", "address": address, "cartSeqList": cartSeqList
    , "memberCouponSeqList": memberCouponSeqList};

    IMP.request_pay(
    {
        pg : 'html5_inicis',
        pay_method : 'card',
        merchant_uid: 'merchant_' + new Date().getTime(), // 상점에서 관리하는 주문 번호를 전달
        name : '주문명:결제테스트',
        amount : totalPrice,
        buyer_email : email,
        buyer_name : memberNm,
        buyer_tel : telNo,
        buyer_addr : address,
        buyer_postcode : zipCode
    },
    function (rsp) { // callback
        orderData.impUid = rsp.imp_uid;
        $.ajax({
            type: "post",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(orderData),
            url: "/payment/saveOrderInfo"
        }).done(function(){
          alert("결제완료");
        });
    });