import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
  
        <View style={styles.headerContainer}>
          <Text style={styles.textoTitulo}>Cash APP</Text>
        </View>

        <Image
          source={require("../assets/cash_atacado.jpg")}
          style={styles.logo}
        />

        <View style={styles.footerContainer}>
          <Link href="/main" asChild>
            <TouchableOpacity style={styles.botao} activeOpacity={0.85}>
              <Text style={styles.textoBotao}>Acessar Plataforma</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.textoVersao}>Versão 1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22a100",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40, 
  },
  textoTitulo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  textoSubtitulo: {
    fontSize: 15,
    color: "#d7ffd0",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  logo: {
    width: width * 0.55,
    height: width * 0.55,
    resizeMode: "cover",
    borderRadius: (width * 0.55) / 2,
    borderWidth: 4,
    borderColor: "#ffffff4d",
    marginBottom: 45, 
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
  },
  botao: {
    backgroundColor: "#ffffff",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  textoBotao: {
    color: "#267e00",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  textoVersao: {
    color: "#cbdcbd",
    fontSize: 12,
    marginTop: 16,
  },
});
