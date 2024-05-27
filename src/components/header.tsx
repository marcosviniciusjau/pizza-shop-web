import { Separator } from '@radix-ui/react-separator'
import { Home, Pizza, UtensilsCrossed } from 'lucide-react'

import { NavLink } from './nav-link'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Pizza className="h-6 w-6" />
        <Separator className="h-6" orientation="vertical" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-6 w-6" />
            Início
          </NavLink>

          <NavLink to="/orders">
            <UtensilsCrossed className="h-6 w-6" />
            Pedidos
          </NavLink>
        </nav>
      </div>
    </div>
  )
}
