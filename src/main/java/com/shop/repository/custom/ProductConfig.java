package com.shop.repository.custom;

import com.shop.domain.Product;
import com.shop.domain.enums.ProductType;
import com.shop.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductConfig {
    Page<Product> selectProductList(Pageable pageable, Long sellerSeq, Long memberSeq, ProductType productType, String searchStr);
    List<ProductDTO> selectProductCount();
    Product selectProduct(Long productSeq, Long memberSeq);
}
