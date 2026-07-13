import os
import warnings
import pandas as pd
from flask import Flask, request, render_template, jsonify
from sqlalchemy import create_engine, text

warnings.filterwarnings("ignore", category=UserWarning, module="openpyxl")

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"

engine = create_engine(
    "postgresql://postgres:root@localhost:5432/cadastro_hersheys"
)

# Funções Auxiliares
def texto_ou_none(valor):
    if valor is None:
        return None
    texto = str(valor).strip()
    return None if texto == "" or texto.lower() == "none" else texto

def codigo(valor):
    if valor is None:
        return None
    try:
        return str(int(float(valor)))
    except Exception:
        return str(valor).strip()

def codigo_fixo(valor, tamanho):
    r = codigo(valor)
    return r.zfill(tamanho) if r else None

def limpar_dinheiro(valor):
    if valor is None:
        return None
    try:
        if isinstance(valor, str):
            valor = valor.replace("R$", "").replace(".", "").replace(",", ".")
        return round(float(valor), 2)
    except Exception:
        return None

def sim_nao_para_bool(valor):
    if valor is None:
        return None
    v = str(valor).strip().upper()
    if v == "SIM":
        return True
    if v in ["NÃO", "NAO"]:
        return False
    return None

def inteiro_ou_none(valor):
    if valor is None:
        return None
    try:
        return int(float(valor))
    except Exception:
        return None

chamada = text("""
    SELECT importar_produto(
        :codigo_produto, :descricao, :shelf_life,
        :nivel1, :nivel2, :nivel3, :nivel4, :nivel5, :complemento,
        :fornecedor, :codigo_compra, :comprador, :forma_abastecimento,
        :embalagem_compra, :margem, :ncm, :ipi, :icms, :cst, :cest, :cfop,
        :reducao, :aliq_reducao, :st, :aliq_st, :pauta,
        :caixa_embarque, :unidade_secundaria, :dun, :ean_display, :ean_unidade,
        :camada, :altura, :custo_caixa_master, :custo_display, :custo_unidade
    )
""")

# Rota para o upload dos arquivos
@app.route("/", methods=["GET", "POST"])
def upload_file():
    preview = None
    nome_arquivo = None

    if request.method == "POST":

        file = request.files.get("file")

        if not file or file.filename == "":
            return render_template("index.html", erro="Nenhum arquivo selecionado.")

        if not file.filename.endswith((".xlsx", ".xls")):
            return render_template("index.html", erro="Formato inválido. Envie um arquivo .xlsx ou .xls.")

        os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
        path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(path)
        nome_arquivo = file.filename

        # Linha 4 (indice 3) vira nomes das colunas
        # Linha 5 (indice 4) em diante vira dados
        df = pd.read_excel(path, sheet_name="Itens", header=3)
        df = df.loc[:, ~df.columns.str.contains("^Unnamed")]
        df = df.rename(columns={
            "Quantidade": "qtd_caixa_embarque",
            "Quantidade.1": "qtd_unidade_secundaria"
        })
        df = df.astype(object).where(pd.notnull(df), None)

        # ----- VISUALIZAR -----
        if "visualizar" in request.form:
            preview = df.head(20).to_html(
                classes="preview-table",
                index=False,
                border=0
            )
            return render_template(
                "index.html",
                preview=preview,
                nome_arquivo=nome_arquivo,
                total_linhas=len(df)
            )

        # ----- IMPORTAR -----
        if "importar" in request.form:
            logs = []
            erros = 0
            sucessos = 0

            with engine.begin() as con:
                for i, linha in enumerate(df.to_dict("records"), start=1):
                    try:
                        con.execute(chamada, {
                            "codigo_produto":      codigo(linha.get("Código do produto (o mesmo da NF)")),
                            "descricao":           texto_ou_none(linha.get("Descrição (Familia)")),
                            "shelf_life":          inteiro_ou_none(linha.get("Validade em dias (SHELF Life)")),
                            "nivel1":              texto_ou_none(linha.get("Nivel 1")),
                            "nivel2":              texto_ou_none(linha.get("Nivel 2")),
                            "nivel3":              texto_ou_none(linha.get("Nivel 3")),
                            "nivel4":              texto_ou_none(linha.get("Nivel 4")),
                            "nivel5":              texto_ou_none(linha.get("Nivel 5")),
                            "complemento":         texto_ou_none(linha.get("Complemento")),
                            "fornecedor":          texto_ou_none(linha.get("Descrição")),
                            "codigo_compra":       codigo(linha.get("Código")),
                            "comprador":           texto_ou_none(linha.get("Comprador")),
                            "forma_abastecimento": texto_ou_none(linha.get("Forma de abastecimento")),
                            "embalagem_compra":    inteiro_ou_none(linha.get("Embalagem de Compra")),
                            "margem":              linha.get("Margem Categ %"),
                            "ncm":                 codigo_fixo(linha.get("Classificação fiscal (NCM)"), 8),
                            "ipi":                 linha.get("IPI (%)"),
                            "icms":                linha.get("ICMS (%)"),
                            "cst":                 texto_ou_none(linha.get("CST da Operação")),
                            "cest":                codigo_fixo(linha.get("CEST"), 7),
                            "cfop":                codigo_fixo(linha.get("CFOP"), 4),
                            "reducao":             sim_nao_para_bool(linha.get("Redução de Base de Cálculo? (SIM/NÃO)")),
                            "aliq_reducao":        linha.get("Qual Aliquota de Redução da Base de Cálculo?"),
                            "st":                  sim_nao_para_bool(linha.get("Sub. Tributária? (SIM/NÃO)")),
                            "aliq_st":             linha.get("Qual Aliq da Subst Tributária"),
                            "pauta":               sim_nao_para_bool(linha.get("Pauta Tributaria? (Sim/Não)")),
                            "caixa_embarque":      inteiro_ou_none(linha.get("qtd_caixa_embarque")),
                            "unidade_secundaria":  inteiro_ou_none(linha.get("qtd_unidade_secundaria")),
                            "dun":                 codigo_fixo(linha.get("DUN 14 (Caixa)"), 14),
                            "ean_display":         codigo_fixo(linha.get("EAN 13 (Display)"), 13),
                            "ean_unidade":         codigo_fixo(linha.get("EAN8/13 (unidade de consumo)"), 13),
                            "camada":              inteiro_ou_none(linha.get("Camada")),
                            "altura":              inteiro_ou_none(linha.get("Altura")),
                            "custo_caixa_master":  limpar_dinheiro(linha.get("Caixa Master")),
                            "custo_display":       limpar_dinheiro(linha.get("Display")),
                            "custo_unidade":       limpar_dinheiro(linha.get("Unidade")),
                        })
                        logs.append({"linha": i, "status": "ok", "msg": "Importado com sucesso"})
                        sucessos += 1

                    except Exception as e:
                        logs.append({"linha": i, "status": "erro", "msg": str(e)})
                        erros += 1

            return render_template(
                "index.html",
                logs=logs,
                sucessos=sucessos,
                erros=erros,
                nome_arquivo=nome_arquivo
            )

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)