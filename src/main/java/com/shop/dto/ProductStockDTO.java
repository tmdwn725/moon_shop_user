package com.shop.dto;

import lombok.Data;

@Data
public class ProductStockDTO {
    private Long productStockSeq;
    private ProductDTO product;
    private String productSize;
    private int productCount;
    private Long productSeq;
}
