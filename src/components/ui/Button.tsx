import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import styles from './Button.module.css'

type Variant = 'solid' | 'quiet'
type Surface = 'dark' | 'light'

type CommonProps = {
  variant?: Variant
  /** Fundo sobre o qual o botão aparece; define o contraste. */
  surface?: Surface
  children: ReactNode
}

function classes(variant: Variant, surface: Surface, extra?: string) {
  return [styles.button, styles[variant], styles[surface], extra].filter(Boolean).join(' ')
}

export function Button({
  variant = 'solid',
  surface = 'light',
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, surface, className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'solid',
  surface = 'light',
  className,
  children,
  ...rest
}: CommonProps & LinkProps) {
  return (
    <Link className={classes(variant, surface, className)} {...rest}>
      {children}
    </Link>
  )
}
