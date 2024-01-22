package com.shop.repository.impl;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shop.domain.*;
import com.shop.repository.custom.ReviewConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class ReviewRepositoryImpl implements ReviewConfig {
    private final JPAQueryFactory queryFactory;
    QReview qReview = QReview.review;
    QOrderInfo qOrderInfo = QOrderInfo.orderInfo;
    QProductStock qProductStock = QProductStock.productStock;
    QProduct qProduct = QProduct.product;
    QFile qFile = QFile.file;
    QMember qMember = QMember.member;
    public Review selectReviewInfo(OrderInfo orderInfo){
        return queryFactory.selectFrom(qReview)
                .join(qReview.file,qFile)
                .where(qReview.orderInfo.eq(orderInfo))
                .fetchOne();
    }

    public Page<Review> selectReviewList(Pageable pageable, Long productSeq){
        QueryResults<Review> reviewList =  queryFactory.selectFrom(qReview)
                .join(qReview.file,qFile).fetchJoin()
                .join(qReview.orderInfo,qOrderInfo).fetchJoin()
                .join(qOrderInfo.member,qMember).fetchJoin()
                .join(qOrderInfo.productStock,qProductStock)
                .join(qProductStock.product,qProduct)
                .where(qProduct.productSeq.eq(productSeq))
                .orderBy(qReview.modDate.desc().nullsLast(), qReview.regDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchResults();
        List<Review> content = reviewList.getResults();
        long total = reviewList.getTotal();
        return new PageImpl<>(content, pageable, total);
    }

}
