package com.hersheys.demo.controller;

import com.hersheys.demo.dto.ProdutoDTO;
import com.hersheys.demo.dto.ProdutoRequestDTO;
import com.hersheys.demo.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService service;

    @GetMapping
    public List<ProdutoDTO> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ProdutoDTO buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/buscar")
    public List<ProdutoDTO> buscar(
            @RequestParam(required = false) String descricao,
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String fornecedor,
            @RequestParam(required = false) String ncm,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.buscar(descricao, codigo, fornecedor, ncm, page, size);
    }

    @PutMapping("/{id}")
    public ProdutoDTO atualizar(@PathVariable Integer id,
                                @RequestBody ProdutoRequestDTO dto) {
        return service.atualizar(id, dto);
    }

}