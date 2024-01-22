package com.shop.domain;

import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "review")
public class Review {
    @Id
    @Column(name="review_seq")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewSeq;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_info_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private OrderInfo orderInfo;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_file_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private File file;
    @Column(name ="content")
    private String content;
    @Column(name ="score")
    private int score;
    @Column(name ="reg_date")
    private LocalDateTime regDate;
    @Column(name ="mod_date")
    private LocalDateTime modDate;
    public void createReview(OrderInfo orderInfo, File file, String content, int score, LocalDateTime regDate, LocalDateTime modDate){
        this.orderInfo = orderInfo;
        this.file = file;
        this.content = content;
        this.score = score;
        this.regDate = regDate;
        this.modDate = modDate;
    }
}
