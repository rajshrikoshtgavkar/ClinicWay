import { motion } from "framer-motion";
import { IconHospital, IconMenu } from "@tabler/icons-react";
import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathName = usePathname();
  const navItems = [
    { name: "About", path: "#about" },
    { name: "Features", path: "#features" },
    { name: "Contact", path: "#contact" },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`navbar bg-base-100 backdrop-blur-md border-b border-base-content lg:px-10 ${
          pathName === "/"
            ? "fixed top-0 left-0 right-0 z-50"
            : "sticky top-0 left-0 right-0 z-50 shadow-md"
        }`}
      >
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <IconMenu className="h-6 w-6" />
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={item.path} className="btn my-2 btn-ghost">
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-2 rounded-lg bg-linear-to-r from-primary to-secondary group-hover:from-secondary group-hover:to-primary transition-colors"
            >
              <IconHospital className="h-5 w-5 text-base-content" />
            </motion.div>

            <span className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors">
              Clinic-Way
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navItems.map((item, i) => (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link
                  href={item.path}
                  className="block py-2 text-base-content hover:text-primary transition-colors font-medium text-base"
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="navbar-end space-x-2">
          <ThemeToggler />

          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link className="btn btn-outline btn-accent" href="/sign-up">
              Get Started
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link href="/login" className="btn btn-secondary">
              Login
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
