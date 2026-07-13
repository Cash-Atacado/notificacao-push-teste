package com.hersheys.demo.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DiretrizCompraDTO {
    private String comprador;
    private String formaAbastecimento;
    private Integer embalagemCompra;
    private BigDecimal margemCategoriaPct;
}
