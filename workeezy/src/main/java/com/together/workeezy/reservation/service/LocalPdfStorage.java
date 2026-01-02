package com.together.workeezy.reservation.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Profile("local")
@Component
public class LocalPdfStorage implements PdfStorage {

    @Override
    public void uploadPdf(byte[] pdfBytes, String key) {
        // 로컬에서는 아무것도 안 함 (noop)
        System.out.println("[LOCAL] PDF upload skipped: " + key);
    }

    @Override
    public InputStream downloadPdf(String key) {
        throw new UnsupportedOperationException("로컬 환경에서는 PDF 다운로드 미지원");
    }
}
