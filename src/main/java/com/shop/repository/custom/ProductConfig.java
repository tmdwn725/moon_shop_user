package com.shop.repository.custom;

import com.shop.domain.Product;
import com.shop.domain.enums.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductConfig {
    Page<Product> selectProductList(Pageable pageable, Long sellerSeq, Long memberSeq, ProductType productType, String searchStr);
    Product selectProduct(Long productSeq, Long memberSeq);
}
