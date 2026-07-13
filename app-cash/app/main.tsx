import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import SearchBar from "@/components/SearchBar";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#267e00" />

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Olá, Bem-vindo!</Text>
        </View>

        <SearchBar
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholder="Buscar no sistema..."
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Funcionalidades</Text>

        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/produtos")}
          >
            <Text style={styles.cardTitle}>Consultar Produtos</Text>
            <Text style={styles.cardText}>Consulte os produtos do sistema</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/dashboard")}
          >
            <Text style={styles.cardTitle}>Relatórios</Text>
            <Text style={styles.cardText}>
              Veja os dados dos produtos cadastrados
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#e7e7e7",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 16,
    color: "#222",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: "space-between",
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#267e00",
    marginBottom: 8,
    textAlign: "center",
  },
  cardText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#666", 
    textAlign: "center",
  },
});