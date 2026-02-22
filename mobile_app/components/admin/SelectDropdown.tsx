import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectOption {
    label: string;
    value: string;
}

interface SelectDropdownProps {
    options: SelectOption[];
    selected: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    label?: string;
}

/**
 * React-Select equivalent for React Native.
 * A styled dropdown modal that matches the admin panel dark theme.
 *
 * Usage:
 *   <SelectDropdown
 *     label="Role"
 *     options={[{ label: "Admin", value: "admin" }, ...]}
 *     selected={role}
 *     onSelect={setRole}
 *     placeholder="Select a role..."
 *   />
 */
export default function SelectDropdown({
    options,
    selected,
    onSelect,
    placeholder = "Select...",
    label,
}: SelectDropdownProps) {
    const [open, setOpen] = useState(false);

    const selectedLabel = options.find((o) => o.value === selected)?.label;

    return (
        <View className="mb-4">
            {label && (
                <Text className="text-slate-400 text-xs font-medium mb-2">{label}</Text>
            )}

            {/* Trigger */}
            <TouchableOpacity
                className="flex-row items-center justify-between bg-dark-600 border border-white/5 rounded-xl px-4 py-3.5"
                onPress={() => setOpen(true)}
            >
                <Text className={selectedLabel ? "text-white text-sm" : "text-slate-500 text-sm"}>
                    {selectedLabel || placeholder}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#94a3b8" />
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal visible={open} transparent animationType="fade">
                <TouchableOpacity
                    className="flex-1 bg-black/60 justify-center items-center px-8"
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View className="w-full bg-dark-700 rounded-2xl border border-white/10 overflow-hidden max-h-[400]">
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-5 py-4 border-b border-white/5">
                            <Text className="text-white text-base font-semibold">
                                {label || "Select an option"}
                            </Text>
                            <TouchableOpacity onPress={() => setOpen(false)}>
                                <Ionicons name="close" size={22} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {/* Options list */}
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => {
                                const isSelected = item.value === selected;
                                return (
                                    <TouchableOpacity
                                        className={`flex-row items-center justify-between px-5 py-4 border-b border-white/5 ${isSelected ? "bg-accent/10" : ""
                                            }`}
                                        onPress={() => {
                                            onSelect(item.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Text
                                            className={`text-sm ${isSelected ? "text-accent font-semibold" : "text-slate-300"
                                                }`}
                                        >
                                            {item.label}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
