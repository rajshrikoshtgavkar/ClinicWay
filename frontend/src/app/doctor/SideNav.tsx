"use client";
import { SIDENAV_ITEMS } from "./constant";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import axios from "axios";
import {
  IconBriefcase,
  IconChevronRight,
  IconHospitalCircle,
  IconLogout,
  IconMenu,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ThemeToggler from "@/components/Navbar/ThemeToggler";
import { SideNavItem, User } from "@/Types";
import Loading from "@/components/Loading";

const SideNav = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth() as { user: User };
  const handleLogout = async () => {
    toast.promise(axios.get("/spring-server/api/auth/logout"), {
      loading: "Logging out...",
      success: () => {
        router.push("/");
        return "Logged out successfully";
      },
      error: "Error logging out",
    });
  };
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  if (!user) return <Loading />;
  return (
    <>
      <div className={`drawer lg:drawer-open max-h-screen`}>
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar justify-between bg-base-300 w-full pl-10">
            <div className="lg:flex items-center justify-end space-x-2 hidden text-base-content">
              <span className="text-base font-semibold">Home</span>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <span className="text-sm">
                    <IconChevronRight />
                  </span>
                  <span className="text-base capitalize hover:text-primary transition">
                    {decodeURIComponent(segment.replace(/-/g, " "))}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <IconMenu className="h-6 w-6 text-base-content" />
              </label>
            </div>

            <div className="navbar lg:hidden px-2">
              <Link
                href={`/${user.role.toLowerCase()}/dashboard`}
                className="flex h-16 w-full items-center space-x-3"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-2 rounded-lg bg-linear-to-r from-primary to-secondary group-hover:from-secondary group-hover:to-primary transition-colors"
                >
                  <IconBriefcase className="h-5 w-5 text-base-content" />
                </motion.div>

                <span className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors">
                  Clinic-Way
                </span>
              </Link>

              <div className="navbar-end space-x-4">
                <ThemeToggler />
                <div className="dropdown dropdown-left cursor-pointer bg-transparent">
                  <img
                    src={user.profileImage!}
                    alt="Avatar"
                    className="rounded-full h-12 w-12"
                    tabIndex={0}
                    role="button"
                  />
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-72 p-2 shadow"
                  >
                    {/* User Initial */}
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary text-base-conten rounded-full text-xl font-bold">
                        {user?.name[0].toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-lg font-semibold text-base-content">
                        {user.name}
                      </span>
                    </div>
                    <hr className="my-2 border-base-content" />
                    <div className="flex flex-col">
                      <Link
                        className="btn btn-neutral btn-outline mb-2"
                        href={`/${user.role.toLowerCase()}/profile`}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-left px-4 py-2 text-base-content text-dark hover:bg-base-200 transition duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </ul>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <ul className="menu menu-horizontal flex items-center space-x-4">
                <ThemeToggler />
                <div className="dropdown dropdown-left cursor-pointer bg-transparent">
                  <img
                    src={user.profileImage!}
                    alt="Avatar"
                    className="rounded-full h-12 w-12"
                    tabIndex={0}
                    role="button"
                  />
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-72 p-2 shadow"
                  >
                    {/* User Initial */}
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary text-base-conten rounded-full text-xl font-bold">
                        {user.name[0].toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-lg font-semibold text-base-content">
                        {user.name}
                      </span>
                    </div>
                    <hr className="my-2 border-base-content" />
                    <div className="flex flex-col">
                      <Link
                        className="btn btn-neutral btn-outline mb-2"
                        href={`/${user.role.toLowerCase()}/profile`}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="btn btn-error btn-outline"
                      >
                        <IconLogout className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </ul>
                </div>
              </ul>
            </div>
          </div>
          <div>
            {" "}
            <main
              className={`overflow-y-auto h-[calc(100vh-5.3rem)] bg-base-100 text-base-content`}
            >
              {children}
            </main>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            className="drawer-overlay"
            aria-label="close sidebar"
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <Link
              href={`/${user.role.toLowerCase()}/dashboard`}
              className="flex h-16 w-full flex-row items-center justify-center space-x-3 border-b border-base-content md:justify-start md:px-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-2 rounded-lg bg-linear-to-r from-primary to-secondary group-hover:from-secondary group-hover:to-primary transition-colors"
              >
                <IconHospitalCircle className="h-5 w-5 text-base-content" />
              </motion.div>

              <span className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors">
                Clinic-Way
              </span>
            </Link>
            <div className="flex flex-col space-y-2 mt-10 md:px-6">
              {SIDENAV_ITEMS.map((item, idx) => (
                <MenuItem key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();

  const activeClasses = "bg-base-300 text-base-content";
  const inactiveClasses =
    "text-base-content hover:text-base-content hover:bg-base-100";

  return (
    <Link
      href={item.path}
      className={`flex flex-row items-center space-x-4 rounded-lg p-2 ${
        item.path === pathname ? activeClasses : inactiveClasses
      }`}
    >
      {item.icon}
      <span className="text-lg font-medium">{item.title}</span>
    </Link>
  );
};
