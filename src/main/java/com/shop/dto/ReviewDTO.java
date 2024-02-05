package com.shop.dto;

import com.shop.domain.File;
import com.shop.domain.ProductStock;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long reviewSeq;
    private Long orderSeq;
    private String content;
    private int score;
    private double scoreAvg;
    private long reviewCount;
    private LocalDateTime reviewDate;
    private File file;
    private ProductStock productStock;
    private MultipartFile imgFile;
    private OrderInfoDTO orderInfo;
}
