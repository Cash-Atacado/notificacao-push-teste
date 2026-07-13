package com.hersheys.demo.repository;

import com.hersheys.demo.dto.FornecedorDTO;
import com.hersheys.demo.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface DashboardRepository extends JpaRepository<Produto, Integer> {

    @Query("""
        select count(p)
        from Produto p
    """)
    Long totalProdutos();

    @Query("""
        select count(f)
        from Fornecedor f
    """)
    Long totalFornecedores();

    @Query("""
        select avg(cp.custoUnidade)
        from CustoProduto cp
    """)
    BigDecimal precoMedio();

    @Query("""
        select avg(p.shelfLifeDias)
        from Produto p
    """)
    Double shelfLifeMedio();

    @Query("""
        select
            f.nome as fornecedor,
            count(p) as total
        from Produto p
        join p.fornecedor f
        group by f.nome
        order by count(p) desc
    """)
    List<FornecedorDTO> topFornecedores();
}