package com.shop.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.shop.common.enumConvert.ProductTypeConverter;
import com.shop.domain.enums.ProductType;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Table(name = "product")
public class Product {
    @Id
    @Column(name ="product_seq")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productSeq;
    @Column(name = "seller_seq")
    private Long sellerSeq;
    @Column(name = "product_name")
    private String productName;
    @Column(name = "product_content")
    private String productContent;
    @Convert(converter = ProductTypeConverter.class)
    @Column(name = "product_type")
    private ProductType productType;
    @Column(name = "price")
    private int price;
    @Column(name = "reg_date")
    private LocalDateTime regDate;
    @Column(name = "mod_date")
    private LocalDateTime modDate;
    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.PERSIST)
    private List<ProductFile> productFileList;
    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.PERSIST)
    private List<ProductStock> productStockList;
    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.PERSIST)
    private List<Heart> heartList;
    @Transient
    private String filePth;
    public void createProduct(Long productSeq, Long sellerSeq, String productName ,String productContent, ProductType productType, int price, LocalDateTime regDate, LocalDateTime modDate){
        if(productSeq > 0L){
            this.productSeq = productSeq;
        }
        this.sellerSeq = sellerSeq;
        this.productName = productName;
        this.productContent = productContent;
        this.productType = productType;
        this.price = price;
        this.regDate = regDate;
        this.modDate = modDate;
    }
}
