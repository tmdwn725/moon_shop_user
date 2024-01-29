package com.shop.domain;

import com.shop.common.enumConvert.OrderStsTypeConverter;
import com.shop.common.enumConvert.ProductTypeConverter;
import com.shop.domain.enums.OrderStsType;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
public class OrderInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="order_info_seq")
    private Long orderInfoSeq;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_stock_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private ProductStock productStock;
    @Column(name ="quantity")
    private int quantity;
    @Column(name ="address")
    private String address;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="payment_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Payment payment;
    @Column(name ="order_date")
    private LocalDateTime orderDate;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member member;
    @Convert(converter = OrderStsTypeConverter.class)
    @Column(name="order_sts_type")
    private OrderStsType orderStsType;
    public void createOrderInfo(ProductStock productStock, int quantity, String address, Payment payment, LocalDateTime orderDate, Member member, OrderStsType orderStsType){
        this.productStock = productStock;
        this.quantity = quantity;
        this.address = address;
        this.payment = payment;
        this.orderDate = orderDate;
        this.member = member;
        this.orderStsType = orderStsType;
    }
}
