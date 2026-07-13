package com.hersheys.demo.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CustoDTO {
    private BigDecimal custoCaixaMaster;
    private BigDecimal custoDisplay;
    private BigDecimal custoUnidade;
}