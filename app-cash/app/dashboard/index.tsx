import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { PieChart } from "react-native-gifted-charts";
import { api } from "../../services/api";

export default function DashboardScreen() {
  type FornecedorGrafico = {
    fornecedor: string;
    total: number;
  };

  const [dashboard, setDashboard] = useState<any>(null);
  const [fornecedores, setFornecedores] = useState<FornecedorGrafico[]>([]);
  const [loading, setLoading] = useState(true);

  const coresPizza = ["#267e00", "#41b600", "#7cdb41", "#a9f078", "#d2f7b0"];

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const [dashRes, fornRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/dashboard/fornecedores"),
        ]);

        setDashboard(dashRes.data);
        setFornecedores(fornRes.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, []);

  // Prepara os dados limitando aos top 5 e injetando as cores correspondentes
  const dadosGrafico = fornecedores.slice(0, 5).map((f, index) => ({
    value: Number(f.total ?? 0),
    color: coresPizza[index] || "#ccc",
    text: String(f.total ?? 0),
    fornecedorOriginal: f.fornecedor ?? "-",
  }));

  // Calcula o total geral exibido no centro da rosca
  const totalGeralPizza = dadosGrafico.reduce((sum, item) => sum + item.value, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#267e00" />

      {/* O Header estático sempre renderiza imediatamente */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <Text style={styles.subtitle}>Indicadores do cadastro de produtos</Text>
      </View>

      {/* Corpo da tela com fundo cinza padrão */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          // Enquanto os dados não chegam, exibe um loading limpo dentro do fundo cinza
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#267e00" />
            <Text style={styles.loadingText}>Carregando indicadores...</Text>
          </View>
        ) : (
          // Quando os dados chegam, o conteúdo brota suavemente na tela
          <>
            {/* KPIs Linha 1 */}
            <View style={styles.cardsRow}>
              <View style={styles.kpiCard}>
                <Ionicons name="cube-outline" size={28} color="#267e00" />
                <Text style={styles.kpiValue}>{dashboard?.totalProdutos ?? 0}</Text>
                <Text style={styles.kpiLabel}>Produtos</Text>
              </View>

              <View style={styles.kpiCard}>
                <Ionicons name="people-outline" size={28} color="#267e00" />
                <Text style={styles.kpiValue}>{dashboard?.totalFornecedores ?? 0}</Text>
                <Text style={styles.kpiLabel}>Fornecedores</Text>
              </View>
            </View>

            {/* KPIs Linha 2 */}
            <View style={styles.cardsRow}>
              <View style={styles.kpiCard}>
                <Ionicons name="cash-outline" size={28} color="#267e00" />
                <Text style={styles.kpiValue}>R$ {dashboard?.precoMedio?.toFixed(2)}</Text>
                <Text style={styles.kpiLabel}>Custo Médio</Text>
              </View>

              <View style={styles.kpiCard}>
                <Ionicons name="time-outline" size={28} color="#267e00" />
                <Text style={styles.kpiValue}>{Math.round(dashboard?.shelfLifeMedio ?? 0)}</Text>
                <Text style={styles.kpiLabel}>Shelf Life Médio</Text>
              </View>
            </View>

            {/* Gráfico de Pizza */}
            <Text style={styles.sectionTitle}>Top Fornecedores</Text>
            <View style={styles.chartCard}>
              <PieChart
                data={dadosGrafico}
                donut
                radius={85}
                innerRadius={55}
                innerCircleColor="#ffffff"
                showText
                textColor="#ffffff"
                fontWeight="bold"
                centerLabelComponent={() => (
                  <View style={styles.chartCenter}>
                    <Text style={styles.chartCenterValue}>{totalGeralPizza}</Text>
                    <Text style={styles.chartCenterLabel}>Total</Text>
                  </View>
                )}
              />

              <View style={styles.legendContainer}>
                {dadosGrafico.map((item, index) => (
                  <View key={index} style={styles.legendRow}>
                    <View style={[styles.legendBadge, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText} numberOfLines={1}>
                      {item.fornecedorOriginal} ({item.value})
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Atalho */}
            <Text style={styles.sectionTitle}>Acesso rápido</Text>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/produtos")}>
              <Ionicons name="cube-outline" size={24} color="#267e00" />
              <Text style={styles.actionText}>Consultar Produtos</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </>
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
  headerContainer: {
    backgroundColor: "#267e00",
    padding: 16,
    paddingTop: 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#d7ffd0",
    marginTop: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    paddingVertical: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 14,
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  kpiCard: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    color: "#222",
  },
  kpiLabel: {
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  chartCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartCenterValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  chartCenterLabel: {
    fontSize: 10,
    color: "#888",
  },
  legendContainer: {
    width: "100%",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    color: "#444",
    flex: 1,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});