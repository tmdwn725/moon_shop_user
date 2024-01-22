package com.shop.repository.custom;

import com.shop.domain.OrderInfo;
import com.shop.domain.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewConfig {
    Review selectReviewInfo(OrderInfo orderInfo);
    Page<Review> selectReviewList(Pageable pageable, Long productSeq);
}
