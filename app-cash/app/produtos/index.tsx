import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { api } from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/SearchBar";

type Produto = {
  id: number;
  codigoProduto: string;
  descricao: string;
};

const PAGE_SIZE = 20;

export default function ProdutosScreen() {
  const [search, setSearch] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [temMais, setTemMais] = useState(true);

  // Interpreta o texto digitado e monta os params do endpoint /buscar
  const parseBusca = (text: string) => {
    const clean = text.trim();
    if (!clean) return {};

    // Número com 5+ dígitos = código exato
    if (/^\d{5,}$/.test(clean)) return { codigo: clean };

    // Prefixo "ncm:" = busca por NCM
    if (/^ncm:/i.test(clean))
      return { ncm: clean.replace(/^ncm:/i, "").trim() };

    // Prefixo "forn:" = busca por fornecedor
    if (/^forn:/i.test(clean))
      return { fornecedor: clean.replace(/^forn:/i, "").trim() };

    // Qualquer outro texto = descrição
    return { descricao: clean };
  };

  const buscar = useCallback(async (texto: string, novaPagina: number) => {
    try {
      novaPagina === 0 ? setLoading(true) : setLoadingMore(true);

      const params = {
        ...parseBusca(texto),
        page: novaPagina,
        size: PAGE_SIZE,
      };

      const res = await api.get("/produtos/buscar", { params });
      const novos: Produto[] = Array.isArray(res.data) ? res.data : [];

      setProdutos((prev) => (novaPagina === 0 ? novos : [...prev, ...novos]));
      setTemMais(novos.length === PAGE_SIZE);
      setPage(novaPagina);
    } catch (error) {
      console.error("Erro na busca:", error);
      if (novaPagina === 0) setProdutos([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounce — toda vez que o texto mudar, reinicia do page 0
  useEffect(() => {
    const timeout = setTimeout(() => buscar(search, 0), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const carregarMais = () => {
    if (!loadingMore && temMais && !loading) buscar(search, page + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#267e00" />

      <View style={styles.header_container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Produtos</Text>
        </View>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Descrição, código, ncm:, forn:"
        />
      </View>

      <View style={styles.container}>
  {loading ? (
    // Se estiver carregando a página inicial, exibe apenas o indicador centralizado de forma limpa
    <View style={styles.loadingCenter}>
      <ActivityIndicator color="#267e00" size="large" />
    </View>
  ) : produtos.length === 0 ? (
    // Se não estiver carregando e a lista for vazia, mostra o feedback de vazio
    <View style={styles.vazio}>
      <Ionicons name="search-outline" size={40} color="#aaa" />
      <Text style={styles.vazioText}>Nenhum produto encontrado</Text>
    </View>
  ) : (
    // Só renderiza a lista se não estiver em loading e houver produtos
    <FlatList
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
      onEndReached={carregarMais}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            color="#267e00"
            style={{ marginVertical: 16 }}
          />
        ) : !temMais && produtos.length > 0 ? (
          <Text style={styles.fimLista}>Fim dos resultados</Text>
        ) : null
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/produtos/${item.id}`)}
        >
          <Text style={styles.nome}>{item.descricao}</Text>
          <Text style={styles.codigo}>Código: {item.codigoProduto}</Text>
        </TouchableOpacity>
      )}
    />
  )}
</View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#267e00",
  },
  header_container: {
    backgroundColor: "#267e00",
    padding: 16
  },
  container: {
    flex: 1,
    backgroundColor: "#e7e7e7",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 10,
  },
  backButton: { marginRight: 12 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  vazioText: {
    color: "#aaa",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
  },
  codigo: {
    fontSize: 12,
    color: "#666",
  },
  fimLista: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
    marginVertical: 16,
  },
});
