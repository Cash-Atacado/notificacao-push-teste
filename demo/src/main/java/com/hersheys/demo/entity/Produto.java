package com.hersheys.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Table(name = "produtos")
@Data @NoArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Integer id;

    @Column(name = "codigo_produto")
    private String codigoProduto;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "shelf_life_dias")
    private Integer shelfLifeDias;

    @Column(name = "nivel_1") private String nivel1;
    @Column(name = "nivel_2") private String nivel2;
    @Column(name = "nivel_3") private String nivel3;
    @Column(name = "nivel_4") private String nivel4;
    @Column(name = "nivel_5") private String nivel5;
    @Column(name = "complemento") private String complemento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_fornecedor")
    private Fornecedor fornecedor;

    @OneToOne(mappedBy = "produto", fetch = FetchType.LAZY)
    private DiretrizeCompra diretrizeCompra;

    @OneToOne(mappedBy = "produto", fetch = FetchType.LAZY)
    private InformacaoFiscal informacaoFiscal;

    @OneToOne(mappedBy = "produto", fetch = FetchType.LAZY)
    private InformacaoLogistica informacaoLogistica;

    @OneToOne(mappedBy = "produto", fetch = FetchType.LAZY)
    private CustoProduto custoProduto;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCodigoProduto() {
        return codigoProduto;
    }

    public void setCodigoProduto(String codigoProduto) {
        this.codigoProduto = codigoProduto;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getShelfLifeDias() {
        return shelfLifeDias;
    }

    public void setShelfLifeDias(Integer shelfLifeDias) {
        this.shelfLifeDias = shelfLifeDias;
    }

    public String getNivel1() {
        return nivel1;
    }

    public void setNivel1(String nivel1) {
        this.nivel1 = nivel1;
    }

    public String getNivel2() {
        return nivel2;
    }

    public void setNivel2(String nivel2) {
        this.nivel2 = nivel2;
    }

    public String getNivel3() {
        return nivel3;
    }

    public void setNivel3(String nivel3) {
        this.nivel3 = nivel3;
    }

    public String getNivel4() {
        return nivel4;
    }

    public void setNivel4(String nivel4) {
        this.nivel4 = nivel4;
    }

    public String getNivel5() {
        return nivel5;
    }

    public void setNivel5(String nivel5) {
        this.nivel5 = nivel5;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public Fornecedor getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(Fornecedor fornecedor) {
        this.fornecedor = fornecedor;
    }

    public DiretrizeCompra getDiretrizeCompra() {
        return diretrizeCompra;
    }

    public void setDiretrizeCompra(DiretrizeCompra diretrizeCompra) {
        this.diretrizeCompra = diretrizeCompra;
    }

    public InformacaoFiscal getInformacaoFiscal() {
        return informacaoFiscal;
    }

    public void setInformacaoFiscal(InformacaoFiscal informacaoFiscal) {
        this.informacaoFiscal = informacaoFiscal;
    }

    public InformacaoLogistica getInformacaoLogistica() {
        return informacaoLogistica;
    }

    public void setInformacaoLogistica(InformacaoLogistica informacaoLogistica) {
        this.informacaoLogistica = informacaoLogistica;
    }

    public CustoProduto getCustoProduto() {
        return custoProduto;
    }

    public void setCustoProduto(CustoProduto custoProduto) {
        this.custoProduto = custoProduto;
    }
}