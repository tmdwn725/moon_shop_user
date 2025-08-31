package com.shop.controller;

import com.shop.dto.FileDTO;
import com.shop.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * 파일 관련 Controller
 */
@Controller
@RequiredArgsConstructor
public class FileController {
    @Value("${root.filePath}")
    private String filePth;
    private final FileService fileService;

    /**
     * 파일 다운로드
     * @param response
     * @param fileSeq
     * @return
     */
    @GetMapping("/fileDownload")
    public String fileDownload(HttpServletResponse response, Long fileSeq){
        FileDTO fileDTO = fileService.getFileInfo(fileSeq);
        try {
            response.setContentType("image/gif");

            String imgPath = filePth + fileDTO.getFilePth();

            File f = new File(imgPath);
            if (f.exists()) {
                imgPath = filePth + fileDTO.getFilePth();
            }

            try (FileInputStream in = new FileInputStream(imgPath);
                 ServletOutputStream out = response.getOutputStream()) {
                int length;
                byte[] buffer = new byte[8192];
                while ((length = in.read(buffer)) != -1) {
                    out.write(buffer, 0, length);
                }
                out.flush();
            }

        } catch (IOException ie) {

        } catch (Exception e) {

        }
        return null;
    }
}
