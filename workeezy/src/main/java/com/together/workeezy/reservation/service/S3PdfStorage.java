package com.together.workeezy.reservation.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
@Component
@RequiredArgsConstructor
public class S3PdfStorage {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public void uploadPdf(byte[] pdfBytes, String key) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("application/pdf");
        metadata.setContentLength(pdfBytes.length);

        amazonS3.putObject(bucket, key, new ByteArrayInputStream(pdfBytes), metadata);
    }

    public InputStream downloadPdf(String key) {
        S3Object obj = amazonS3.getObject(bucket, key);
        return obj.getObjectContent();
    }
}
