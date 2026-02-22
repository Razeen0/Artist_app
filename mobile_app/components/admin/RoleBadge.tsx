import React from "react";
import { View, Text } from "react-native";

interface RoleBadgeProps {
    role: string;
}

const roleStyles: Record<string, { bg: string; text: string; border: string }> = {
    admin: { bg: "bg-admin/15", text: "text-admin", border: "border-admin/30" },
    artist: { bg: "bg-artist/15", text: "text-artist", border: "border-artist/30" },
    customer: { bg: "bg-customer/15", text: "text-customer", border: "border-customer/30" },
};

export default function RoleBadge({ role }: RoleBadgeProps) {
    const config = roleStyles[role?.toLowerCase()] || roleStyles.customer;

    return (
        <View className={`px-3 py-0.5 rounded-full border self-start ${config.bg} ${config.border}`}>
            <Text className={`text-[10px] font-semibold capitalize ${config.text}`}>{role}</Text>
        </View>
    );
}
