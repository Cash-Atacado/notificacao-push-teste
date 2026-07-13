import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  label: string;
  value: any;
};

export default function CampoForms({ label, value }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value !== null && value !== undefined ? String(value) : "-"}
      </Text>
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
});
