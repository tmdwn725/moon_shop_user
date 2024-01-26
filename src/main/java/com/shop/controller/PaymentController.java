package com.shop.controller;

import com.shop.dto.CartDTO;
import com.shop.dto.MemberDTO;
import com.shop.dto.PaymentDTO;
import com.shop.service.CouponService;
import com.shop.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 결제 관련 Controller
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final CouponService couponService;

    /**
     * 상품 결제창 조회
     * @param model
     * @param cartDTO
     * @return
     */
    @PostMapping(value = "/paymentInfo")
    public String paymentInfo(Model model, @ModelAttribute("CartDTO") CartDTO cartDTO){
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        MemberDTO member = couponService.selectMyCouponInfo(memberId);
        // 총 가격
        int totalPrice = cartDTO.getCartList().stream()
                            .mapToInt(cart -> cart.getPrice() * cart.getQuantity())
                            .sum();
        model.addAttribute("member", member);
        model.addAttribute("myCartList",cartDTO.getCartList());
        model.addAttribute("totalPrice",totalPrice);
        return "payment/paymentInfo";
    }
    /**
     * 주문정보 저장
     * @param orderData
     * @return
     */
    @PostMapping(value = "/saveOrderInfo")
    @ResponseBody
    public ResponseEntity<Void> saveOrderInfo(@RequestBody Map<String, Object> orderData) {
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setTotalPrice(Integer.parseInt(orderData.get("totalPrice").toString()));
        paymentDTO.setAddress(orderData.get("address").toString());
        paymentDTO.setPayType(orderData.get("payType").toString());
        paymentDTO.setImpUid(orderData.get("impUid").toString());
        paymentDTO.setCartSeqList((List<String>) orderData.get("cartSeqList"));
        paymentDTO.setMemberCouponSeqList((List<String>) orderData.get("memberCouponSeqList"));
        paymentService.savePayment(paymentDTO,memberId);
        return ResponseEntity.ok().build();
    }
}
