package com.hersheys.demo.repository;

import com.hersheys.demo.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository
        extends JpaRepository<Produto, Integer>,
        JpaSpecificationExecutor<Produto> {
    // mantém os métodos existentes
    Optional<Produto> findByCodigoProduto(String codigoProduto);
    boolean existsByCodigoProduto(String codigoProduto);
}