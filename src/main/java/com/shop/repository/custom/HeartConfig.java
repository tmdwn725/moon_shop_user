package com.shop.repository.custom;

import com.shop.domain.Heart;
import com.shop.dto.HeartDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HeartConfig {
    Heart selectHeartInfo(Heart heart);
    Page<HeartDTO> selectHeartList(Pageable pageable, Long memberSeq);
}
