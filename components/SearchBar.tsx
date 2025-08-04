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
    <View className="flex-row items-center bg-gray-100 rounded-lg mx-4 mb-4 px-3 py-2">
      <Ionicons name="search-outline" size={20} color="#666" />
      <TextInput
        className="flex-1 ml-3 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={searchValue}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {searchValue.length > 0 && (
        <TouchableOpacity onPress={handleClear} className="ml-2">
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={handleSearch}
        className="ml-2 bg-blue-500 px-3 py-1 rounded"
      >
        <Text className="text-white text-sm font-medium">Search</Text>
      </TouchableOpacity>
    </View>
  );
};
