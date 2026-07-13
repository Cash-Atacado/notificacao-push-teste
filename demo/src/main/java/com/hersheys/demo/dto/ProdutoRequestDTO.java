package com.hersheys.demo.dto;

import lombok.Data;

@Data
public class ProdutoRequestDTO {

    private String codigoProduto;
    private String descricao;
    private Integer shelfLifeDias;

    private String nivel1;
    private String nivel2;
    private String nivel3;
    private String nivel4;
    private String nivel5;

    private String complemento;

    private Integer fornecedorId;

    private DiretrizCompraDTO diretrizCompra;
    private FiscalDTO fiscal;
    private LogisticaDTO logistica;
    private CustoDTO custo;
}