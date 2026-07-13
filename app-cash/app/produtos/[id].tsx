import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { api } from "../../services/api";
import CampoForms from "@/components/CampoForms";
import CampoEditavel from "@/components/CampoEditavel";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProdutoDetalhe() {
  const { id } = useLocalSearchParams();

  const [produto, setProduto] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (id) carregarProduto();
  }, [id]);

  const carregarProduto = async () => {
    try {
      const response = await api.get(`/produtos/${id}`);
      const data = response.data;

      setProduto(data);
      setForm({
        ...data,
        shelfLifeDias: data.shelfLifeDias?.toString() ?? "",
        embalagemCompra: data.embalagemCompra?.toString() ?? "",
        margemCategoriaPct: data.margemCategoriaPct?.toString() ?? "",
        custoCaixaMaster: data.custoCaixaMaster?.toString() ?? "",
        custoDisplay: data.custoDisplay?.toString() ?? "",
        custoUnidade: data.custoUnidade?.toString() ?? "",
        ncm: data.ncm ?? "",
        cest: data.cest ?? "",
        cfop: data.cfop ?? "",
        eanDisplay: data.eanDisplay ?? "",
        eanUnidade: data.eanUnidade ?? "",
      });
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };

  const atualizar = (campo: string, valor: string) => {
    setForm((prev: any) => ({ ...prev, [campo]: valor }));
  };

  const cancelar = async () => {
    await carregarProduto();
    setEditando(false);
  };

  const salvar = async () => {
    setSalvando(true);
    try {
      const body = {
        descricao: form.descricao,
        shelfLifeDias:
          form.shelfLifeDias !== "" ? Number(form.shelfLifeDias) : null,
        nivel1: form.nivel1,
        nivel2: form.nivel2,
        nivel3: form.nivel3,
        nivel4: form.nivel4,
        nivel5: form.nivel5,
        complemento: form.complemento,
        diretrizCompra: {
          comprador: form.comprador,
          formaAbastecimento: form.formaAbastecimento,
          embalagemCompra:
            form.embalagemCompra !== "" ? Number(form.embalagemCompra) : null,
          margemCategoriaPct:
            form.margemCategoriaPct !== ""
              ? Number(form.margemCategoriaPct)
              : null,
        },

        fiscal: {
          ncm: form.ncm !== "" ? form.ncm : null,
          cest: form.cest !== "" ? form.cest : null,
          cfop: form.cfop !== "" ? form.cfop : null,
        },

        logistica: {
          eanDisplay: form.eanDisplay !== "" ? form.eanDisplay : null,
          eanUnidade: form.eanUnidade !== "" ? form.eanUnidade : null,
        },
        custo: {
          custoCaixaMaster:
            form.custoCaixaMaster !== "" ? Number(form.custoCaixaMaster) : null,
          custoDisplay:
            form.custoDisplay !== "" ? Number(form.custoDisplay) : null,
          custoUnidade:
            form.custoUnidade !== "" ? Number(form.custoUnidade) : null,
        },
      };

      await api.put(`/produtos/${id}`, body);
      await carregarProduto();
      setEditando(false);
      Alert.alert("Sucesso", "Produto atualizado com sucesso.");
    } catch (error: any) {
      console.log(error.response?.data);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  if (!produto || !form) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#267e00" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#267e00" />

      {/* ── Header ── */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={editando ? cancelar : () => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>
            {editando ? "Editar Produto" : "Detalhes do Produto"}
          </Text>

          {!editando ? (
            <TouchableOpacity
              style={styles.btnEditar}
              onPress={() => setEditando(true)}
            >
              <Ionicons name="pencil" size={16} color="#267e00" />
              <Text style={styles.btnEditarText}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btnEditar, styles.btnSalvar]}
              onPress={salvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={[styles.btnEditarText, { color: "#fff" }]}>
                    Salvar
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ── Código fixo — nunca editável ── */}
        <View style={styles.codigoDestaque}>
          <Text style={styles.codigoLabel}>Código do Produto</Text>
          <Text style={styles.codigoValor}>{produto.codigoProduto}</Text>
        </View>
      </View>

      {/* ── Conteúdo ── */}
      <ScrollView style={styles.container}>
        <View style={styles.forms}>
          <Text style={styles.secao}>Identificação</Text>
          <CampoEditavel
            label="NCM"
            value={form.ncm ?? ""}
            editando={editando}
            keyboardType="numeric"
            onChangeText={(v) => atualizar("ncm", v)}
          />
          <CampoEditavel
            label="CEST"
            value={form.cest ?? ""}
            editando={editando}
            keyboardType="numeric"
            onChangeText={(v) => atualizar("cest", v)}
          />
          <CampoEditavel
            label="CFOP"
            value={form.cfop ?? ""}
            editando={editando}
            keyboardType="numeric"
            onChangeText={(v) => atualizar("cfop", v)}
          />
          <CampoEditavel
            label="EAN Unidade"
            value={form.eanUnidade ?? ""}
            editando={editando}
            keyboardType="numeric"
            onChangeText={(v) => atualizar("eanUnidade", v)}
          />
          <CampoEditavel
            label="EAN Display"
            value={form.eanDisplay ?? ""}
            editando={editando}
            keyboardType="numeric"
            onChangeText={(v) => atualizar("eanDisplay", v)}
          />

          <Text style={styles.secao}>Produto</Text>
          <CampoEditavel
            label="Descrição"
            value={form.descricao}
            editando={editando}
            onChangeText={(v) => atualizar("descricao", v)}
          />
          <CampoEditavel
            label="Shelf Life (dias)"
            value={form.shelfLifeDias}
            editando={editando}
            keyboardType="numeric"
            onChangeText={(v) => atualizar("shelfLifeDias", v)}
          />
          <CampoEditavel
            label="Nível 1"
            value={form.nivel1}
            editando={editando}
            onChangeText={(v) => atualizar("nivel1", v)}
          />
          <CampoEditavel
            label="Nível 2"
            value={form.nivel2}
            editando={editando}
            onChangeText={(v) => atualizar("nivel2", v)}
          />
          <CampoEditavel
            label="Nível 3"
            value={form.nivel3}
            editando={editando}
            onChangeText={(v) => atualizar("nivel3", v)}
          />
          <CampoEditavel
            label="Nível 4"
            value={form.nivel4}
            editando={editando}
            onChangeText={(v) => atualizar("nivel4", v)}
          />
          <CampoEditavel
            label="Nível 5"
            value={form.nivel5}
            editando={editando}
            onChangeText={(v) => atualizar("nivel5", v)}
          />
          <CampoEditavel
            label="Complemento"
            value={form.complemento}
            editando={editando}
            onChangeText={(v) => atualizar("complemento", v)}
          />

          <Text style={styles.secao}>Compra</Text>
          <CampoForms label="Fornecedor" value={produto.fornecedor} />
          <CampoEditavel
            label="Comprador"
            value={form.comprador}
            editando={editando}
            onChangeText={(v) => atualizar("comprador", v)}
          />
          <CampoEditavel
            label="Abastecimento"
            value={form.formaAbastecimento}
            editando={editando}
            onChangeText={(v) => atualizar("formaAbastecimento", v)}
          />
          <CampoEditavel
            label="Embalagem Compra"
            value={form.embalagemCompra}
            editando={editando}
            keyboardType="numeric"
            onChangeText={(v) => atualizar("embalagemCompra", v)}
          />
          <CampoEditavel
            label="Margem %"
            value={form.margemCategoriaPct}
            editando={editando}
            keyboardType="decimal-pad"
            onChangeText={(v) => atualizar("margemCategoriaPct", v)}
          />

          <Text style={styles.secao}>Custos</Text>
          <CampoEditavel
            label="Custo Unidade"
            value={form.custoUnidade}
            editando={editando}
            keyboardType="decimal-pad"
            onChangeText={(v) => atualizar("custoUnidade", v)}
          />
          <CampoEditavel
            label="Custo Display"
            value={form.custoDisplay}
            editando={editando}
            keyboardType="decimal-pad"
            onChangeText={(v) => atualizar("custoDisplay", v)}
          />
          <CampoEditavel
            label="Custo Caixa Master"
            value={form.custoCaixaMaster}
            editando={editando}
            keyboardType="decimal-pad"
            onChangeText={(v) => atualizar("custoCaixaMaster", v)}
          />
        </View>

        {editando && (
          <TouchableOpacity style={styles.btnCancelar} onPress={cancelar}>
            <Text style={styles.btnCancelarText}>Cancelar alterações</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#267e00",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#267e00",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  btnEditar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  btnSalvar: {
    backgroundColor: "#1a5c00",
  },
  btnEditarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#267e00",
  },

  // Código fixo
  codigoDestaque: {
    backgroundColor: "#1a5c00",
    marginHorizontal: -16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  codigoLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  codigoValor: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 2,
    letterSpacing: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#e7e7e7",
    padding: 16,
  },
  forms: {
    marginBottom: 20,
  },
  secao: {
    fontSize: 12,
    fontWeight: "700",
    color: "#267e00",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 10,
  },
  btnCancelar: {
    marginBottom: 32,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#267e00",
    alignItems: "center",
  },
  btnCancelarText: {
    color: "#267e00",
    fontWeight: "600",
    fontSize: 14,
  },
});
