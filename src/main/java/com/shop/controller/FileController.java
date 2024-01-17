package com.shop.controller;

import com.shop.dto.FileDTO;
import com.shop.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Controller
@RequiredArgsConstructor
public class FileController {
    @Value("${root.filePath}")
    private String filePth;
    private final FileService fileService;
    @RequestMapping("/fileDownload")
    public String fileDownload(HttpServletResponse response, Long fileSeq){
        FileDTO fileDTO = fileService.getFileInfo(fileSeq);
        try {
            response.setContentType( "image/gif" );
            ServletOutputStream bout = response.getOutputStream();

            String imgPath = filePth + fileDTO.getFilePth();
            String[] exts = {".bmp", ".jpg", ".gif", ".png", ".jpeg"};

            File f = new File(imgPath);
            if(f.exists()){
                imgPath = filePth + fileDTO.getFilePth();
            }
            FileInputStream fileInputStream = new FileInputStream(imgPath);
            int length;
            byte[] buffer = new byte[10];
            while ( ( length = fileInputStream.read( buffer ) ) != -1 )
                bout.write( buffer, 0, length );

        }catch (IOException ie) {

        }catch (Exception e){

        }
        return null;
    }
}
