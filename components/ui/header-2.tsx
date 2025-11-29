'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useConvexAuth } from 'convex/react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

import { Button, buttonVariants } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { CreditsDisplay } from '@/components/credits-display';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const publicLinks = [
	{ label: 'Verify', href: '/#verify' },
	{ label: 'How it Works', href: '/#how-it-works' },
	{ label: 'Pricing', href: '/credits' },
];

const privateLinks = [
	{ label: 'Dashboard', href: '/dashboard' },
	{ label: 'Verify', href: '/verify' },
	{ label: 'Saved Analyses', href: '/analyses' },
];

const moreLinks = [
	{ label: 'For Teams', href: '/#use-cases' },
	{ label: 'Docs', href: '/#docs' },
	{ label: 'Contact', href: '/#contact' },
];

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const [mounted, setMounted] = React.useState(false);
	const { isAuthenticated } = useConvexAuth();
	const primaryLinks = isAuthenticated ? privateLinks : publicLinks;
	const pathname = usePathname();

	React.useEffect(() => {
		setMounted(true);
	}, []);

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

	if (pathname?.startsWith('/dashboard')) {
		return null;
	}

	return (
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-7xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
				{
					'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-6xl md:shadow':
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
					{mounted && (
						<>
							<Image
								src="/Untitled (200 x 50 mm) (5).png"
								alt="TinLens"
								width={160}
								height={40}
								className="h-10 w-auto dark:hidden"
							/>
							<Image
								src="/Untitled (200 x 50 mm) (4).png"
								alt="TinLens"
								width={160}
								height={40}
								className="hidden h-10 w-auto dark:block"
							/>
						</>
					)}
				</Link>

				<div className="hidden items-center gap-2 md:flex">
					{primaryLinks.map((link) => (
						<Link key={link.label} className={buttonVariants({ variant: 'ghost' })} href={link.href}>
							{link.label}
						</Link>
					))}
					{!isAuthenticated && (
						<DropdownMenu>
							<DropdownMenuTrigger className={buttonVariants({ variant: 'ghost' })}>
								More
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{moreLinks.map((item) => (
									<DropdownMenuItem key={item.label} asChild>
										<Link href={item.href}>{item.label}</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
					{isAuthenticated && <CreditsDisplay />}
					{isAuthenticated ? (
						<UserButton 
							appearance={{
								elements: {
									avatarBox: 'h-9 w-9',
								},
							}}
							afterSignOutUrl="/"
						/>
					) : (
						<Link href="/sign-up">
							<ShinyButton className="px-6 py-3">Get Started</ShinyButton>
						</Link>
					)}
				</div>

				<Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>

			<div
				className={cn(
					'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
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
						{primaryLinks.map((link) => (
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
						{!isAuthenticated && (
							<div className="rounded-xl border border-dashed border-primary/30 p-3">
								<p className="text-sm font-semibold text-muted-foreground">More</p>
								<div className="mt-2 flex flex-col gap-1">
									{moreLinks.map((item) => (
										<Link key={item.label} href={item.href} className="text-sm text-primary">
											{item.label}
										</Link>
									))}
								</div>
							</div>
						)}
						{isAuthenticated && <CreditsDisplay className="w-full justify-center border border-dashed px-3 py-1.5" />}
					</div>
					<div className="flex flex-col gap-2">
						{isAuthenticated ? (
							<div className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 bg-card p-3">
								<UserButton 
									appearance={{
										elements: {
											avatarBox: 'h-10 w-10',
										},
									}}
									afterSignOutUrl="/"
								/>
								<span className="text-sm font-medium">My Profile</span>
							</div>
						) : (
							<Link href="/sign-up" className="w-full">
								<ShinyButton className="w-full px-6 py-3">Get Started</ShinyButton>
							</Link>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
