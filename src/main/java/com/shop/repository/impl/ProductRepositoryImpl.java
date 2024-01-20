package com.shop.repository.impl;

import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shop.domain.*;
import com.shop.domain.enums.ProductType;
import com.shop.repository.custom.ProductConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductConfig {
    private final JPAQueryFactory queryFactory;
    QProduct qProduct = QProduct.product;
    QProductStock qProductStock = QProductStock.productStock;
    QProductFile qProductFile = QProductFile.productFile;
    QFile qFile = QFile.file;
    QHeart qHeart = QHeart.heart;
    QMember qMember = QMember.member;
    /**
     * 상품목록조회
     * @param pageable
     * @return
     */
    public Page<Product> selectProductList(Pageable pageable, Long sellerSeq, Long memberSeq, ProductType productType, String searchStr){
        QueryResults<Product> productList = queryFactory
                .selectFrom(qProduct)
                .join(qProduct.productFileList, qProductFile)
                .join(qProductFile.file, qFile)
                .leftJoin(qProduct.heartList, qHeart)
                .on(qHeart.member.memberSeq.eq(memberSeq))
                .where(eqSellerSeq(sellerSeq)
                        ,eqProductType(productType),qProductFile.repYn.eq("Y")
                        ,searchProductName(searchStr))
                .orderBy(qProduct.regDate.desc(), qProduct.productSeq.asc()) // 최신순으로 정렬
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize()) // 최대 8개만 조회
                .fetchResults();
        List<Product> content = productList.getResults();
        long total = productList.getTotal();
        return new PageImpl<>(content, pageable, total);
    }

    private BooleanExpression eqSellerSeq(long sellerSeq) {
        if (sellerSeq == 0) {
            return null;
        }
        return qProduct.sellerSeq.eq(sellerSeq);
    }

    private BooleanExpression eqProductType(ProductType productType) {
        if (productType == null) {
            return null;
        }
        return qProduct.productType.in(productType.getChildCategories());
    }

    private BooleanExpression searchProductName(String searchStr) {
        if (searchStr == null) {
            return null;
        }
        return qProduct.productName.contains(searchStr);
    }

    private BooleanExpression eqHeart(Heart heart) {
        if (heart == null) {
            return null;
        }
        return qProduct.eq(qHeart.product);
    }

    /**
     * 상품정보조회
     * @param productSeq
     * @return
     */
    public Product selectProduct(Long productSeq, Long memberSeq){
        Product productInfo = queryFactory
                .selectFrom(qProduct)
                .leftJoin(qProduct.heartList, qHeart)
                .on(qHeart.member.memberSeq.eq(memberSeq)) // 멤버와 관련된 하트만 가져오기
                .on(qHeart.member.memberSeq.isNotNull())
                .join(qProduct.productStockList, qProductStock)
                .join(qProduct.productFileList, qProductFile)
                .join(qProductFile.file, qFile)
                .where(qProduct.productSeq.eq(productSeq))
                .fetchOne();
        return productInfo;
    }
}
