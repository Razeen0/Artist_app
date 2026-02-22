import React from "react";
import { View, Text } from "react-native";

const AvatarColors = [
    "#3b82f6", "#22c55e", "#f59e0b", "#a855f7",
    "#06b6d4", "#ef4444", "#ec4899", "#14b8a6",
];

const getColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AvatarColors[Math.abs(hash) % AvatarColors.length];
};

interface AvatarProps {
    name: string;
    size?: number;
}

export default function Avatar({ name, size = 40 }: AvatarProps) {
    const initial = name ? name.charAt(0).toUpperCase() : "?";
    const bg = getColor(name || "");

    // We use inline style for dynamic size + bg color since Tailwind doesn't support arbitrary runtime values well
    return (
        <View
            className="items-center justify-center rounded-full"
            style={{ width: size, height: size, backgroundColor: bg }}
        >
            <Text className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
                {initial}
            </Text>
        </View>
    );
}
