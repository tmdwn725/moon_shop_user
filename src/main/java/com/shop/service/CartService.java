package com.shop.service;

import com.shop.common.ModelMapperUtil;
import com.shop.domain.Cart;
import com.shop.domain.Member;
import com.shop.domain.ProductStock;
import com.shop.dto.CartDTO;
import com.shop.repository.CartRepository;
import com.shop.repository.MemberRepository;
import com.shop.repository.ProductStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final ProductStockRepository productStockRepository;
    public void addCart(CartDTO cartDTO, String memberId){
        LocalDateTime nowDate = LocalDateTime.now();
        Cart cart = new Cart();
        Member member = memberRepository.fingByMemberId(memberId);
        Optional<ProductStock> productStock = productStockRepository.findById(cartDTO.getProductStockSeq());
        cart.createCart(member, productStock.get(), cartDTO.getQuantity(), nowDate);
        cartRepository.save(cart);
    }
    public List<CartDTO> findMyCartList(String memberId){
        Member member = memberRepository.fingByMemberId(memberId);
        List<Cart> myCartList = cartRepository.myCartList(member);
        List<CartDTO> cartList = ModelMapperUtil.mapAll(myCartList,CartDTO.class);
        return cartList;
    }
    public int sumTotalPrice(List<CartDTO> cartList){
        int total = 0;
        for(CartDTO cartDTO : cartList){
            total += cartDTO.getProductStock().getProduct().getPrice() * cartDTO.getQuantity();
        }
        return total;
    }
    @Transactional
    public long updateProductQuantity(CartDTO cartDTO){
        return cartRepository.updateProductQuantity(cartDTO.getCartSeq(), cartDTO.getQuantity());
    }

    @Transactional
    public void deleteCartInfo(CartDTO cartDTO){
        Cart cart = cartRepository.findById(cartDTO.getCartSeq()).get();
        cartRepository.delete(cart);
    }
}
