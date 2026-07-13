import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  label: string;
  value: any;
  editando: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad";
};

export default function CampoEditavel({
  label,
  value,
  editando,
  onChangeText,
  keyboardType = "default",
}: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {editando ? (
        <TextInput
          style={styles.input}
          value={value !== null && value !== undefined ? String(value) : ""}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.value}>
          {value !== null && value !== undefined ? String(value) : "-"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    elevation: 4,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
  input: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
    borderBottomWidth: 1.5,
    borderBottomColor: "#267e00",
    paddingBottom: 2,
    color: "#000",
  },
});