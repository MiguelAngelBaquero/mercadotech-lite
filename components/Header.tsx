import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import { CartLink } from "./CartLink";

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            M
          </span>
          <span>
            Mercado<strong>Tech</strong>
          </span>
        </Link>
        <nav className="header-nav">
          {user ? (
            <>
              {user.isAdmin && (
                <Link href="/admin" className="nav-link">
                  Admin
                </Link>
              )}
              <Link href="/mis-pedidos" className="nav-link">
                Mis pedidos
              </Link>
              <form action={logoutAction}>
                <button className="nav-link nav-button" type="submit" title={`Sesión de ${user.name}`}>
                  Salir
                </button>
              </form>
            </>
          ) : (
            <Link href="/ingresar" className="nav-link">
              Ingresar
            </Link>
          )}
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
