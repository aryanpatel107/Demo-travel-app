import React from "react";
import { View, TextInput, StyleSheet, Pressable, Text } from "react-native";
import { Colors } from "../constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search destinations, countries, tags...",
  onClear,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.slate400}
        style={styles.input}
        returnKeyType="search"
      />
      {value.length > 0 && onClear ? (
        <Pressable onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.clearText}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.slate200,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.slate900,
    height: "100%",
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    fontSize: 12,
    color: Colors.slate400,
    fontWeight: "bold",
  },
});

export default SearchBar;
