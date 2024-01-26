package com.shop.domain;

import com.shop.common.enumConvert.PaymentTypeConverter;
import com.shop.domain.enums.PaymentType;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="payment_seq")
    private Long paymentSeq;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_coupon_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private MemberCoupon memberCoupon;
    @Column(name="total_price")
    private int totalPrice;
    @Column(name="disc_price")
    private int discPrice;
    @Convert(converter = PaymentTypeConverter.class)
    @Column(name="payment_type")
    private PaymentType paymentType;
    @Column(name="payment_date")
    private LocalDateTime paymentDate;
    @Column(name="imp_uid")
    private String impUid;
    public void createPayment(int totalPrice, PaymentType paymentType, LocalDateTime paymentDate, MemberCoupon memberCoupon, int discPrice, String impUid){
        this.totalPrice = totalPrice;
        this.paymentType = paymentType;
        this.paymentDate = paymentDate;
        this.memberCoupon = memberCoupon;
        this.discPrice = discPrice;
        this.impUid = impUid;
    }
}
