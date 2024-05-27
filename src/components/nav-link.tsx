import { ReactNode } from 'react'
import { LinkProps } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'

export type NavLinkProps = LinkProps & {
  children: ReactNode
}

export function NavLink({ children, ...rest }: NavLinkProps) {
  const { pathname } = useLocation()
  return (
    <Link
      data-current={pathname === rest.to}
      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground"
      {...rest}
    >
      {children}
    </Link>
  )
}
