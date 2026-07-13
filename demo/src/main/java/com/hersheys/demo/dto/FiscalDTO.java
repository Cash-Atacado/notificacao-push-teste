package com.hersheys.demo.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FiscalDTO {
    private String ncm;
    private BigDecimal ipiPct;
    private BigDecimal icmsPct;
    private String cest;
    private String cfop;
}
