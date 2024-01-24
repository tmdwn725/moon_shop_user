package com.shop.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name="heart")
public class Heart {
    @Id
    @Column(name ="heart_seq")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long heartSeq;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member member;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Product product;
    @Column(name = "reg_date")
    private LocalDateTime regDate;
    public void createHeart(Member member, Product product, LocalDateTime regDate){
        this.member = member;
        this.product = product;
        this.regDate = regDate;
    }
}
