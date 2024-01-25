package com.shop.controller;

import com.shop.dto.CartDTO;
import com.shop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

/**
 * 장바구니 관련 Controller
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    /**
     * 장바구니 리스트
     * @param model
     * @return
     */
    @GetMapping("/cartList")
    public String cartList(Model model) {
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CartDTO> list =  cartService.findMyCartList(memberId);
        model.addAttribute("totalPrice",cartService.sumTotalPrice(list));
        model.addAttribute("myCartList",list);
        return "cart/cartList";
    }
    /**
     * 장바구니 수량 변경
     * @param cart
     * @return
     */
    @PostMapping("/updateProductQuantity")
    public ResponseEntity<Void> updateProductQuantity(CartDTO cart) {
        cartService.updateProductQuantity(cart);
        return ResponseEntity.ok().build();
    }
    /**
     * 장바구니 수량삭제
     * @param cart
     * @return
     */
    @Transactional
    @DeleteMapping("/removeCartInfo")
    public ResponseEntity<Void> removeCartInfo(CartDTO cart) {
        cartService.deleteCartInfo(cart);
        return ResponseEntity.ok().build();
    }
}
