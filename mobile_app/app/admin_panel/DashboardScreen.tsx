import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import KPICard from "../../components/admin/KPICard";
import Avatar from "../../components/admin/Avatar";
import StatusBadge from "../../components/admin/StatusBadge";

const STATS = {
  total_users: 13, active_users: 7, new_this_week: 2,
  total_artists: 5, total_bookings: 24, total_revenue: 292320,
};

const RECENT_BOOKINGS = [
  { id: "1", customer: "Priya Sharma", service: "Bridal Makeup", artist: "Meena K.", status: "Confirmed", time: "2 hrs ago", amount: "₹29,500" },
  { id: "2", customer: "Ananya R.", service: "Party Makeup", artist: "Sai V.", status: "Pending", time: "5 hrs ago", amount: "₹10,000" },
  { id: "3", customer: "Divya M.", service: "Hair Styling", artist: "Aishwarya", status: "Completed", time: "1 day ago", amount: "₹6,700" },
  { id: "4", customer: "Kavitha N.", service: "Engagement Look", artist: "Meena K.", status: "Pending", time: "1 day ago", amount: "₹21,000" },
];

const TOP_ARTISTS = [
  { id: "1", name: "Meena K.", bookings: 12, rating: 4.9, revenue: "₹1,51,200" },
  { id: "2", name: "Sai Veeranna", bookings: 8, rating: 4.7, revenue: "₹82,300" },
  { id: "3", name: "Aishwarya", bookings: 4, rating: 4.5, revenue: "₹58,800" },
];

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ padding: 20 }}>
      {/* Breadcrumb */}
      <View className="flex-row items-center gap-x-2 mb-4">
        <Text className="text-slate-500 text-xs">Admin</Text>
        <Ionicons name="chevron-forward" size={14} color="#64748b" />
        <Text className="text-slate-400 text-xs font-medium">Dashboard</Text>
      </View>

      {/* Title */}
      <Text className="text-white text-[28px] font-extrabold mb-1">Dashboard</Text>
      <Text className="text-slate-500 text-sm mb-6">Overview of your makeup artist platform</Text>

      {/* KPI Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-5" contentContainerStyle={{ paddingHorizontal: 20 }}>
        <KPICard title="Total Users" value={STATS.total_users}
          icon={<Ionicons name="people" size={18} color="#3b82f6" />} trend="0%" trendPositive />
        <KPICard title="Active Users" value={STATS.active_users}
          icon={<Ionicons name="pulse" size={18} color="#22c55e" />} trend="0%" trendPositive />
        <KPICard title="New This Week" value={STATS.new_this_week}
          icon={<Ionicons name="trending-up" size={18} color="#f59e0b" />} trend="+16.67%" trendPositive />
        <KPICard title="Total Artists" value={STATS.total_artists}
          icon={<Ionicons name="brush" size={18} color="#a855f7" />} trend="+2" trendPositive />
        <KPICard title="Total Bookings" value={STATS.total_bookings}
          icon={<Ionicons name="calendar" size={18} color="#06b6d4" />} trend="+5" trendPositive />
        <KPICard title="Revenue" value={`₹${STATS.total_revenue}`}
          icon={<Ionicons name="cash" size={18} color="#ef4444" />} trend="+12%" trendPositive />
      </ScrollView>

      {/* Recent Bookings */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg font-bold">Recent Bookings</Text>
          <TouchableOpacity className="flex-row items-center gap-x-1">
            <Text className="text-accent text-xs font-semibold">View All</Text>
            <Ionicons name="chevron-forward" size={14} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        {RECENT_BOOKINGS.map((b) => (
          <View key={b.id} className="flex-row justify-between items-center bg-dark-700 p-4 rounded-xl mb-3 border border-white/5">
            <View className="flex-row items-center gap-x-3 flex-1">
              <Avatar name={b.customer} size={42} />
              <View className="flex-1">
                <Text className="text-white text-sm font-semibold">{b.customer}</Text>
                <Text className="text-slate-400 text-xs mt-0.5">{b.service}</Text>
                <Text className="text-slate-500 text-[10px] mt-1">
                  <Ionicons name="brush-outline" size={10} color="#64748b" /> {b.artist}
                </Text>
              </View>
            </View>
            <View className="items-end gap-y-1">
              <Text className="text-white text-sm font-bold">{b.amount}</Text>
              <StatusBadge status={b.status} />
              <Text className="text-slate-500 text-[10px]">
                <Ionicons name="time-outline" size={10} color="#64748b" /> {b.time}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Top Artists */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg font-bold">Top Artists</Text>
          <TouchableOpacity className="flex-row items-center gap-x-1">
            <Text className="text-accent text-xs font-semibold">View All</Text>
            <Ionicons name="chevron-forward" size={14} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        {TOP_ARTISTS.map((a, index) => (
          <View key={a.id} className="flex-row items-center bg-dark-700 p-4 rounded-xl mb-3 border border-white/5 gap-x-3">
            <View className="w-7 h-7 rounded-full bg-accent/15 items-center justify-center">
              <Text className="text-accent text-xs font-bold">#{index + 1}</Text>
            </View>
            <Avatar name={a.name} size={38} />
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">{a.name}</Text>
              <Text className="text-slate-500 text-xs mt-0.5">{a.bookings} bookings · ★ {a.rating}</Text>
            </View>
            <Text className="text-success text-sm font-bold">{a.revenue}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View className="mb-10">
        <Text className="text-white text-lg font-bold mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-3">
          {[
            { icon: "person-add", label: "Add User", color: "#3b82f6" },
            { icon: "brush", label: "Add Artist", color: "#a855f7" },
            { icon: "cut", label: "Add Service", color: "#f59e0b" },
            { icon: "calendar-outline", label: "Bookings", color: "#06b6d4" },
            { icon: "star", label: "Reviews", color: "#ef4444" },
            { icon: "card", label: "Payments", color: "#22c55e" },
          ].map((action) => (
            <TouchableOpacity key={action.label} className="w-[30%] bg-dark-700 rounded-xl p-4 items-center border border-white/5 gap-y-2">
              <View className="w-11 h-11 rounded-xl bg-white/5 items-center justify-center">
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text className="text-slate-400 text-[10px] font-medium text-center">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}