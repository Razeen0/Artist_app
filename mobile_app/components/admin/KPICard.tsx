import React from "react";
import { View, Text } from "react-native";

interface KPICardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendPositive?: boolean;
    accentColor?: string;
}

export default function KPICard({ title, value, icon, trend, trendPositive, accentColor }: KPICardProps) {
    return (
        <View className="bg-dark-700 rounded-2xl p-5 w-[170] mr-3 border border-white/5">
            <View className="flex-row justify-between items-start mb-3">
                <Text className="text-slate-400 text-xs font-medium flex-1">{title}</Text>
                <View className="w-9 h-9 rounded-xl bg-white/5 items-center justify-center">
                    {icon}
                </View>
            </View>
            <Text className="text-white text-[28px] font-extrabold tracking-tight mb-1">{value}</Text>
            {trend && (
                <Text className={`text-[10px] font-semibold ${trendPositive ? "text-success" : "text-danger"}`}>
                    {trend}
                    <Text className="text-slate-500 font-normal"> vs last week</Text>
                </Text>
            )}
        </View>
    );
}
