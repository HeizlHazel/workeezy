package com.together.workeezy.reservation.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.together.workeezy.reservation.domain.Reservation;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
public class OpenPdfReservationConfirmationGenerator {

    private final BaseFont baseFont;

    // 🎨 Color Theme
    private static final Color TITLE_COLOR = new Color(45, 45, 45);
    private static final Color SECTION_COLOR = new Color(70, 70, 70);
    private static final Color LABEL_COLOR = new Color(140, 140, 140);
    private static final Color VALUE_COLOR = new Color(60, 60, 60);
    private static final Color LINE_COLOR = new Color(220, 220, 220);

    public OpenPdfReservationConfirmationGenerator() {
        this.baseFont = loadKoreanBaseFont();
    }

    public byte[] generate(Reservation r) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 48, 48, 90, 48);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(baseFont, 18, Font.BOLD, TITLE_COLOR);
            Font sectionFont = new Font(baseFont, 13, Font.BOLD, SECTION_COLOR);
            Font labelFont = new Font(baseFont, 11, Font.NORMAL, LABEL_COLOR);
            Font valueFont = new Font(baseFont, 11, Font.NORMAL, VALUE_COLOR);

            /* ================= HEADER ================= */
            PdfPTable header = new PdfPTable(2);
            header.setWidthPercentage(100);
            header.setWidths(new int[]{2, 8});

            PdfPCell logoCell = new PdfPCell(loadLogoImage());
            logoCell.setBorder(Rectangle.NO_BORDER);
            header.addCell(logoCell);

            PdfPCell titleCell = new PdfPCell(new Phrase("예약 확정서", titleFont));
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            header.addCell(titleCell);

            document.add(header);

            space(document, 20);
            drawLine(document);
            space(document, 25);

            /* ================= 예약 정보 ================= */
            section(document, "예약 정보", sectionFont);
            addLine(document, "예약번호", r.getReservationNo(), labelFont, valueFont);
            addLine(document, "프로그램", r.getProgram().getTitle(), labelFont, valueFont);
            addLine(document, "숙소명", r.getStay().getName(), labelFont, valueFont);
            addLine(document, "룸 타입", r.getRoom().getRoomType().name(), labelFont, valueFont);
            addLine(document, "이용 기간",
                    formatDateTime(r.getStartDate()) + " ~ " + formatDateTime(r.getEndDate()),
                    labelFont, valueFont);
            addLine(document, "인원", r.getPeopleCount() + "명", labelFont, valueFont);

            /* ================= 결제 정보 ================= */
            section(document, "결제 정보", sectionFont);
            addLine(document, "결제 금액",
                    NumberFormat.getNumberInstance(Locale.KOREA).format(r.getTotalPrice()) + "원",
                    labelFont, valueFont);

            /* ================= 예약자 정보 ================= */
            section(document, "예약자 정보", sectionFont);
            addLine(document, "이름", r.getUser().getUserName(), labelFont, valueFont);
            addLine(document, "연락처", r.getUser().getPhone(), labelFont, valueFont);
            addLine(document, "이메일", r.getUser().getEmail(), labelFont, valueFont);

            /* ================= 안내 ================= */
            section(document, "안내 사항", sectionFont);
            addLine(document, "예약 변경/취소", "마이페이지에서 가능하며 정책에 따라 제한될 수 있습니다.", labelFont, valueFont);
            addLine(document, "환불 정책", "예약 시점의 환불 규정을 따릅니다.", labelFont, valueFont);
            addLine(document, "문의", "help@workeezy.co.kr / 1578-9846", labelFont, valueFont);

            /* ================= FOOTER ================= */
            Paragraph issued = new Paragraph(
                    "발급일: " + formatDateTime(LocalDateTime.now()),
                    new Font(baseFont, 9, Font.NORMAL, LABEL_COLOR)
            );
            issued.setAlignment(Element.ALIGN_RIGHT);
            issued.setSpacingBefore(25);
            document.add(issued);

            Paragraph companyInfo = new Paragraph(
                    "㈜워키지 | 서울특별시 강남구 테헤란로 123\n",
                    new Font(baseFont, 9,Font.NORMAL, LABEL_COLOR) );
            companyInfo.setAlignment(Element.ALIGN_CENTER);
            companyInfo.setSpacingBefore(20);
            document.add(companyInfo);

            Paragraph footer = new Paragraph(
                    "본 문서는 전자적으로 생성된 문서로, 별도의 서명 없이 유효합니다.",
                    new Font(baseFont, 9, Font.NORMAL, LABEL_COLOR)
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(12);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("OpenPDF 확정서 생성 실패", e);
        }
    }

    /* ================= Helpers ================= */

    private void drawLine(Document doc) throws DocumentException {
        LineSeparator line = new LineSeparator();
        line.setLineWidth(1f);
        line.setLineColor(LINE_COLOR);
        doc.add(line);
    }

    private void section(Document doc, String title, Font font) throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingBefore(18);
        p.setSpacingAfter(6);
        doc.add(p);

        LineSeparator line = new LineSeparator();
        line.setLineColor(LINE_COLOR);
        line.setLineWidth(1f);
        doc.add(line);

        space(doc, 8);
    }

    private void addLine(Document doc, String label, String value,
                         Font labelFont, Font valueFont) throws DocumentException {
        Paragraph p = new Paragraph();
        p.setSpacingBefore(4);
        p.add(new Chunk(label + "  ", labelFont));
        p.add(new Chunk(value, valueFont));
        doc.add(p);
    }

    private void space(Document doc, int height) throws DocumentException {
        Paragraph p = new Paragraph();
        p.setSpacingBefore(height);
        doc.add(p);
    }

    private String formatDateTime(LocalDateTime dt) {
        return dt == null ? "-" : dt.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }

    private BaseFont loadKoreanBaseFont() {
        try {
            ClassPathResource res = new ClassPathResource("fonts/AritaDotumKR-Medium.ttf");
            byte[] bytes = res.getInputStream().readAllBytes();
            return BaseFont.createFont(
                    "AritaDotumKR-Medium.ttf",
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED,
                    true,
                    bytes,
                    null
            );
        } catch (Exception e) {
            throw new RuntimeException("폰트 로드 실패", e);
        }
    }

    private Image loadLogoImage() {
        try {
            ClassPathResource res = new ClassPathResource("images/logo.png");
            Image img = Image.getInstance(res.getInputStream().readAllBytes());
            img.scaleToFit(120, 40);
            return img;
        } catch (Exception e) {
            throw new RuntimeException("로고 로드 실패", e);
        }
    }
}
