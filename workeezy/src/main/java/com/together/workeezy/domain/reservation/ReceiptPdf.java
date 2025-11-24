package com.together.workeezy.domain.reservation;

import com.together.workeezy.domain.payment.Payment;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tb_receipt_pdf")
public class ReceiptPdf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receipt_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Size(max = 500)
    @NotNull
    @Column(name = "pdf_file_path", nullable = false, length = 500)
    private String pdfFilePath;

    @Size(max = 15)
    @NotNull
    @Column(name = "confirm_number", nullable = false, length = 15)
    private String confirmNumber;

}