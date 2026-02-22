import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function SectionHeader({ title, subtitle, actionLabel, onAction }: SectionHeaderProps) {
    return (
        <View className="flex-row justify-between items-start mb-5">
            <View className="flex-1">
                <Text className="text-white text-[22px] font-bold mb-1">{title}</Text>
                {subtitle && <Text className="text-slate-500 text-sm">{subtitle}</Text>}
            </View>
            {actionLabel && onAction && (
                <TouchableOpacity
                    className="flex-row items-center gap-x-2 bg-accent px-4 py-3 rounded-xl"
                    onPress={onAction}
                >
                    <Text className="text-white text-sm font-semibold">{actionLabel}</Text>
                    <Ionicons name="add-circle" size={18} color="#ffffff" />
                </TouchableOpacity>
            )}
        </View>
    );
}
