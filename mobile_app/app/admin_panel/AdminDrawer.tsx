import React from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "./DashboardScreen";
import UsersScreen from "./UsersScreen";
import ArtistsScreen from "./ArtistsScreen";
import ServicesScreen from "./ServicesScreen";
import BookingsScreen from "./BookingsScreen";
import ReviewsScreen from "./ReviewsScreen";
import PaymentsScreen from "./PaymentsScreen";

const Drawer = createDrawerNavigator();

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface NavItem {
  name: string;
  label: string;
  icon: IoniconsName;
  component: React.ComponentType<any>;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", label: "Dashboard", icon: "grid-outline", component: DashboardScreen },
  { name: "Users", label: "Users", icon: "people-outline", component: UsersScreen },
  { name: "Artists", label: "Artists", icon: "brush-outline", component: ArtistsScreen },
  { name: "Services", label: "Services", icon: "cut-outline", component: ServicesScreen },
  { name: "Bookings", label: "Bookings", icon: "calendar-outline", component: BookingsScreen },
  { name: "Reviews", label: "Reviews", icon: "star-outline", component: ReviewsScreen },
  { name: "Payments", label: "Payments", icon: "card-outline", component: PaymentsScreen },
];

function CustomDrawerContent(props: any) {
  const { state, navigation } = props;
  const activeRoute = state.routeNames[state.index];

  return (
    <DrawerContentScrollView {...props}
      style={{ backgroundColor: "#0f172a" }}
      contentContainerStyle={{ flex: 1, paddingTop: 16 }}
    >
      {/* Brand */}
      <View className="flex-row items-center px-5 pb-5 gap-x-3">
        <View className="w-[42] h-[42] rounded-xl bg-accent/15 items-center justify-center">
          <Ionicons name="color-palette" size={24} color="#3b82f6" />
        </View>
        <View>
          <Text className="text-white text-lg font-bold tracking-tight">Admin Panel</Text>
          <Text className="text-slate-500 text-[10px] mt-0.5">Makeup Artist App</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-white/5 mx-5 my-3" />

      {/* Nav Items */}
      {NAV_ITEMS.map((item) => {
        const isActive = activeRoute === item.name;
        return (
          <DrawerItem
            key={item.name}
            label={item.label}
            icon={() => (
              <Ionicons
                name={isActive ? (item.icon.replace("-outline", "") as IoniconsName) : item.icon}
                size={20}
                color={isActive ? "#3b82f6" : "#94a3b8"}
              />
            )}
            onPress={() => navigation.navigate(item.name)}
            labelStyle={{
              color: isActive ? "#3b82f6" : "#94a3b8",
              fontSize: 14,
              fontWeight: isActive ? "600" : "500",
              marginLeft: -4,
            }}
            style={{
              borderRadius: 10,
              marginHorizontal: 8,
              marginVertical: 1,
              backgroundColor: isActive ? "rgba(59, 130, 246, 0.12)" : "transparent",
              borderLeftWidth: isActive ? 3 : 0,
              borderLeftColor: "#3b82f6",
            }}
          />
        );
      })}

      {/* Spacer */}
      <View className="flex-1 min-h-[20]" />

      {/* Divider */}
      <View className="h-px bg-white/5 mx-5 my-3" />

      {/* User Info */}
      <View className="flex-row items-center px-5 py-3 gap-x-3">
        <View className="w-9 h-9 rounded-full bg-accent items-center justify-center">
          <Text className="text-white font-bold text-sm">A</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white text-xs font-semibold">admin@artistapp.com</Text>
          <Text className="text-slate-500 text-[10px] capitalize">Admin</Text>
        </View>
      </View>

      {/* Settings & Logout */}
      <DrawerItem
        label="Settings"
        icon={() => <Ionicons name="settings-outline" size={20} color="#94a3b8" />}
        onPress={() => { }}
        labelStyle={{ color: "#94a3b8", fontSize: 14, fontWeight: "500", marginLeft: -4 }}
        style={{ borderRadius: 10, marginHorizontal: 8 }}
      />
      <DrawerItem
        label="Logout"
        icon={() => <Ionicons name="log-out-outline" size={20} color="#ef4444" />}
        onPress={() => { }}
        labelStyle={{ color: "#ef4444", fontSize: 14, fontWeight: "500", marginLeft: -4 }}
        style={{ borderRadius: 10, marginHorizontal: 8, marginBottom: 16 }}
      />
    </DrawerContentScrollView>
  );
}

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0b1120",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255, 255, 255, 0.06)",
        },
        headerTintColor: "#f1f5f9",
        headerTitleStyle: { fontWeight: "600", fontSize: 16 },
        drawerStyle: { backgroundColor: "#0f172a", width: 280 },
        drawerType: "front",
        overlayColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      {NAV_ITEMS.map((item) => (
        <Drawer.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            title: item.label,
            headerRight: () => (
              <View className="flex-row items-center mr-4">
                <Ionicons name="notifications-outline" size={22} color="#94a3b8" style={{ marginRight: 16 }} />
                <View className="w-8 h-8 rounded-full bg-accent items-center justify-center mr-2">
                  <Text className="text-white font-bold text-xs">A</Text>
                </View>
              </View>
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}