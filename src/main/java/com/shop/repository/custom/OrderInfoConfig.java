package com.shop.repository.custom;

import com.shop.domain.OrderInfo;
import com.shop.domain.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderInfoConfig {
    Page<OrderInfo> selectOrderList(Pageable pageable, Long memberSeq);
    long updateRefundInfo(Long paymentSeq);

}
