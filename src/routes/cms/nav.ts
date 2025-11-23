export const NAV_ITEMS = [
	{
		label: "Dashboard",
		href: "/cms",
	},
	{
		label: "Services",
		children: [
			{ label: "Services Management", href: "/cms/services" },
		]
	},
	{
		label: "Projects",
		children: [
			{ label: "Project Management", href: "/cms/projects" },
			{ label: "Clients Management", href: "/cms/clients" },
		]
	},

	{
		label: "Media",
		children: [
			{ label: "Library", href: "/cms/media" },
		]
	}
];
