import { View, TextInput, StyleSheet } from "react-native";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleChange(text: string) {
    setQuery(text);
    onSearch(text);
  }

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder ?? "Search destinations..."}
        placeholderTextColor="rgba(31, 41, 55, 0.4)"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2937",
  },
});