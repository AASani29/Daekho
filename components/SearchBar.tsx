import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search movies...",
  value,
  onChangeText,
}) => {
  const [localValue, setLocalValue] = useState("");
  const searchValue = value !== undefined ? value : localValue;

  const handleChangeText = (text: string) => {
    if (value !== undefined) {
      onChangeText?.(text);
    } else {
      setLocalValue(text);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleClear = () => {
    const newValue = "";
    if (value !== undefined) {
      onChangeText?.(newValue);
    } else {
      setLocalValue(newValue);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#374151",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Ionicons name="search-outline" size={20} color="#9CA3AF" />
      <TextInput
        style={{
          flex: 1,
          marginLeft: 12,
          fontSize: 16,
          color: "#F9FAFB",
        }}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={searchValue}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {searchValue.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={{ marginLeft: 8 }}>
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={handleSearch}
        style={{
          marginLeft: 8,
          backgroundColor: "#F59E0B",
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: "#1F2937",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          Search
        </Text>
      </TouchableOpacity>
    </View>
  );
};
