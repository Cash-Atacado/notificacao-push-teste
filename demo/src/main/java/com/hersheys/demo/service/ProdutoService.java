package com.hersheys.demo.service;

import com.hersheys.demo.dto.ProdutoDTO;
import com.hersheys.demo.dto.ProdutoRequestDTO;
import com.hersheys.demo.entity.*;
import com.hersheys.demo.repository.FornecedorRepository;
import com.hersheys.demo.repository.ProdutoRepository;
import com.hersheys.demo.spec.ProdutoSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;
    private final FornecedorRepository fornecedorRepository;

    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarTodos() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscarPorId(Integer id) {
        return repository.findById(id).map(this::toDTO).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscarPorCodigo(String codigo) {
        return repository.findByCodigoProduto(codigo).map(this::toDTO).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> buscar(String descricao, String codigo, String fornecedor, String ncm, int page, int size) {

        var spec = ProdutoSpec.filtrar(descricao, codigo, fornecedor, ncm);
        var pageable = PageRequest.of(page, size, Sort.by("descricao"));

        return repository.findAll(spec, pageable).stream().map(this::toDTO).toList();
    }

    @Transactional
    private ProdutoDTO toDTO(Produto p) {
        var dc = p.getDiretrizeCompra();
        var fi = p.getInformacaoFiscal();
        var il = p.getInformacaoLogistica();
        var cp = p.getCustoProduto();

        return ProdutoDTO.builder().id(p.getId()).codigoProduto(p.getCodigoProduto()).descricao(p.getDescricao()).shelfLifeDias(p.getShelfLifeDias()).nivel1(p.getNivel1()).nivel2(p.getNivel2()).nivel3(p.getNivel3()).nivel4(p.getNivel4()).nivel5(p.getNivel5()).complemento(p.getComplemento()).fornecedor(p.getFornecedor() != null ? p.getFornecedor().getNome() : null).comprador(dc != null ? dc.getComprador() : null).formaAbastecimento(dc != null ? dc.getFormaAbastecimento() : null).embalagemCompra(dc != null ? dc.getEmbalagemCompra() : null).margemCategoriaPct(dc != null ? dc.getMargemCategoriaPct() : null).ncm(fi != null ? fi.getNcm() : null).ipiPct(fi != null ? fi.getIpiPct() : null).icmsPct(fi != null ? fi.getIcmsPct() : null).cest(fi != null ? fi.getCest() : null).cfop(fi != null ? fi.getCfop() : null).caixaEmbarqueQtd(il != null ? il.getCaixaEmbarqueQtd() : null).unidadeSecundariaQtd(il != null ? il.getUnidadeSecundariaQtd() : null).dunCaixa(il != null ? il.getDunCaixa() : null).eanDisplay(il != null ? il.getEanDisplay() : null).eanUnidade(il != null ? il.getEanUnidade() : null).custoCaixaMaster(cp != null ? cp.getCustoCaixaMaster() : null).custoDisplay(cp != null ? cp.getCustoDisplay() : null).custoUnidade(cp != null ? cp.getCustoUnidade() : null).build();
    }

    @Transactional
    public ProdutoDTO atualizar(Integer id, ProdutoRequestDTO dto) {

        Produto produto = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        // Campos do produto
        if (dto.getCodigoProduto() != null) produto.setCodigoProduto(dto.getCodigoProduto());
        if (dto.getDescricao() != null) produto.setDescricao(dto.getDescricao());
        if (dto.getShelfLifeDias() != null) produto.setShelfLifeDias(dto.getShelfLifeDias());
        if (dto.getNivel1() != null) produto.setNivel1(dto.getNivel1());
        if (dto.getNivel2() != null) produto.setNivel2(dto.getNivel2());
        if (dto.getNivel3() != null) produto.setNivel3(dto.getNivel3());
        if (dto.getNivel4() != null) produto.setNivel4(dto.getNivel4());
        if (dto.getNivel5() != null) produto.setNivel5(dto.getNivel5());
        if (dto.getComplemento() != null) produto.setComplemento(dto.getComplemento());

        // Fornecedor
        if (dto.getFornecedorId() != null) {
            Fornecedor fornecedor = fornecedorRepository.findById(dto.getFornecedorId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor não encontrado"));
            produto.setFornecedor(fornecedor);
        }

        // Diretriz de compra
        if (dto.getDiretrizCompra() != null) {
            var dc = produto.getDiretrizeCompra();
            var ddto = dto.getDiretrizCompra();
            if (ddto.getComprador() != null) dc.setComprador(ddto.getComprador());
            if (ddto.getFormaAbastecimento() != null) dc.setFormaAbastecimento(ddto.getFormaAbastecimento());
            if (ddto.getEmbalagemCompra() != null) dc.setEmbalagemCompra(ddto.getEmbalagemCompra());
            if (ddto.getMargemCategoriaPct() != null) dc.setMargemCategoriaPct(ddto.getMargemCategoriaPct());
        }

        // Fiscal
        if (dto.getFiscal() != null) {
            var fi = produto.getInformacaoFiscal();
            var fdto = dto.getFiscal();
            if (fdto.getNcm() != null) fi.setNcm(fdto.getNcm());
            if (fdto.getIpiPct() != null) fi.setIpiPct(fdto.getIpiPct());
            if (fdto.getIcmsPct() != null) fi.setIcmsPct(fdto.getIcmsPct());
            if (fdto.getCest() != null) fi.setCest(fdto.getCest());
            if (fdto.getCfop() != null) fi.setCfop(fdto.getCfop());
        }

        // Logística
        if (dto.getLogistica() != null) {
            var il = produto.getInformacaoLogistica();
            var ldto = dto.getLogistica();
            if (ldto.getCaixaEmbarqueQtd() != null) il.setCaixaEmbarqueQtd(ldto.getCaixaEmbarqueQtd());
            if (ldto.getUnidadeSecundariaQtd() != null) il.setUnidadeSecundariaQtd(ldto.getUnidadeSecundariaQtd());
            if (ldto.getDunCaixa() != null) il.setDunCaixa(ldto.getDunCaixa());
            if (ldto.getEanDisplay() != null) il.setEanDisplay(ldto.getEanDisplay());
            if (ldto.getEanUnidade() != null) il.setEanUnidade(ldto.getEanUnidade());
        }

        // Custos
        if (dto.getCusto() != null) {
            var cp = produto.getCustoProduto();
            var cdto = dto.getCusto();
            if (cdto.getCustoCaixaMaster() != null) cp.setCustoCaixaMaster(cdto.getCustoCaixaMaster());
            if (cdto.getCustoDisplay() != null) cp.setCustoDisplay(cdto.getCustoDisplay());
            if (cdto.getCustoUnidade() != null) cp.setCustoUnidade(cdto.getCustoUnidade());
        }

        // Fiscal — adicione NCM, CEST e CFOP (já existia, só confirme que está assim)
        if (dto.getFiscal() != null) {
            var fi = produto.getInformacaoFiscal();
            var fdto = dto.getFiscal();
            if (fdto.getNcm() != null) fi.setNcm(fdto.getNcm());
            if (fdto.getIpiPct() != null) fi.setIpiPct(fdto.getIpiPct());
            if (fdto.getIcmsPct() != null) fi.setIcmsPct(fdto.getIcmsPct());
            if (fdto.getCest() != null) fi.setCest(fdto.getCest());
            if (fdto.getCfop() != null) fi.setCfop(fdto.getCfop());
        }

        // Logística — adicione EAN Display e EAN Unidade (já existia, só confirme)
        if (dto.getLogistica() != null) {
            var il = produto.getInformacaoLogistica();
            var ldto = dto.getLogistica();
            if (ldto.getCaixaEmbarqueQtd() != null) il.setCaixaEmbarqueQtd(ldto.getCaixaEmbarqueQtd());
            if (ldto.getUnidadeSecundariaQtd() != null) il.setUnidadeSecundariaQtd(ldto.getUnidadeSecundariaQtd());
            if (ldto.getDunCaixa() != null) il.setDunCaixa(ldto.getDunCaixa());
            if (ldto.getEanDisplay() != null) il.setEanDisplay(ldto.getEanDisplay());
            if (ldto.getEanUnidade() != null) il.setEanUnidade(ldto.getEanUnidade());
        }

        return toDTO(repository.save(produto));
    }
}