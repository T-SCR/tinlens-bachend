'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{
			label: 'Features',
			href: '/',
		},
		{
			label: 'News',
			href: '/news',
		},
		{
			label: 'Analyses',
			href: '/analyses',
		},
	];

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
				{
					'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow':
						scrolled && !open,
					'bg-background/90': open,
				},
			)}
		>
			<nav
				className={cn(
					'flex h-20 w-full items-center justify-between px-6 md:h-20 md:transition-all md:ease-out',
					{
						'md:px-4': scrolled,
					},
				)}
			>
				<Link href="/" className="flex items-center gap-2">
					<Image src="/logo-light.png" alt="TinLens" width={180} height={50} className="h-12 w-auto dark:hidden" />
					<Image src="/logo-dark.png" alt="TinLens" width={180} height={50} className="h-12 w-auto hidden dark:block" />
				</Link>
				<div className="hidden items-center gap-3 md:flex">
					{links.map((link, i) => (
						<Link key={i} className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={link.href}>
							{link.label}
						</Link>
					))}
					<Link href="/sign-in">
						<Button variant="outline" size="lg">Sign In</Button>
					</Link>
					<Link href="/sign-up">
						<Button size="lg">Get Started</Button>
					</Link>
				</div>
				<Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>

			<div
				className={cn(
					'bg-background/90 fixed top-20 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
					open ? 'block' : 'hidden',
				)}
			>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
						'flex h-full w-full flex-col justify-between gap-y-2 p-4',
					)}
				>
					<div className="grid gap-y-2">
						{links.map((link) => (
							<Link
								key={link.label}
								className={buttonVariants({
									variant: 'ghost',
									className: 'justify-start',
								})}
								href={link.href}
							>
								{link.label}
							</Link>
						))}
					</div>
					<div className="flex flex-col gap-2">
						<Link href="/sign-in" className="w-full">
							<Button variant="outline" className="w-full">
								Sign In
							</Button>
						</Link>
						<Link href="/sign-up" className="w-full">
							<Button className="w-full">Get Started</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}
