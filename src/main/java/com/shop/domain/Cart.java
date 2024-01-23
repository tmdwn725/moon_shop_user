package com.shop.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "cart")
public class Cart {
    @Id
    @Column(name ="cart_seq")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartSeq;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member member;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_stock_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private ProductStock productStock;
    @Column(name ="quantity")
    private int quantity;
    @Column(name = "reg_date")
    private LocalDateTime regDate;
    public void createCart(Member member, ProductStock productStock, int quantity, LocalDateTime regDate){
        this.member = member;
        this.productStock = productStock;
        this.quantity = quantity;
        this.regDate = regDate;
    }
}
