function refund(paymentSeq){
    $.ajax({
        type: "post",
        url: "/payment/refund",
        data:{ paymentSeq : paymentSeq },
        success: function(response){
            console.log("등록");
            alert("환불되었습니다.");
            window.location.href = "http://localhost:8081/myPage/myOrderList";
        },
        error: function(xhr, status, error) {
            alert("환불에 실패했습니다.");
        }
    });

}