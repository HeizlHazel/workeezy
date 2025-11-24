package com.together.workeezy.domain.reservation;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "tb_reservation_pdf")
public class ReservationPdf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pdf_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "confirmation_date", nullable = false)
    private Instant confirmationDate;

    @Size(max = 500)
    @NotNull
    @Column(name = "pdf_file_path", nullable = false, length = 500)
    private String pdfFilePath;

    @Size(max = 15)
    @NotNull
    @Column(name = "confirm_number", nullable = false, length = 15)
    private String confirmNumber;

}