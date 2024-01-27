package com.shop.domain;

import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name="coupon")
public class Coupon {
    @Id
    @Column(name="coupon_seq")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long couponSeq;
    @Column(name ="coupon_name")
    private String couponName;
    @Column(name ="disc_rate")
    private int discRate;
    @Column(name ="min_price")
    private int minPrice;
    @Column(name ="max_disc_price")
    private int maxDiscPrice;
    @Column(name = "use_st_date")
    private LocalDate useStDate;
    @Column(name = "use_ed_date")
    private LocalDate useEdDate;
    @Column(name = "reg_date")
    private LocalDateTime regDate;
    @Column(name = "mod_date")
    private LocalDateTime modDate;
    public void createCoupon(String couponName, int discRate, int minPrice, int maxDiscPrice
            , LocalDate useStDate, LocalDate useEdDate, LocalDateTime regDate){
        this.couponName = couponName;
        this.discRate = discRate;
        this.minPrice = minPrice;
        this.maxDiscPrice = maxDiscPrice;
        this.useStDate = useStDate;
        this.useEdDate = useEdDate;
        this.regDate = regDate;
    }
}
