package com.together.workeezy.reservation.service;
import com.lowagie.text.*;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfWriter;
import com.together.workeezy.reservation.domain.Reservation;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@Component
public class OpenPdfReservationConfirmationGenerator {

    public byte[] generate(Reservation r) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 36, 36, 48, 36);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(loadKoreanBaseFont(), 18, Font.BOLD);
            Font bodyFont = new Font(loadKoreanBaseFont(), 12, Font.NORMAL);

            document.add(new Paragraph("예약 확정서", titleFont));
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("예약번호: " + r.getReservationNo(), bodyFont));
            document.add(new Paragraph("프로그램: " + r.getProgram().getTitle(), bodyFont));
            document.add(new Paragraph("이용기간: " + r.getStartDate() + " ~ " + r.getEndDate(), bodyFont));
            document.add(new Paragraph("예약자: " + r.getUser().getUserName(), bodyFont));
            document.add(new Paragraph("연락처: " + r.getUser().getPhone(), bodyFont));
            document.add(new Paragraph("인원: " + r.getPeopleCount(), bodyFont));
            document.add(new Paragraph("총 금액: " + r.getTotalPrice(), bodyFont));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("OpenPDF 확정서 생성 실패", e);
        }
    }

    private BaseFont loadKoreanBaseFont() {
        try {
            // resources/fonts/NanumGothic.ttf 넣어두기
            ClassPathResource fontResource = new ClassPathResource("fonts/NanumGothic.ttf");
            try (InputStream is = fontResource.getInputStream()) {
                byte[] fontBytes = is.readAllBytes();
                return BaseFont.createFont(
                        "NanumGothic.ttf",
                        BaseFont.IDENTITY_H,
                        BaseFont.EMBEDDED,
                        true,
                        fontBytes,
                        null
                );
            }
        } catch (Exception e) {
            // 폰트 없으면 깨질 수 있음 (서버 OS 폰트 의존은 비추천)
            throw new RuntimeException("한글 폰트 로드 실패: resources/fonts/NanumGothic.ttf 확인", e);
        }
    }
}
