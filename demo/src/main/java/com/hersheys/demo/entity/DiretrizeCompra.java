package com.hersheys.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity @Table(name = "diretrizes_compra")
@Data @NoArgsConstructor
public class DiretrizeCompra {

    @Id
    @Column(name = "id_produto")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_produto")
    private Produto produto;

    @Column(name = "codigo_compra")   private String codigoCompra;
    @Column(name = "comprador")       private String comprador;
    @Column(name = "forma_abastecimento") private String formaAbastecimento;
    @Column(name = "embalagem_compra")    private Integer embalagemCompra;
    @Column(name = "margem_categoria_pct") private BigDecimal margemCategoriaPct;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public String getCodigoCompra() {
        return codigoCompra;
    }

    public void setCodigoCompra(String codigoCompra) {
        this.codigoCompra = codigoCompra;
    }

    public String getComprador() {
        return comprador;
    }

    public void setComprador(String comprador) {
        this.comprador = comprador;
    }

    public String getFormaAbastecimento() {
        return formaAbastecimento;
    }

    public void setFormaAbastecimento(String formaAbastecimento) {
        this.formaAbastecimento = formaAbastecimento;
    }

    public Integer getEmbalagemCompra() {
        return embalagemCompra;
    }

    public void setEmbalagemCompra(Integer embalagemCompra) {
        this.embalagemCompra = embalagemCompra;
    }

    public BigDecimal getMargemCategoriaPct() {
        return margemCategoriaPct;
    }

    public void setMargemCategoriaPct(BigDecimal margemCategoriaPct) {
        this.margemCategoriaPct = margemCategoriaPct;
    }
}