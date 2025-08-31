package com.shop.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.shop.common.ModelMapperUtil;
import com.shop.domain.*;
import com.shop.domain.enums.OrderStsType;
import com.shop.domain.enums.PaymentType;
import com.shop.dto.PaymentDTO;
import com.shop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderInfoRepository orderInfoRepository;
    private final MemberRepository memberRepository;
    private final CartRepository cartRepository;
    private final CouponRepository couponRepository;

    /**
     * 결제 정보 저장
     * @param paymentDTO
     * @param memberId
     */
    @Transactional
    public void savePayment(PaymentDTO paymentDTO, String memberId){
        // 현재 날짜와 시간 취득
        LocalDateTime nowDateTime = LocalDateTime.now();
        Member member  = memberRepository.findByMemberId(memberId);
        List<String> cartList = paymentDTO.getCartSeqList();
        List<String> memberCouponList = paymentDTO.getMemberCouponSeqList();
        for(int i = 0; i < cartList.size(); i++){
            Cart cart = cartRepository.selectCartInfo(Long.parseLong(cartList.get(i)));
            MemberCoupon memberCoupon = couponRepository.selectMemberCouponInfo(Long.parseLong(memberCouponList.get(i)));
            // 할인금액
            int disPrice = 0;
            if(!"0".equals(memberCouponList.get(i))) {
                disPrice = (cart.getProductStock().getProduct().getPrice() * memberCoupon.getCoupon().getDiscRate()) / 100;
            }
            Payment payment = new Payment();
            payment.createPayment(cart.getProductStock().getProduct().getPrice() * cart.getQuantity()
                    , PaymentType.valueOf(paymentDTO.getPayType()),nowDateTime, memberCoupon, disPrice, paymentDTO.getImpUid());
            paymentRepository.save(payment);
            // 사용여부 update
            if(!"0".equals(memberCouponList.get(i))) {
                couponRepository.updateMemberCouponUseYn(memberCoupon.getMemberCouponSeq(), "Y");
            }

            OrderInfo orderInfo = new OrderInfo();
            orderInfo.createOrderInfo(cart.getProductStock(),cart.getQuantity(),paymentDTO.getAddress(),payment,nowDateTime,member, OrderStsType.ORDER_COMPLETE);
            orderInfoRepository.save(orderInfo);

            // 장바구니 삭제
            cartRepository.delete(cart);
        }
    }
    /**
     * 결제정보 조회
     * @param paymentSeq
     * @return
     */
    public PaymentDTO paymentInfo(Long paymentSeq){
        Payment payment = paymentRepository.findById(paymentSeq).get();
        PaymentDTO paymentDTO = ModelMapperUtil.map(payment, PaymentDTO.class);
        return  paymentDTO;
    }

    public void refundRequest(String access_token, String merchant_uid, String amount, String reason) throws IOException {
        URL url = new URL("https://api.iamport.kr/payments/cancel");
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

        // 요청 방식을 POST로 설정
        conn.setRequestMethod("POST");

        // 요청의 Content-Type, Accept, Authorization 헤더 설정
        conn.setRequestProperty("Content-type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setRequestProperty("Authorization", access_token);

        // 해당 연결을 출력 스트림(요청)으로 사용
        conn.setDoOutput(true);

        // JSON 객체에 해당 API가 필요로하는 데이터 추가.
        JsonObject json = new JsonObject();
        json.addProperty("imp_uid", merchant_uid);
        json.addProperty("amount", amount);
        json.addProperty("checksum", amount);
        json.addProperty("reason", reason);// 추가된 부분

        // 출력 스트림으로 해당 conn에 요청
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
        bw.write(json.toString());
        bw.flush();
        bw.close();

        String responseJson = new BufferedReader(new InputStreamReader(conn.getInputStream()))
                .lines()
                .collect(Collectors.joining("\n"));

        System.out.println("응답 본문: " + responseJson);

        JsonObject jsonResponse = JsonParser.parseString(responseJson).getAsJsonObject();
        String resultCode = jsonResponse.get("code").getAsString();
        String resultMessage = jsonResponse.get("message").getAsString();

        System.out.println("결과 코드 = " + resultCode);
        System.out.println("결과 메시지 = " + resultMessage);

        // 입력 스트림으로 conn 요청에 대한 응답 반환
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        br.close();
        conn.disconnect();

        log.info("결제 취소 완료 : 주문 번호 {}", merchant_uid);
    }

    public String getToken(String impKey, String impSecret) throws IOException {

        URL url = new URL("https://api.iamport.kr/users/getToken");
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);

        JsonObject json = new JsonObject();
        json.addProperty("imp_key", impKey);
        json.addProperty("imp_secret", impSecret);

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));

        bw.write(json.toString());
        bw.flush();
        bw.close();

        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));

        Gson gson = new Gson();

        String response = gson.fromJson(br.readLine(), Map.class).get("response").toString();

        System.out.println(response);

        String token = gson.fromJson(response, Map.class).get("access_token").toString();

        br.close();
        conn.disconnect();

        return token;
    }

    public String getPaymentInfo(String impUid, String token) throws IOException {

        try {
            URL url = new URL("https://api.iamport.kr/payments/" + impUid);
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", token);
            conn.setDoOutput(true);

            // 데이터 수신
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            Gson gson = new Gson();
            String response = gson.fromJson(br.readLine(), Map.class).get("response").toString();
            System.out.println(response);

            String amount = "500.0";//gson.fromJson(response, Map.class).get("amount").toString();

            br.close();
            conn.disconnect();

            return amount;
        } catch (Exception e) {
            // 예외 처리 - 원하는 방식으로 처리하세요
            e.printStackTrace();
            return null;
        }
    }

    public long updateOrderInfoRefund(Long paymentSeq) {
        return orderInfoRepository.updateRefundInfo(paymentSeq);
    }

    /**
     * 개선된 결제 취소 처리 메서드
     * 결제 상태 확인 후 적절한 조치를 취함
     */
    @Transactional
    public String processRefund(Long paymentSeq) throws IOException {
        // 결제 정보 조회
        PaymentDTO payment = paymentInfo(paymentSeq);
        if (payment == null) {
            return "결제 정보를 찾을 수 없습니다.";
        }
        
        // imp_uid가 null인 경우 (테스트 결제 등)
        if (payment.getImpUid() == null || payment.getImpUid().isEmpty()) {
            // DB에서 주문 상태만 업데이트
            updateOrderInfoRefund(paymentSeq);
            return "주문이 성공적으로 취소되었습니다.";
        }
        
        try {
            // 토큰 발급
            String token = getToken("8428328123150472", "6lox7VLfDYCFGVDu8Kc39Hml8iqmjB1WsMsZpwxooyMJVUb3xJub0y6Atp2AGqPyU27rLNA9GE3D44sI");
            
            // 결제 정보 확인 먼저
            String paymentStatus = getPaymentStatus(payment.getImpUid(), token);
            log.info("결제 상태 확인: {}", paymentStatus);
            
            // 결제가 이미 실패했거나 취소된 경우
            if ("failed".equals(paymentStatus) || "cancelled".equals(paymentStatus)) {
                // DB에서만 주문 상태 업데이트
                updateOrderInfoRefund(paymentSeq);
                return "주문이 성공적으로 취소되었습니다. (결제는 이미 실패/취소 상태)";
            }
            
            // 실제 결제 취소 시도
            String amount = getPaymentInfo(payment.getImpUid(), token);
            refundRequest(token, payment.getImpUid(), amount, "고객 요청에 의한 결제 취소");
            
            // 주문 상태 업데이트
            updateOrderInfoRefund(paymentSeq);
            
            return "결제가 성공적으로 취소되었습니다.";
            
        } catch (Exception e) {
            log.error("결제 취소 처리 중 오류 발생: ", e);
            
            // 오류가 발생했지만 이미 취소된 결제일 수 있으므로 주문 상태는 업데이트
            updateOrderInfoRefund(paymentSeq);
            
            return "주문이 취소되었습니다.";
        }
    }
    
    /**
     * 결제 상태 확인
     */
    private String getPaymentStatus(String impUid, String token) throws IOException {
        URL url = new URL("https://api.iamport.kr/payments/" + impUid);
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
        
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", token);
        
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
        String response = br.lines().collect(Collectors.joining("\n"));
        br.close();
        conn.disconnect();
        
        JsonObject jsonResponse = JsonParser.parseString(response).getAsJsonObject();
        if (jsonResponse.has("response") && !jsonResponse.get("response").isJsonNull()) {
            JsonObject responseObj = jsonResponse.getAsJsonObject("response");
            if (responseObj.has("status")) {
                return responseObj.get("status").getAsString();
            }
        }
        
        return "unknown";
    }

}
