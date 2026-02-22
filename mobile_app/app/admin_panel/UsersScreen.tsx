import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import KPICard from "../../components/admin/KPICard";
import Avatar from "../../components/admin/Avatar";
import StatusBadge from "../../components/admin/StatusBadge";
import RoleBadge from "../../components/admin/RoleBadge";
import SectionHeader from "../../components/admin/SectionHeader";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import SelectDropdown from "../../components/admin/SelectDropdown";
import { toast } from "../../utils/toast";

const USERS = [
  { id: "13", name: "Test", email: "test@hashagile.com", phone: "1235846978", role: "customer", status: "Inactive", joined: "Dec 1, 2025", lastActive: "Dec 1, 2025" },
  { id: "12", name: "Sai", email: "sai@hashagile.com", phone: "918667220572", role: "customer", status: "Inactive", joined: "Nov 26, 2025", lastActive: "Nov 26, 2025" },
  { id: "11", name: "Sai Veeranna", email: "saiveeranna.chikkam@hashagile.com", phone: "7673932161", role: "artist", status: "Active", joined: "Nov 26, 2025", lastActive: "Nov 26, 2025" },
  { id: "10", name: "Aishwarya", email: "a@gmail.com", phone: "9630852741", role: "artist", status: "Active", joined: "Nov 14, 2025", lastActive: "Nov 14, 2025" },
  { id: "9", name: "Priya Sharma", email: "priya@gmail.com", phone: "8523697410", role: "customer", status: "Active", joined: "Oct 20, 2025", lastActive: "Feb 20, 2026" },
  { id: "8", name: "Admin User", email: "admin@artistapp.com", phone: "9876543210", role: "admin", status: "Active", joined: "Jan 1, 2025", lastActive: "Feb 22, 2026" },
  { id: "7", name: "Meena K.", email: "meena@artistapp.com", phone: "9988776655", role: "artist", status: "Active", joined: "Mar 15, 2025", lastActive: "Feb 21, 2026" },
];

const ROLE_FILTERS = ["All Roles", "Admin", "Artist", "Customer"];
const STATUS_FILTERS = ["All Status", "Active", "Inactive", "Suspended"];

export default function UsersScreen() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filteredUsers = useMemo(() => {
    return USERS.filter((u) => {
      const s = search.toLowerCase();
      const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      const matchRole = roleFilter === "All Roles" || u.role.toLowerCase() === roleFilter.toLowerCase();
      const matchStatus = statusFilter === "All Status" || u.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchRole && matchStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const stats = {
    total: USERS.length,
    active: USERS.filter(u => u.status === "Active").length,
    newThisWeek: 2,
    totalRoles: 3,
  };

  return (
    <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ padding: 20 }}>
      {/* Breadcrumb */}
      <View className="flex-row items-center gap-x-2 mb-4">
        <Text className="text-slate-500 text-xs">Admin</Text>
        <Ionicons name="chevron-forward" size={14} color="#64748b" />
        <Text className="text-slate-400 text-xs font-medium">Users</Text>
      </View>

      <SectionHeader title="User Management" subtitle="Manage and monitor all users in the system"
        actionLabel="Add User" onAction={() => toast.success("Opening Add User form...")} />

      {/* KPIs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-5" contentContainerStyle={{ paddingHorizontal: 20 }}>
        <KPICard title="Total Users" value={stats.total}
          icon={<Ionicons name="people" size={18} color="#3b82f6" />} trend="0%" trendPositive />
        <KPICard title="Active Users" value={stats.active}
          icon={<Ionicons name="pulse" size={18} color="#22c55e" />} trend="0%" trendPositive />
        <KPICard title="New This Week" value={stats.newThisWeek}
          icon={<Ionicons name="trending-up" size={18} color="#f59e0b" />} trend="+16.67%" trendPositive />
        <KPICard title="Total Roles" value={stats.totalRoles}
          icon={<Ionicons name="shield-checkmark" size={18} color="#a855f7" />} />
      </ScrollView>

      <SearchFilterBar searchValue={search} onSearchChange={setSearch}
        placeholder="Search by name or email..."
        filterOptions={ROLE_FILTERS} selectedFilter={roleFilter} onFilterChange={setRoleFilter}
        statusOptions={STATUS_FILTERS} selectedStatus={statusFilter} onStatusChange={setStatusFilter} />

      {/* Column headers */}
      <View className="flex-row px-4 py-3 mb-2">
        <Text className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider flex-[2]">USER</Text>
        <Text className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider flex-[1.5]">CONTACT</Text>
        <Text className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider flex-[0.8]">ROLE</Text>
      </View>

      {/* Empty state */}
      {filteredUsers.length === 0 && (
        <View className="items-center justify-center py-16 gap-y-3">
          <Ionicons name="search-outline" size={48} color="#64748b" />
          <Text className="text-slate-500 text-base">No users found</Text>
        </View>
      )}

      {/* User Cards */}
      {filteredUsers.map((user) => (
        <View key={user.id} className="bg-dark-700 rounded-xl p-4 mb-3 border border-white/5">
          {/* Top: Avatar + Name + Role badge */}
          <View className="flex-row items-center gap-x-3 mb-3">
            <Avatar name={user.name} size={36} />
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">{user.name}</Text>
              <Text className="text-slate-500 text-[10px] mt-0.5">ID: {user.id}</Text>
            </View>
            <View className="items-end gap-y-1">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </View>
          </View>

          {/* Contact info */}
          <View className="mb-3 gap-y-1">
            <Text className="text-slate-400 text-xs" numberOfLines={1}>
              <Ionicons name="mail-outline" size={11} color="#64748b" /> {user.email}
            </Text>
            <Text className="text-slate-400 text-xs">
              <Ionicons name="call-outline" size={11} color="#64748b" /> {user.phone}
            </Text>
          </View>

          {/* Footer: Dates + Actions */}
          <View className="flex-row justify-between items-center border-t border-white/5 pt-3">
            <View className="gap-y-0.5">
              <Text className="text-slate-500 text-[10px]">Joined: <Text className="text-slate-400">{user.joined}</Text></Text>
              <Text className="text-slate-500 text-[10px]">Active: <Text className="text-slate-400">{user.lastActive}</Text></Text>
            </View>
            <View className="flex-row gap-x-2">
              <TouchableOpacity className="w-[34] h-[34] rounded-md bg-dark-800 items-center justify-center border border-white/5"
                onPress={() => toast.info(`Viewing ${user.name}`)}>
                <Ionicons name="eye-outline" size={16} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity className="w-[34] h-[34] rounded-md bg-dark-800 items-center justify-center border border-white/5"
                onPress={() => toast.info(`Editing ${user.name}`)}>
                <Ionicons name="create-outline" size={16} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity className="w-[34] h-[34] rounded-md bg-danger/10 items-center justify-center border border-danger/20"
                onPress={() => toast.error(`${user.name} deleted`)}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <View className="h-10" />
    </ScrollView>
  );
}