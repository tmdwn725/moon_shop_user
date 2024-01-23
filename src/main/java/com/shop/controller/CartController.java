package com.shop.controller;

import com.shop.domain.Cart;
import com.shop.domain.enums.ProductType;
import com.shop.dto.CartDTO;
import com.shop.dto.ProductDTO;
import com.shop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Arrays;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;
    @RequestMapping("/cartList")
    public String cart(Model model) {
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CartDTO> list =  cartService.findMyCartList(memberId);
        model.addAttribute("totalPrice",cartService.sumTotalPrice(list));
        model.addAttribute("myCartList",list);
        return "cart/cartList";
    }
    @RequestMapping("/modProductQuantity")
    public ResponseEntity<Void> modProductQuantity(CartDTO cart) {
        long result =  cartService.updateProductQuantity(cart);
        return ResponseEntity.ok().build();
    }
    @Transactional
    @RequestMapping("/removeCartInfo")
    public ResponseEntity<Void> removeCartInfo(CartDTO cart) {
        cartService.deleteCartInfo(cart);
        return ResponseEntity.ok().build();
    }
}
